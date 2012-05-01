/* images
 * ======
 *
 * This file contains all the application image references
 * All images are defined for dpi specific screens
 *
 * Stand-alone file can be required in all modules
 *
 */

var file    = {
    // The In App Logo
    logo :    '/images/inapp_logo.png',
    // The in app icon
    icon :    '/images/inapp_icon.png',
    // The radar
    radar : {
        file :    '/images/radar.png',
        height :    '80dp',
        width :    '80dp',
        // The height and width are used to calculate blip positions so here used for calculations
        hCalc :    80,
        wCalc :    80
    },
    google : {
        file :    '/images/powered-by-google-on-non-white.png',
        height :    '16dp',
        width :    '104dp'
    }
};

/*
 * Export the required functions for access
 */
exports.file    =    file;
