// Modify the array of flights returned by the FlightAware API to add to each flight object:
// - Pretty printable origin airport name
// - Pretty printable destination airport name
// - Symbolic/emoji representation of altitude change
// - Distance and bearing from station to plane
// and sort in ascending order of distance

const LatLon = require("geodesy").LatLonSpherical;
const _ = require("lodash");

module.exports = function modifyFlightsArray(flightsArray) {
    let latestFlightsModified = flightsArray.map(function(i) {
        let flightObject = i;
        // Format name of origin airport
        if(flightObject.origin !== null) {
            if(! flightObject.origin.code_iata && ! flightObject.origin.code_icao) {
                flightObject.origin.prettyName = flightObject.origin.city;
            } else {
                flightObject.origin.prettyName = `${flightObject.origin.code_iata ? flightObject.origin.code_iata : flightObject.origin.code_icao} / ${flightObject.origin.name ? flightObject.origin.name : flightObject.origin.city}`;
            }
        }
        // Format name of destination airport
        if(flightObject.destination !== null) {
            if(! flightObject.destination.code_iata && ! flightObject.destination.code_icao) {
                flightObject.destination.prettyName = flightObject.destination.city;
            } else {
                flightObject.destination.prettyName = `${flightObject.destination.code_iata ? flightObject.destination.code_iata : flightObject.destination.code_icao} / ${flightObject.destination.name ? flightObject.destination.name : flightObject.destination.city}`;
            }
        }
        if (flightObject.last_position !== null) {
            // determine distance (nm) and bearing (degrees) to flight
            let stationPosition = new LatLon(process.env.LAT, process.env.LONG);
            let flightPosition = new LatLon(flightObject.last_position.latitude, flightObject.last_position.longitude);
            flightObject.last_position.distanceToFlight = (stationPosition.distanceTo(flightPosition) / 1852).toFixed(2);
            flightObject.last_position.bearingToFlight = Math.round((stationPosition.bearingTo(flightPosition)));
            // add symbol for ascending/descending/level flight
            if (flightObject.last_position.altitude_change === "C") {
                flightObject.last_position.altitudeChangeSymbol = "⬆️";
            } else if (flightObject.last_position.altitude_change === "D") {
                flightObject.last_position.altitudeChangeSymbol = "⬇️";
            } else {
                flightObject.last_position.altitudeChangeSymbol = "—";
            }
        }
        // add airline logo URL
        if (flightObject.ident_icao !== null) {
            flightObject.airlineCodeICAO = flightObject.ident_icao.substring(0, 3);
            flightObject.airlineLogoUrl = `https://e1.flightcdn.com/images/airline_logos/180px/${flightObject.airlineCodeICAO}.png`;
        }
        return flightObject;
    });
    latestFlightsModified = _.sortBy(latestFlightsModified, function(flight) {
        return parseInt(flight.last_position.distanceToFlight);
    });
    return latestFlightsModified;
};