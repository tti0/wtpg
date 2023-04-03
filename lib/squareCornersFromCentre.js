// Given a latitude/longitude co-ordinate pair, find the minimum and maximum latitude and longitude of a square centred on that point, with a given square radius

const LatLon = require("geodesy").LatLonSpherical;

module.exports = function squareCornersFromCentre(centre_lat, centre_long, radius_nm) {
    let centre = new LatLon(centre_lat, centre_long);

    let northWestCorner = centre.destinationPoint(1852 * radius_nm, 315); // 1852 converts nautical miles to metres
    let southEastCorner = centre.destinationPoint(1852 * radius_nm, 135);

    return {
        minLat: southEastCorner.lat,
        maxLat: northWestCorner.lat,
        minLong: northWestCorner.lon,
        maxLong: southEastCorner.lon
    };
};