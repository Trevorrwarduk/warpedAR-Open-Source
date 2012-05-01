/*
 * activity
 * ==========
 *
 * This file contains the activity indicator used throughout the application.
 *
 * It shows a full screen overlay with progressing dots and a text area to
 * display any messages.
 *
 * The parent function creates the main display with a second function to remove
 * the display afterwards.
 *
 * The current window is passed in as a parameter which is stored to add or remove
 * the indicator from.
 *
 */

/*
 * Require the required modules.
 */
var layout    =    require('/ui/layout');
var persHandler    =    require('/tools/persHandler');

/*
 * The module variables
 */
var currWin    =    null;
var maskView    =    null;
var maskViewColor    =    null;
var messBox    =    null;

var dotView    =    null;
var dot1    =    null;
var dot2    =    null;
var dot3    =    null;
var dot4    =    null;
var dot5    =    null;
var dot6    =    null;
var dotLoaded    =    null;
var timer    =    null;

/*
 * This function builds a dot.
 */

function buildDot(inLeft)
{
    return Ti.UI.createView({
        top :    '10dp',
        left :    inLeft,
        height :    '20dp',
        width :    '20dp',
        backgroundColor :    layout.css.activity.dot.bkc,
        borderRadius :    layout.css.activity.dot.br,
        borderWidth :    layout.css.activity.dot.bw,
        borderColor :    layout.css.activity.dot.bc
    });
}

/*
 * This function moves the dots
 */

function animateDots()
{
    if(!timer) {
        timer    =    setInterval(function()
        {
            switch (dotLoaded)
            {
                case 1:
                    dot1.backgroundColor    =    layout.css.activity.dot.bkc;
                    dot2.backgroundColor    =    layout.css.activity.dot.fbkc;
                    dotLoaded    =    2;
                    break;
                case 2:
                    dot2.backgroundColor    =    layout.css.activity.dot.bkc;
                    dot3.backgroundColor    =    layout.css.activity.dot.fbkc;
                    dotLoaded    =    3;
                    break;
                case 3:
                    dot3.backgroundColor    =    layout.css.activity.dot.bkc;
                    dot4.backgroundColor    =    layout.css.activity.dot.fbkc;
                    dotLoaded    =    4;
                    break;
                case 4:
                    dot4.backgroundColor    =    layout.css.activity.dot.bkc;
                    dot5.backgroundColor    =    layout.css.activity.dot.fbkc;
                    dotLoaded    =    5;
                    break;
                case 5:
                    dot5.backgroundColor    =    layout.css.activity.dot.bkc;
                    dot6.backgroundColor    =    layout.css.activity.dot.fbkc;
                    dotLoaded    =    6;
                    break;
                case 6:
                    dot6.backgroundColor    =    layout.css.activity.dot.bkc;
                    dot1.backgroundColor    =    layout.css.activity.dot.fbkc;
                    dotLoaded    =    1;
                    break;
            }
        }, 500);
    }
}

/*
 * This function builds the dots
 */

function buildDots()
{
    var screenWidth    =    persHandler.retPersData({
        type :    'width'
    });

    dotView    =    Ti.UI.createView({
        left :    '20dp',
        right :    '20dp',
        top :    '100dp',
        height :    '40dp',
        backgroundColor :    layout.css.activity.bkc,
        color :    layout.css.activity.fc,
        borderRadius :    layout.css.activity.br,
        borderWidth :    layout.css.activity.bw,
        borderColor :    layout.css.activity.bc,
        zIndex :    502
    });
    var dotLeft    =    ((screenWidth  /  2)  -  130);
    dot1    =    buildDot(dotLeft);
    dot1.backgroundColor    =    layout.css.activity.dot.fbkc;

    dotLeft    =    ((screenWidth  /  2)  -  90);
    dot2    =    buildDot(dotLeft);

    dotLeft    =    ((screenWidth  /  2)  -  50);
    dot3    =    buildDot(dotLeft);

    dotLeft    =    ((screenWidth  /  2)  -  10);
    dot4    =    buildDot(dotLeft);

    dotLeft    =    ((screenWidth  /  2)  +  30);
    dot5    =    buildDot(dotLeft);

    dotLeft    =    ((screenWidth  /  2)  +  70);
    dot6    =    buildDot(dotLeft);

    dotView.add(dot1);
    dotView.add(dot2);
    dotView.add(dot3);
    dotView.add(dot4);
    dotView.add(dot5);
    dotView.add(dot6);

    maskView.add(dotView);

    dotLoaded    =    1;
    animateDots();
}

/*
 * activtyMessage
 * ==============
 *
 * This function updates the message on the screen.
 *
 * It accepts the message ID from the strings.xml file.
 *
 */

function activityMessage(inParam)
{
    messBox.text    =    Ti.Locale.getString(inParam.MESS);
}

/*
 * removeActivityIndicator
 *
 * This function removes the activity indicator.
 */

function removeActivityIndicator(inParam)
{
    if(maskView) {
        clearInterval(timer);
        timer    =    null;

        dotView.remove(dot1);
        dotView.remove(dot2);
        dotView.remove(dot3);
        dotView.remove(dot4);
        dotView.remove(dot5);
        dotView.remove(dot6);
        maskView.remove(dotView);
        maskView.remove(maskViewColor);

        currWin.remove(maskView);

        timer    =    null;
        dot1    =    null;
        dot2    =    null;
        dot3    =    null;
        dot4    =    null;
        dot5    =    null;
        dot6    =    null;
        dotView    =    null;
        maskView    =    null;
        currWin    =    null;
    }
    return;
}

/*
 * laodActivityIndicator
 * =====================
 *
 * This function builds and displays the activity indicator
 *
 */

function loadActivityIndicator(inParam)
{
    currWin    =    inParam.currWin;

    maskView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        bottom :    0,
        backgroundColor :    'transparent',
        zIndex :    500
    });
    currWin.add(maskView);

    maskViewColor    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        bottom :    0,
        backgroundColor :    layout.css.activity.bmc,
        opacity :    layout.css.activity.bmo,
        zIndex :    501
    });
    maskView.add(maskViewColor);

    currWin.add(maskView);

    /*
     * The message box
     */
    messBox    =    Ti.UI.createLabel({
        left :    '20dp',
        right :    '20dp',
        bottom :    '20dp',
        height :    '75dp',
        textAlign :    layout.css.activity.ta,
        backgroundColor :    layout.css.activity.bkc,
        color :    layout.css.activity.fc,
        borderRadius :    layout.css.activity.br,
        borderWidth :    layout.css.activity.bw,
        borderColor :    layout.css.activity.bc,
        font : {
            fontFamily :    layout.css.activity.ff,
            fontWeight :    layout.css.activity.fw,
            fontSize :    layout.css.activity.fs
        },
        zIndex :    502
    });
    buildDots();

    maskView.add(messBox);

    activityMessage({
        MESS :    'A0001'
    });

    return;
}

/*
 * Export the required functions for access
 */
exports.loadActivityIndicator    =    loadActivityIndicator;
exports.activityMessage    =    activityMessage;
exports.removeActivityIndicator    =    removeActivityIndicator;
