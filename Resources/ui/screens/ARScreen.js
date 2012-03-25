/*
 * ARScreen
 * ==========
 *
 * This file contains the Augmented Reality window.
 *
 * It displays the data from google place.
 *
 * Using callbacks to process the next stage of the build
 *
 */

/*
 * Load the required modules for this function
 */
var layout    =    require('/ui/layout');
var images    =    require('/ui/images');
var common    =    require('/tools/common');
var activity    =    require('/ui/common/activity');
var persHandler    =    require('/tools/persHandler');
var augmentedReality    =    require('/tools/augmentedReality');

/*
 * The variables needed to pass views around for changes...
 */

var arWin    =    null;
var arBaseView    =    null;
var arRadarImg    =    null;
var googleData    =    null;
var cameraView    =    null;
var poiView1    =    null;
var poiView2    =    null;
var poiView3    =    null;
var poiView4    =    null;
var screenWidth    =    parseInt(persHandler.retPersData({
    type :    2
}), 10);
var screenHeight    =    parseInt(persHandler.retPersData({
    type :    3
}), 10);

/*
 * The required flags to only allow processing when the processing is not already happening
 */

var rotateFlag    =    true;

function showARDetail(inParam)
{
    var arDetailView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        bottom :    0,
        backgroundColor :    "#000000",
        opacity :    0.75,
        zIndex :    125
    });
    var arDetailTitle    =    Ti.UI.createLabel({
        top :    '75dp',
        height :    '50dp',
        left :    '30dp',
        right :    '30dp',
        text :    inParam.TITLE,
        textAlign :    'center',
        color :    layout.css.hs.tbfnc,
        font : {
            fontFamily :    layout.css.hs.tbfnf,
            fontWeight :    layout.css.hs.tbfnw,
            fontSize :    layout.css.hs.tbfns
        }
    });
    var arDetailDesc    =    Ti.UI.createTextArea({
        top :    '130dp',
        height :    '300dp',
        left :    '30dp',
        right :    '30dp',
        backgroundColor :    'transparent',
        editable :    false,
        value :    inParam.DESC,
        textAlign :    'center',
        color :    layout.css.hs.tbfnc,
        font : {
            fontFamily :    layout.css.hs.tbfnf,
            fontWeight :    layout.css.hs.tbfnw,
            fontSize :    layout.css.hs.tbfns
        }
    });
    arDetailView.add(arDetailTitle);
    arDetailView.add(arDetailDesc);

    /*
     * The close button
     */
    var arDetailClose    =    Ti.UI.createLabel({
        bottom :    '25dp',
        width :    layout.css.butt.wi,
        height :    layout.css.butt.hi,
        text :    Ti.Locale.getString('butt_close'),
        textAlign :    layout.css.butt.ta,
        backgroundColor :    layout.css.butt.bkc,
        color :    layout.css.butt.fc,
        borderRadius :    layout.css.butt.br,
        borderWidth :    layout.css.butt.bw,
        borderColor :    layout.css.butt.bc,
        font : {
            fontFamily :    layout.css.butt.ff,
            fontWeight :    layout.css.butt.fw,
            fontSize :    layout.css.butt.fs
        },
        zIndex :    150
    });
    arDetailView.add(arDetailClose);
    /*
     * The event listeners to facilitate actions
     */
    arDetailClose.addEventListener('touchstart', function()
    {
        arDetailClose.backgroundColor    =    layout.css.butt.tbkc;
        arDetailClose.borderColor    =    layout.css.butt.tbc;
        arDetailClose.color    =    layout.css.butt.tfc;
    });
    arDetailClose.addEventListener('touchend', function()
    {
        arDetailClose.backgroundColor    =    layout.css.butt.bkc;
        arDetailClose.borderColor    =    layout.css.butt.bc;
        arDetailClose.color    =    layout.css.butt.fc;
        arBaseView.remove(arDetailView);
        arDetailView    =    null;
    });
    arBaseView.add(arDetailView);
}

function finishedBuild()
{
    activity.removeActivityIndicator();
}

/*
 * rotateDisplay
 * =============
 *
 * These function rotates the Augmented Reality Display as the device is rotated
 */
function removeFlag()
{
    rotateFlag    =    false;
    finishedBuild();
}

function rotateDisplay()
{
    if(!rotateFlag) {
        rotateFlag    =    true;
        var currBearing    =    parseInt(persHandler.retPersData({
            type :    4
        }), 10);
        if(currBearing  <=  90) {
            poiView1.right    =    ((currBearing  -  0)  *  (screenWidth  /  90))  +  (screenWidth  *  3);
            poiView2.right    =    poiView1.right  -  screenWidth;
            poiView3.right    =    poiView2.right  -  screenWidth;
            poiView4.right    =    poiView1.right  +  screenWidth;
        }
        else
        if(currBearing  <=  180) {
            poiView2.right    =    ((currBearing  -  90)  *  (screenWidth  /  90))  +  (screenWidth  *  3);
            poiView3.right    =    poiView2.right  -  screenWidth;
            poiView4.right    =    poiView3.right  -  screenWidth;
            poiView1.right    =    poiView2.right  +  screenWidth;
        }
        else
        if(currBearing  <=  270) {
            poiView3.right    =    ((currBearing  -  180)  *  (screenWidth  /  90))  +  (screenWidth  *  3);
            poiView4.right    =    poiView3.right  -  screenWidth;
            poiView1.right    =    poiView4.right  -  screenWidth;
            poiView2.right    =    poiView3.right  +  screenWidth;
        }
        else {
            poiView4.right    =    ((currBearing  -  270)  *  (screenWidth  /  90))  +  (screenWidth  *  3);
            poiView1.right    =    poiView4.right  -  screenWidth;
            poiView2.right    =    poiView1.right  -  screenWidth;
            poiView3.right    =    poiView4.right  +  screenWidth;
        }
        arRadarImg.transform    =    Ti.UI.create2DMatrix().rotate(-augmentedReality.toDegree(augmentedReality.toRadius(currBearing)));

        removeFlag();
    }
}

/*
 * startMovement
 * =============
 *
 * This function starts the movement of the display and places the radar blips
 * and display panels in the right position.
 *
 * When its finished the activity indicator is removed.
 */
function startMovement()
{
    /*
     * Now set the screen position of blips and POI's
     */
    rotateFlag    =    false;
    rotateDisplay();
}

/*
 * addPOIEvent
 * ===========
 *
 * This function creates and event listener for each POI.
 *
 * It has been separated from the loop as it is bad practice to add
 * event listeners in the loop.
 *
 */
function addPOIEvent(inParam)
{
    inParam.VIEW.addEventListener('click', function()
    {
        showARDetail({
            TITLE :    googleData[inParam.POS].name,
            DESC :    googleData[inParam.POS].vicinity
        });
    });
}

/*
 * buildARData
 * ==========
 *
 * This function builds the radar blips .....
 */

function buildARData(callBack)
{
    activity.activityMessage({
        MESS :    Ti.Locale.getString('A0005')
    });
    for(var iPos    =    0; iPos  <  googleData.length; iPos++) {
        // The POI's
        var scale    =    (10  /  googleData[iPos].distance).toFixed(2);

        if(scale  >=  1) {
            scale    =    1.00;
        }
        if(scale  <=  0.35) {
            scale    =    0.35;
        }
        var tmpDegCal    =    0;
        var tmpView    =    null;

        if(googleData[iPos].degree  <=  45  ||  googleData[iPos].degree  >=  315) {
            tmpDegCal    =    -45;
            tmpView    =    poiView1;
        }
        else
        if(googleData[iPos].degree  <=  135) {
            tmpDegCal    =    45;
            tmpView    =    poiView2;
        }
        else
        if(googleData[iPos].degree  <=  225) {
            tmpDegCal    =    135;
            tmpView    =    poiView3;
        }
        else {
            tmpDegCal    =    225;
            tmpView    =    poiView4;
        }        
        var tmpLeft    =    ((googleData[iPos].degree  -  tmpDegCal)  *  (screenWidth  /  90)) - ((100 * scale) / 2);
        var tmpTop    =    (screenHeight / 2)  *  scale;

        var poiItem    =    Ti.UI.createImageView({
            height :    100  *  scale,
            width :    100  *  scale,
            left :    tmpLeft,
            top :    tmpTop,
            image :    googleData[iPos].icon
        });
        addPOIEvent({
            VIEW :    poiItem,
            POS :    iPos
        });

        tmpView.add(poiItem);
        tmpView    =    null;

        // The Radar Blips ....
        var ro    =    ((images.file.radar.wCalc)  *  (googleData[iPos].distance.toFixed(4)  /  1000)  /  2);
        var centerX    =    ((images.file.radar.wCalc)  /  2)  +  (ro  *  Math.sin(googleData[iPos].bearing));
        var centerY    =    ((images.file.radar.wCalc)  /  2)  -  (ro  *  Math.cos(googleData[iPos].bearing));

        var displayBlip    =    Ti.UI.createView({
            height :    layout.css.ar.blip.height,
            width :    layout.css.ar.blip.width,
            backgroundColor :    layout.css.ar.blip.color,
            borderRadius :    2,
            top :    centerY  -  1,
            left :    centerX  -  1,
            lat :    googleData[iPos].location.lat,
            lng :    googleData[iPos].location.lng
        });
        arRadarImg.add(displayBlip);
    }
    startMovement();
}

/*
 * buildARDisplay
 * ==============
 *
 * This function builds the main display panels and adds the data to the screen.
 *
 * This function requires some explanation as to why it is done this way.
 *
 * In AR most solutions display all the POI's on the screen and then moves them
 * around hiding and showing the ones required.
 *
 * This takes a lot of processing and means that you get a jerky display.
 *
 * The solution below uses 4 views each representing a 90degree angle. The POI's
 * are then positioned within these views and the views moved.
 *
 */
function buildARDisplay(callBack)
{
    activity.activityMessage({
        MESS :    Ti.Locale.getString('A0006')
    });
    var poiDisplay    =    Ti.UI.createView({
        top :    0,
        height :    screenHeight,
        left :    0  -  (screenWidth  *  3),
        width :    (screenWidth  *  7),
        backgroundColor :    'transparent',
        zIndex :    50
    });
    poiView1    =    Ti.UI.createView({
        top :    0,
        height :    screenHeight,
        right :    0,
        width :    screenWidth
    });
    poiView2    =    Ti.UI.createView({
        top :    0,
        height :    screenHeight,
        right :    screenWidth,
        width :    screenWidth
    });
    poiView3    =    Ti.UI.createView({
        top :    0,
        height :    screenHeight,
        right :    (screenWidth  *  2),
        width :    screenWidth
    });
    poiView4    =    Ti.UI.createView({
        top :    0,
        height :    screenHeight,
        right :    -screenWidth,
        width :    screenWidth
    });
    poiDisplay.add(poiView1);
    poiDisplay.add(poiView2);
    poiDisplay.add(poiView3);
    poiDisplay.add(poiView4);

    arBaseView.add(poiDisplay);

    if(callBack) {
        callBack();
    }
}

function buildAROverlay()
{
    /*
     * Build the parent AR view
     *
     * This view is crucial to how the whole AR display works as you will see as the display is
     * developed.
     *
     * We initially have a single screen sized view with a transparent background containing the
     * Radar image. This is set with a zIndex of 10 and will always be behind the other views.
     *
     */
    arBaseView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        bottom :    0,
        backgroundColor :    'transparent',
        zIndex :    10
    });

    /*
     * The radar image
     *
     * Positioned top right.
     *
     */
    var arRadarBck    =    Ti.UI.createView({
        top :    '10dp',
        right :    '10dp',
        height :    images.file.radar.height,
        width :    images.file.radar.width,
        backgroundImage :    images.file.radar.file,
        zIndex :    30
    });
    /*
     * The radar view to rotate the blips...
     */
    arRadarImg    =    Ti.UI.createView({
        top :    0,
        left :    0,
        height :    images.file.radar.height,
        width :    images.file.radar.width,
        backgroundcolor :    'transparent',
        zIndex :    31
    });
    /*
     * Add the window components
     */
    arRadarBck.add(arRadarImg);
    arBaseView.add(arRadarBck);

    /*
     * The close button
     */
    var closeButton    =    Ti.UI.createLabel({
        bottom :    '25dp',
        width :    layout.css.butt.wi,
        height :    layout.css.butt.hi,
        text :    Ti.Locale.getString('butt_close'),
        textAlign :    layout.css.butt.ta,
        backgroundColor :    layout.css.butt.bkc,
        color :    layout.css.butt.fc,
        borderRadius :    layout.css.butt.br,
        borderWidth :    layout.css.butt.bw,
        borderColor :    layout.css.butt.bc,
        font : {
            fontFamily :    layout.css.butt.ff,
            fontWeight :    layout.css.butt.fw,
            fontSize :    layout.css.butt.fs
        },
        zIndex :    75
    });
    arBaseView.add(closeButton);
    /*
     * The event listeners to facilitate actions
     */
    closeButton.addEventListener('touchstart', function()
    {
        closeButton.backgroundColor    =    layout.css.butt.tbkc;
        closeButton.borderColor    =    layout.css.butt.tbc;
        closeButton.color    =    layout.css.butt.tfc;
    });
    closeButton.addEventListener('touchend', function()
    {
        closeButton.backgroundColor    =    layout.css.butt.bkc;
        closeButton.borderColor    =    layout.css.butt.bc;
        closeButton.color    =    layout.css.butt.fc;
        if(cameraView) {
            Ti.Media.hideCamera();
        }
        cameraView    =    null;
        /*
         * Now return control to the controller.
         */
        common.launchEvent({
            TYPE :    'startApp'
        });
    });
    /*
     * Making it legal adding the google logo as required for using places.
     */
    var googleLogo    =    Ti.UI.createImageView({
        bottom :    '5dp',
        right :    '5dp',
        height :    images.file.google.height,
        width :    images.file.google.width,
        image :    images.file.google.file
    });
    arBaseView.add(googleLogo);

    /*
     * build the radar blips
     */
    buildARDisplay(function()
    {
        buildARData();
    });

    if(cameraView) {
        Ti.Media.showCamera({
            success : function(event)
            {
            },
            cancel : function()
            {
            },
            error : function(error)
            {
                if(error.code  ==  Ti.Media.NO_CAMERA) {
                    common.launchEvent({
                        TYPE :    'ERROR',
                        MESS :    'E0006'
                    });
                }
                else {
                    common.launchEvent({
                        TYPE :    'ERROR',
                        MESS :    'E0006'
                    });
                }
            },
            mediaTypes :    [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO],
            showControls :    false,
            autohide :    false,
            autofocus :    "off",
            animated :    false,
            overlay :    arBaseView
        });
    }
    else {
        arWin.add(arBaseView);
    }
    return;
}

function loadARScreen(inParams)
{
    /*
     * Load the data in
     */
    googleData    =    inParams.DATA;
    cameraView    =    inParams.SERVICES.camera;

    arWin    =    Ti.UI.createWindow({
        backgroundColor :    layout.css.sbkc.hs,
        navBarHidden :    true,
        exitOnClose :    false,
        orientationModes :    [Ti.UI.PORTRAIT]
    });
    /*
     * Set orientation fixed for Android
     */
    arWin.orientationModes    =    [Ti.UI.PORTRAIT];

    /*
     * Add a close event listener to clean everything up nicely.
     */
    arWin.addEventListener('close', function()
    {
        arWin    =    null;
        arBaseView    =    null;
        arRadarImg    =    null;
        googleData    =    null;
    });

    /*
     * Open the window here so we can process the data separately.
     */
    arWin.open();

    activity.loadActivityIndicator({
        currWin :    arWin
    });
    activity.activityMessage({
        MESS :    Ti.Locale.getString('A0004')
    });
    /*
     * Build the data display
     */
    buildAROverlay();

    return arWin;
}

/*
 * Export the required functions for access
 */
exports.loadARScreen    =    loadARScreen;
exports.rotateDisplay    =    rotateDisplay;
