/* warpedAR is a demo application designed and built to show the Augmented Reality abilities
 * of the Appcelerator Titanium Mobile Development Framework
 *
 * This application was written by Trevor Ward aka thewarpedcoder.
 *
 * Version 1.0.0
 */

/*
 * Application Description
 * =======================
 *
 * The Application initially tests the device to make sure the required sensors are available.
 *
 * On pressing the continue button the application gets the users location and obtains data from google places.
 *
 * After obtaining the data it then formats it for viewing which involves getting the distance between the
 * users current location and the location of the places. This is built into a data array which is sorted
 * by distance.
 *
 * The application then builds this data to be able to be displayed in an Augmented Reality setting, this involves
 * building the view of the Augmented Reality, including the radar at the top of the screen.
 *
 * A new window is opened with the data displayed.
 *
 * As the user then moves around the data is moved across the screen in relation to the current compass heading.
 *
 * Updating the data is a manual process and the user needs to request it.
 *
 * The application works on iPhone and Android phones.
 *
 * The code follows a commonJS model and a directory structure aimed at being close to a MVC pattern.
 *
 */

/*
 * Current Limitations
 * ===================
 *
 * Version 1.0.0
 *
 * Only works in Portrait mode.
 *
 */

/* Ongoing Development
 * ===================
 *
 * The following list shows the next features to be implemented in the order they should be done.
 *
 */

var ctl    =    require('/control/warpedAR-CTL');

// Now start the app
ctl.startAppEXP();
