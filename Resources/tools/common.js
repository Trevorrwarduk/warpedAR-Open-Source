/*
 * common
 * ========
 *
 * This file contains all the common functions like checking services.
 *
 */

/*
 * Check if the user has GPS and its enabled.
 */
function checkGeoServices()
{
    return (Ti.Geolocation.getLocationServicesEnabled)    ?    true    :    false;
}

/*
 * Check if the user has a compass
 */
function checkCompassServices()
{
    return Ti.Geolocation.hasCompass;
}

/*
 * Check if the user has internet
 */
function checkNetworkServices()
{
    return (Titanium.Network.online)    ?    true    :    false;
}

/*
 * Check if the device has a camera
 */
function checkCameraExists()
{
    return (Ti.Media.isCameraSupported) ? true : false;
}

function launchEvent(inParam)
{
    var evtParams    = {};

    for(var paramKeyIn in inParam) {
        if(inParam[paramKeyIn]) {
            evtParams[paramKeyIn]    =    inParam[paramKeyIn];
        }
    }
    Ti.App.fireEvent('GLOBALLISTENER', evtParams);
}
/*
 * Export the required functions for access
 */
exports.checkGeoServices    =    checkGeoServices;
exports.checkCompassServices    =    checkCompassServices;
exports.checkNetworkServices    =    checkNetworkServices;
exports.checkCameraExists    =    checkCameraExists;
exports.launchEvent    =    launchEvent;

