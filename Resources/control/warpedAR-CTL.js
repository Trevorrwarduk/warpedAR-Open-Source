/*
 * This file is only required by app.js and is the only file required by app.js.
 *
 * It is the control file for the whole application and contains all functions to control
 * the application flow.
 *
 * This file cannot be required in any other module as it is the parent.
 *
 * =======================================================================================
 * ALL FUNCTIONS ARE DEFINED AS LOCAL THEN EXPORTED IF REQUIRED
 * =======================================================================================
 */

/*
 * Require the required modules. Only ones needed at run time
 */

var layout    =    require('/ui/layout');
var common    =    require('/tools/common');
var activity    =    require('/ui/common/activity');
var locations    =    require('/services/location');
var persHandler    =    require('/tools/persHandler');
var googleFeed    =    require('/services/googleFeed');
var augmentedReality    =    require('/tools/augmentedReality');

Titanium.UI.setBackgroundColor(layout.css.sbkc.ab);

// Local variable to store services accessibility
var services    = {
    gpsON :    false,
    gprsON :    false,
    compON :    false,
    camera : false
};

// Local variable to store the windows
var homeWin    =    null;
var arWin    =    null;

// Local variable to store the amount of times the location has been requested
var locationCount    =    0;

// Local variable to store the google data and pass to the required modules.
var googleData    =    null;

/*
 * updateDirection
 * ============
 *
 * Loads the Augmented Reality screen of the application.
 *
 * Requires the module within the function to load only when needed.
 *
 * Removes the activity indicator if active.
 */
function rotateDisplay()
{
    var ars    =    require('/ui/screens/ARScreen');

    ars.rotateDisplay();
}

/*
 * loadARScreen
 * ============
 *
 * Loads the Augmented Reality screen of the application.
 *
 * Requires the module within the function to load only when needed.
 *
 * Removes the activity indicator if active.
 */
function loadARScreen()
{
    activity.activityMessage({
        MESS :    Ti.Locale.getString('A0004')
    });
    // Kick off the Compass ....
    locations.retrieveCurrentDirection();

    var ars    =    require('/ui/screens/ARScreen');

    var arWin    =    new ars.loadARScreen({
        DATA :    googleData,
        SERVICES :    services
    });
    //
    //    arWin.open();

    homeWin.close();
    homeWin    =    null;

    arWin    =    arWin;
}

/*
 * loadHomeScreen
 * ==============
 *
 * Loads the initial screen of the application.
 *
 * Requires the module within the function to load only when needed.
 */
function loadHomeScreen()
{
    var hs    =    require('/ui/screens/homeScreen');

    var hsWin    =    new hs.loadHomeScreen({
        SERVICES :    services
    });
    hsWin.open();

    homeWin    =    hsWin;
}

/*
 * processGoogleData
 * =================
 *
 * This function process the data into a specifically formatted array of objects
 * for use by the rest of the application....
 *
 * It calculates the distance, bearing and degree from the current location.
 *
 * The array of data is sorted by distance
 *
 * Using this data we can then build the AR view.
 *
 */

function processGoogleData(inParam)
{
    googleData    =    [];

    activity.activityMessage({
        MESS :    Ti.Locale.getString('A0003')
    });

    if(inParam.DATA.results.length  >  0) {
        for(var i    =    0; i  <  inParam.DATA.results.length; i++) {
            var currLocation    = {
                lat :    persHandler.retPersData({
                    type :    1
                }),
                lng :    persHandler.retPersData({
                    type :    0
                })
            };
            var dataLocation    = {
                lat :    inParam.DATA.results[i].geometry.location.lat,
                lng :    inParam.DATA.results[i].geometry.location.lng
            };
            var calcBearing    =    augmentedReality.calculateBearing(currLocation, dataLocation);
            var calcDistance    =    augmentedReality.calculateDistance(currLocation, dataLocation);
            var calcDegree    =    augmentedReality.toDegree(calcBearing);

            googleData.push({
                id :    inParam.DATA.results[i].id,
                icon :    inParam.DATA.results[i].icon,
                name :    inParam.DATA.results[i].name,
                location :    dataLocation,
                distance :    calcDistance,
                bearing :    calcBearing,
                degree :    calcDegree,
                vicinity :    inParam.DATA.results[i].vicinity
            });
        }
        googleData.sort(function(aa, bb)
        {
            return aa.distance  -  bb.distance;
        });
        googleData.reverse();

        loadARScreen();
    }
    else {
        common.launchEvent({
            TYPE :    'ERROR',
            MESS :    'E0004'
        });
    }
}

/*
 * retrieveGoogleFeed
 * ===================
 *
 * This function gets the google data after the location has been
 * obtained. It uses the google places api, which requires a specific
 * API key.
 *
 */

function retrieveGoogleFeed(inParam)
{
    activity.activityMessage({
        MESS :    Ti.Locale.getString('A0002')
    });
    googleFeed.retrieveGoogleFeed();
}

/*
 * retrieveLocation
 * ================
 *
 * This function starts the process of getting the data.
 *
 * The first task is to get the devices current location.
 *
 */
function nextLocationCheck(inParam)
{
    if(locationCount  <  2) {
        locations.retrieveCurrentPosition();
        locationCount++;
    }
    else {
        var loc    =    persHandler.retPersData({
            type :    0
        });
        var lat    =    persHandler.retPersData({
            type :    1
        });

        var mess    =    'Your current Locations is '  +  loc  +  ' ... '  +  lat;

        activity.activityMessage({
            MESS :    mess
        });
        locationCount    =    0;

        retrieveGoogleFeed();
    }
}

function retrieveLocation()
{
    activity.loadActivityIndicator({
        currWin :    homeWin
    });
    nextLocationCheck();
}

/*
 * checkServices
 * =============
 *
 * Checks to make sure that GPRS, GPS and compass are available
 *
 * Accepts in data in key value pairs.
 * FUNC: a passed internal function to be run after the tests.
 *
 */
function checkServices(eData)
{
    services.gpsON    =    common.checkGeoServices();
    services.gprsON    =    common.checkNetworkServices();
    services.compON    =    common.checkCompassServices();
    services.camera    =    common.checkCameraExists();
    
    if(eData.FUNC) {
        eData.FUNC();
    }
}

/*
 * handleError
 *
 * This function handles any errors by displaying an alert box with the
 * relevant message.
 *
 * It also removes the activity indicator if it is active.
 */

function handleError(inParam)
{
    activity.removeActivityIndicator();
    alert(Ti.Locale.getString(inParam.MESS));
}

/*
 * resetVars
 * =========
 *
 * This function resets the modules variables to original settings
 */
function resetVars()
{
    // Enables all variables to be reset after close of AR screen or app background process
    Ti.Media.hideCamera();
    
    if (arWin)
    {
        arWin.close();
    }
    locationCount    =    0;
    googleData    =    null;
    services    = {
        gpsON :    false,
        gprsON :    false,
        compON :    false,
        camera : false
    };
    homeWin    =    null;
    arWin    =    null;
    // Remove the compass event listener if it is active.
    locations.removeDirectionHandlerLocal();
}

/*
 * startApp
 * ========
 *
 * Needs to be at the end of the module as it calls other module specific functions.
 */
function startApp()
{
    resetVars();

    // Get the screen sizes and store in persistent data..
    persHandler.putPersData({
        type :    2,
        data :    Ti.Platform.displayCaps.platformWidth
    });
    persHandler.putPersData({
        type :    3,
        data :    Ti.Platform.displayCaps.platformHeight
    });
    // Check the services are enabled. before loading home screen
    checkServices({
        FUNC :    loadHomeScreen
    });
}

/*
 * Process the fired events
 */
function processGlobalListener(inParam)
{
    /*
     * Process the required function here based on the parameters passed in.
     * Always include a type so that we can separate the events.
     *
     * HOMECONTINUE
     * ============
     *
     * This option starts to load the data, the first task is to retrieve the location.
     *
     */

    switch(inParam.TYPE)
    {
        case "HOMECONTINUE":
            retrieveLocation();
            break;
        case "ERROR":
            handleError(inParam);
            break;
        case "nextLocationCheck":
            nextLocationCheck(inParam);
            break;
        case "processGoogleData":
            processGoogleData(inParam);
            break;
        case "rotateDisplay":
            rotateDisplay();
            break;
        case "startApp":
            startApp();
            break;
        default:
            break;
    }
}

/*
 * Create the global event listener to handle application control
 */
Ti.App.addEventListener('GLOBALLISTENER', function(inParam)
{
    var gblParams    = {};

    for(var paramKeyIn in inParam) {
        if(inParam[paramKeyIn]) {
            gblParams[paramKeyIn]    =    inParam[paramKeyIn];
        }
    }
    processGlobalListener(gblParams);
});

/*
* Set the IOS background Process
* 
* Thanks to Kosso for the code. I managed to find it in a Q & A post.
* 
* Yes it worked first time.
* 
* When the application goes into background, it closes the activity indicator and removes
* any no longer required event listeners.
* 
* When the application resumes it acts as though it is the first time.
* 
*/
// test for iOS 4+
function isiOS4Plus()
{
    if(Titanium.Platform.name  ==  'iPhone OS') {
        var version    =    Titanium.Platform.version.split(".");
        var major    =    parseInt(version[0], 10);
        // can only test this support on a 3.2+ device
        if(major  >=  4) {
            return true;
        }
    }
    return false;
}

if(isiOS4Plus()) {

    var service;

    Ti.App.addEventListener('resume', function(e)
    {
        startApp();
    });
    Ti.App.addEventListener('resumed', function(e)
    {
        if(service  !==  null) {
            service.stop();
            service.unregister();
        }
    });

    Ti.App.addEventListener('pause', function(e)
    {
        activity.removeActivityIndicator();
        resetVars();

        service    =    Ti.App.iOS.registerBackgroundService({
            url :    '/tools/iosBackgroundService.js'
        });
    });
}

/*
 * Export the required functions for access
 */
exports.startApp    =    startApp;

