/*
 * augmentedReality
 * ================
 *
 * This file contains all the functions for calculating the augmented reality display
 *
 */

function toRadius(degree)
{
    return degree  *  (Math.PI  /  180);
}

function toDegree(radius)
{
    return ((radius  *  (180  /  Math.PI))  +  360)  %  360;
}

function calculateDistance(point1, point2)
{
    var R    =    6371;
    // km
    var d    =    Math.acos(((Math.sin(point1.lat)  *  Math.sin(point2.lat))  +  (Math.cos(point1.lat)  *  Math.cos(point2.lat))  *  Math.cos(point2.lng  -  point1.lng)))  *  R;
    return d;
}

function calculateBearing(point1, point2)
{
    var lat1    =    point1.lat  *  Math.PI  /  180;
    var lat2    =    point2.lat  *  Math.PI  /  180;
    var dlng    =    (point2.lng  -  point1.lng)  *  Math.PI  /  180;
    var y    =    Math.sin(dlng)  *  Math.cos(lat2);
    var x    =    Math.cos(lat1)  *  Math.sin(lat2)  -  Math.sin(lat1)  *  Math.cos(lat2)  *  Math.cos(dlng);
    var brng    =    Math.atan2(y, x);

    return brng;
}

exports.calculateDistance = calculateDistance;
exports.calculateBearing = calculateBearing;
exports.toDegree = toDegree;
exports.toRadius = toRadius;
