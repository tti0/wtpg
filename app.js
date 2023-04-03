// wtpg
// https://github.com/tti0/wtpg
// (c) 2023 tti0
// MIT Licence

require("dotenv").config();
const express = require("express");
const path = require("path");
const squareCornersFromCentre = require("./lib/squareCornersFromCentre.js");
const axios = require("axios");
const storage = require("node-persist");
const modifyFlightsArray = require("./lib/modifyFlightsArray.js")

// check environment variables
if (!process.env.AEROAPI_KEY || !process.env.LAT || !process.env.LONG || !process.env.RADIUS_NM) {
    console.error("ERROR: One or more environment variables are missing.");
    process.exit(1);
};

// initialise storage
storage.init();

// initialise express app
const app = express();
app.set("view engine", "pug");

// expose CSS
app.use(express.static(path.join(__dirname, "node_modules", "bulma", "css")));

// default route
app.get("/", async function (req, res) {
    console.log("GET /");
    if (! await storage.getItem("gotFlightsTime")) {
        res.redirect("/update");
    };
    res.render("home", {
        flights: await storage.getItem("flights"),
        gotFlightsTime: await storage.getItem("gotFlightsTime"),
        searchParameters: {
            lat: process.env.LAT,
            long: process.env.LONG,
            radius: process.env.RADIUS_NM
        }
    });
});

// update route
app.get("/update", function(req, res) {
    console.log("GET /update");
    try {
        let searchSquare = squareCornersFromCentre(process.env.LAT, process.env.LONG, process.env.RADIUS_NM);
        axios.get("https://aeroapi.flightaware.com/aeroapi/flights/search", {
            params: {
                "query": `-latlong "${searchSquare.minLat} ${searchSquare.minLong} ${searchSquare.maxLat} ${searchSquare.maxLong}"`
            },
            headers: {
                "x-apikey": process.env.AEROAPI_KEY
            }
            })
            .then(async function (APIresponse) {
                await storage.setItem("gotFlightsTime", new Date().toString());
                let latestFlights =  APIresponse.data.flights;
                let latestFlightsModified = modifyFlightsArray(latestFlights);
                await storage.setItem("flights", latestFlightsModified);
                res.redirect("/");
            })
            .catch(function (err) {
                console.error(err);
                res.render("error", {
                    error: JSON.stringify(err)
                });
            });
    } catch (err) {
        console.error(err);
        res.render("error", {
            error: JSON.stringify(err)
        });
    }
});

// 404
app.use(function(req, res) {
    console.log("404");
    res.redirect("/");
})

// start server
const server = app.listen(process.env.PORT || 4459, function() {
    console.log(`Server started. Listening on port ${process.env.PORT || 4459}.`);
});