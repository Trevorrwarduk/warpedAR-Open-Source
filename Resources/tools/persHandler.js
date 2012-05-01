/*
 * persHandler
 * ==========
 *
 * This file controls the storing and retrieval of the persistent data.
 *
 */

var persNames    = {
    lon :    'longitude',
    lat :    'latitude',
    width :    'screenWidth',
    height :    'screenHeight',
    bearing :    'bearing'
};
/*
 * putPersData
 * ============
 *
 * This function puts the persistent data. Passed in is the name value based on the array
 * and the data to be stored.
 *
 */

function putPersData(inParam)
{
    Ti.App.Properties.setString(persNames[inParam.type], inParam.data);

    return null;
}

/*
 * retPersData
 * ============
 *
 * This function returns the persistent data. Passed in is the name value based on the array
 */

function retPersData(inParam)
{
    return Ti.App.Properties.getString(persNames[inParam.type]);
}

/*
 * Export the required functions for access
 */
exports.putPersData    =    putPersData;
exports.retPersData    =    retPersData;
