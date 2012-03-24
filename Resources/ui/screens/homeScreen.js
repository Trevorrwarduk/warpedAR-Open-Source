/*
 * homeScreen
 * ==========
 *
 * This file contains the initial window opened by the application.
 *
 * It shows the results of the sensor tests and either a continuation button
 * or a warning message
 *
 */

function loadHomeScreen(inParams)
{
    /*
     * Load the required modules for this function
     */
    var layout    =    require('/ui/layout');
    var images    =    require('/ui/images');
    var titleBar    =    require('/ui/common/titleBar');
    var common    =    require('/tools/common');

    var hsWin    =    Ti.UI.createWindow({
        backgroundColor :    layout.css.sbkc.hs,
        navBarHidden :    true,
        exitOnClose :    false,
        orientationModes :    [Ti.UI.PORTRAIT]
    });
    /*
     * Set orientation fixed for Android
     */
    hsWin.orientationModes    =    [Ti.UI.PORTRAIT];

    var hsText    =    Ti.UI.createTextArea({
        top :    layout.css.hs.tbtp,
        height :    layout.css.hs.tbhi,
        left :    layout.css.hs.tbpad,
        right :    layout.css.hs.tbpad,
        backgroundColor :    layout.css.hs.tbbc,
        editable :    false,
        value :    Ti.Locale.getString('info_text'),
        textAlign :    layout.css.hs.tbta,
        color :    layout.css.hs.tbfnc,
        font : {
            fontFamily :    layout.css.hs.tbfnf,
            fontWeight :    layout.css.hs.tbfnw,
            fontSize :    layout.css.hs.tbfns
        }
    });
    /*
     * Add the sensor test results view and the results themselves.
     */
    var sensorView    =    Ti.UI.createView({
        top :    layout.css.hs.svtp,
        height :    layout.css.hs.svhi,
        left :    layout.css.hs.tbpad,
        right :    layout.css.hs.tbpad,
        layout :    'vertical'
    });
    /*
     * The GPS test screen display
     */
    var showGPSView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        height :    layout.css.hs.svtlh
    });
    var showGPSStatus    =    Ti.UI.createLabel({
        top :    0,
        left :    0,
        width :    layout.css.hs.svtlwi,
        height :    layout.css.hs.svtlh,
        text :    Ti.Locale.getString('gps_test'),
        color :    layout.css.hs.tbfnc,
        font : {
            fontFamily :    layout.css.hs.tbfnf,
            fontWeight :    layout.css.hs.tbfnw,
            fontSize :    layout.css.hs.tbfns
        }
    });
    var showGPSTest    =    Ti.UI.createView({
        top :    layout.css.hs.svtcbtp,
        right :    0,
        width :    layout.css.hs.svtcbwi,
        height :    layout.css.hs.svtlht,
        backgroundColor :    (inParams.SERVICES.gpsON)    ?    "blue"    :    "red"
    });
    showGPSView.add(showGPSStatus);
    showGPSView.add(showGPSTest);
    /*
     * The GPRS test screen display
     */
    var showGPRSView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        height :    layout.css.hs.svtlh
    });
    var showGPRSStatus    =    Ti.UI.createLabel({
        top :    0,
        left :    0,
        width :    layout.css.hs.svtlwi,
        height :    layout.css.hs.svtlh,
        text :    Ti.Locale.getString('gprs_test'),
        color :    layout.css.hs.tbfnc,
        font : {
            fontFamily :    layout.css.hs.tbfnf,
            fontWeight :    layout.css.hs.tbfnw,
            fontSize :    layout.css.hs.tbfns
        }
    });
    var showGPRSTest    =    Ti.UI.createView({
        top :    layout.css.hs.svtcbtp,
        right :    0,
        width :    layout.css.hs.svtcbwi,
        height :    layout.css.hs.svtlht,
        backgroundColor :    (inParams.SERVICES.gprsON)    ?    "blue"    :    "red"
    });
    showGPRSView.add(showGPRSStatus);
    showGPRSView.add(showGPRSTest);
    /*
     * The GPRS test screen display
     */
    var showCOMPASSView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        height :    layout.css.hs.svtlh
    });
    var showCOMPASSStatus    =    Ti.UI.createLabel({
        top :    0,
        left :    0,
        width :    layout.css.hs.svtlwi,
        height :    layout.css.hs.svtlh,
        text :    Ti.Locale.getString('compass_test'),
        color :    layout.css.hs.tbfnc,
        font : {
            fontFamily :    layout.css.hs.tbfnf,
            fontWeight :    layout.css.hs.tbfnw,
            fontSize :    layout.css.hs.tbfns
        }
    });
    var showCOMPASSTest    =    Ti.UI.createView({
        top :    layout.css.hs.svtcbtp,
        right :    0,
        width :    layout.css.hs.svtcbwi,
        height :    layout.css.hs.svtlht,
        backgroundColor :    (inParams.SERVICES.compON)    ?    "blue"    :    "red"
    });
    showCOMPASSView.add(showCOMPASSStatus);
    showCOMPASSView.add(showCOMPASSTest);
    /*
     * The Camear test screen display
     */
    var showCAMERAView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        height :    layout.css.hs.svtlh
    });
    var showCAMERAStatus    =    Ti.UI.createLabel({
        top :    0,
        left :    0,
        width :    layout.css.hs.svtlwi,
        height :    layout.css.hs.svtlh,
        text :    Ti.Locale.getString('camera_test'),
        color :    layout.css.hs.tbfnc,
        font : {
            fontFamily :    layout.css.hs.tbfnf,
            fontWeight :    layout.css.hs.tbfnw,
            fontSize :    layout.css.hs.tbfns
        }
    });
    var showCAMERATest    =    Ti.UI.createView({
        top :    layout.css.hs.svtcbtp,
        right :    0,
        width :    layout.css.hs.svtcbwi,
        height :    layout.css.hs.svtlht,
        backgroundColor :    (inParams.SERVICES.camera)    ?    "blue"    :    "red"
    });
    showCAMERAView.add(showCAMERAStatus);
    showCAMERAView.add(showCAMERATest);
    /*
     * Add the sensor test displays to the parent sensor view.
     */
    sensorView.add(showGPSView);
    sensorView.add(showGPRSView);
    sensorView.add(showCOMPASSView);
    sensorView.add(showCAMERAView);

    /*
     * Add either the error message or continue button.
     */
    if(!inParams.SERVICES.compON  ||  !inParams.SERVICES.gprsON  ||  !inParams.SERVICES.gpsON) {
        var showErrorMess    =    Ti.UI.createLabel({
            bottom :    '40dp',
            left :    '30dp',
            right :    '30dp',
            height :    'auto',
            textAlign :    layout.css.error.ta,
            text :    Ti.Locale.getString('E0001'),
            color :    layout.css.error.fc,
            font : {
                fontFamily :    layout.css.error.ff,
                fontWeight :    layout.css.error.fw,
                fontSize :    layout.css.error.fs
            }
        });
        hsWin.add(showErrorMess);
    }
    else {

        var continueButton    =    Ti.UI.createLabel({
            bottom :    '75dp',
            width :    layout.css.butt.wi,
            height :    layout.css.butt.hi,
            text :    Ti.Locale.getString('butt_continue'),
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
            zIndex :    100
        });
        hsWin.add(continueButton);
        /*
         * The event listeners to facilitate actions
         */
        continueButton.addEventListener('touchstart', function()
        {
            continueButton.backgroundColor    =    layout.css.butt.tbkc;
            continueButton.borderColor    =    layout.css.butt.tbc;
            continueButton.color    =    layout.css.butt.tfc;
        });
        continueButton.addEventListener('touchend', function()
        {
            continueButton.backgroundColor    =    layout.css.butt.bkc;
            continueButton.borderColor    =    layout.css.butt.bc;
            continueButton.color    =    layout.css.butt.fc;
            /*
             * Now return control to the controller.
             */
            common.launchEvent({
                TYPE :    'HOMECONTINUE'
            });
        });
    }
    var hsLogo    =    Ti.UI.createImageView({
        bottom :    '20dp',
        height :    'auto',
        width :    'auto',
        image :    images.file.logo
    });
    /*
     * Add the window components
     */
    hsWin.add(titleBar.titleBarView());
    hsWin.add(hsText);
    hsWin.add(sensorView);
    hsWin.add(hsLogo);
    /*
     * Return the main window container
     */
    return hsWin;
}

/*
 * Export the required functions for access
 */
exports.loadHomeScreen    =    loadHomeScreen;
