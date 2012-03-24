/*
 * location
 * ========
 *
 * This file contains all the location services required for obtaining position and direction
 *
 */

/*
 * Require the required modules.
 */
var common    =    require('/tools/common');
var persHandler    =    require('/tools/persHandler');

/*
 * The module variables
 */
Ti.Geolocation.preferredProvider    =    "gps";
Ti.Geolocation.accuracy    =    Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.purpose    =    Ti.Locale.getString('gps_purpose');
Ti.Geolocation.headingFilter    =    1;
Ti.Geolocation.showCalibration    =    false;
Ti.Geolocation.distanceFilter    =    10;

/*
 * The module Flags
 */

var compassEventSet    =    false;

/*
 * retrieveCurrentPosition
 * =======================
 *
 * This function will get the current location of the device and
 * put the longitude and latitude into persistant data.
 *
 */
function retrieveCurrentPosition()
{
    try {
        var getLocation    =    Ti.Geolocation.getCurrentPosition(function(e)
        {
            if(!e.success  ||  e.error) {
                common.launchEvent({
                    TYPE :    'ERROR',
                    MESS :    'E0002'
                });
            }
            if(e.success) {
                persHandler.putPersData({
                    type :    0,
                    data :    e.coords.longitude
                });
                persHandler.putPersData({
                    type :    1,
                    data :    e.coords.latitude
                });
                common.launchEvent({
                    TYPE :    'nextLocationCheck'
                });
            }
        });
    }

    catch(err) {
        common.launchEvent({
            TYPE :    'ERROR',
            MESS :    'E0002'
        });
    }
    return;
}

function headingCallback(e)
{
    if(e.error) {
        common.launchEvent({
            TYPE :    'ERROR',
            MESS :    'E0005'
        });
    }
    else {
        persHandler.putPersData({
            type :    4,
            data :    e.heading.magneticHeading
        });
        common.launchEvent({
            TYPE :    'rotateDisplay'
        });
    }
}

function removeDirectionHandlerLocal()
{
    if(compassEventSet) {
        Ti.Geolocation.removeEventListener('heading', headingCallback);
        compassEventSet    =    false;
    }
}

function addDirectionHandlerLocal()
{
    if(!compassEventSet) {
        Ti.Geolocation.addEventListener('heading', headingCallback);
        compassEventSet    =    true;
    }
}

function retrieveCurrentDirection()
{
    var geoLocFuncVar    =    Ti.Geolocation.getCurrentHeading(function(e)
    {
        if(e.error) {
            common.launchEvent({
                TYPE :    'ERROR',
                MESS :    'E0005'
            });
        }
        try {
            addDirectionHandlerLocal();
        }
        catch(err) {
            common.launchEvent({
                TYPE :    'ERROR',
                MESS :    'E0005'
            });
        }
        persHandler.putPersData({
            type :    4,
            data :    e.heading.magneticHeading
        });
    });
}

/*
 * Export the required functions for access
 */
exports.retrieveCurrentPosition    =    retrieveCurrentPosition;
exports.retrieveCurrentDirection    =    retrieveCurrentDirection;
exports.removeDirectionHandlerLocal    =    removeDirectionHandlerLocal;

