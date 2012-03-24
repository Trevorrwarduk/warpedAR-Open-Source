/*
 * googleFeed
 * ===========
 *
 * This file contains all the google services required for obtaining the data
 *
 */

/*
 * Require the required modules.
 */
var common    =    require('/tools/common');
var persHandler    =    require('/tools/persHandler');

function retrieveGoogleFeed()
{
    var longitude    =    persHandler.retPersData({
        type :    0
    });
    var latitude    =    persHandler.retPersData({
        type :    1
    });
    var apikey    =    'YOUR GOOGLE PLACES API KEY GOES HERE';

    var googleData    =    'https://maps.googleapis.com/maps/api/place/search/json?location='  +  latitude  +  ','  +  longitude  +  '&radius=5000&sensor=false&key='  +  apikey;

    var xhrCall    =    Ti.Network.createHTTPClient();

    try {
        xhrCall.open('GET', googleData);

        xhrCall.send();
    }
    catch(e) {
        common.launchEvent({
            TYPE :    'ERROR',
            MESS :    'E0003'
        });
    }
    xhrCall.onerror    = function()
    {
        common.launchEvent({
            TYPE :    'ERROR',
            MESS :    'E0003'
        });
    };
    xhrCall.onload    = function()
    {
        var jsona    =    null;
        var response    =    null;
        if(this.status  ===  200) {
            jsona    =    this.responseText;
            response    =    JSON.parse(jsona);
            Ti.API.info(response);
            common.launchEvent({
                TYPE :    'processGoogleData',
                DATA :    response
            });
        }
        else {
            common.launchEvent({
                TYPE :    'ERROR',
                MESS :    'E0003'
            });
        }
    };
}

/*
 * Export the required functions for access
 */
exports.retrieveGoogleFeed    =    retrieveGoogleFeed;
