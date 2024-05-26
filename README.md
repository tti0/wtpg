# wtpg

✈️ Where's That Plane Going?

[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/tti0/wtpg?label=docker%20version)](https://hub.docker.com/r/tti0/wtpg)

An simple NodeJS and Express web app to show details of any planes in the sky within a given radius of your location, using data from the [FlightAware AeroAPI](https://flightaware.com/commercial/aeroapi/). Perfect to quickly find where a plane you spot in the sky at home is going.

<img src="wtpg_screenshot.png" alt="A screenshot of a web interface. Black text on a white background. The title is 'Where's That Plane Going?' alongside an aeroplane emoji. The subtitle is 'A list of nearby flights, according to FlightAware data'. In the first row, there is a box containing the text: 'Last updated at Sun May 26 2024 11:35:18 GMT+0000 (Coordinated Universal Time); Searching for flights within a 30 nm (square) radius of 50.352, -1.056; Flights are displayed in ascending order of distance'. Alongside this is a button labelled 'Update flights', with white text on a cyan background. In the second row, there are 3 parallel boxes, each containing a table with data about a single flight. These data are: Flight number, Origin, Destination, Aircraft Type, Altitude, Heading, Distance to aircraft position, Bearing to aircraft position." width="650px" style="border: 2px solid grey"/>

Details of flights are cached locally using [node-persist](https://github.com/simonlast/node-persist) to reduce API usage, and new data is only fetched from the API when the _Update Flights_ button is clicked.

The project can be run on a Raspberry Pi as a Docker container, serving the app to your local network. Docker images are available for `linux/amd64` and `linux/arm/v7`.

## Usage

The project is intended to be run in a Docker container. The latest image is available from [Docker Hub](https://hub.docker.com/r/tti0/wtpg), as `tti0/wtpg:latest`, or with a specific version number (e.g. `tti0/wtpg:1.3.0`).

Use `docker run` or with Docker Compose, making sure to expose container port 4459 (the web app is available on this port via HTTP), and setting the correct environment variables, as below.

### Quickstart: Example `docker run` command

This command will start a new wtpg container, fetching the image from Docker Hub if needed, with the web server running on host port 4459. You will need to set the environment variables in the command, however.

```
docker run -p 4459:4459 -e AEROAPI_KEY=YOUR_API_KEY -e LAT=YOUR_LATITUDE -e LONG=-YOUR_LONGITUDE -e RADIUS_NM=30 tti0/wtpg:latest
```

### Environment variables

All environment variables are mandatory; the app will not start without them being set.

| **Variable** | **Description**                                                                                                            | **Default value** |
|--------------|----------------------------------------------------------------------------------------------------------------------------|-------------------|
| AEROAPI_KEY  | String: API key for FlightAware AeroAPI                                                                                     |                   |
| LAT          | Float: Latitude of point around which the app searches for flights, as a signed float (e.g. 2&deg; S = -2, 4&deg; N = 4)                   |                   |
| LONG         | Float: Longitude of point around which the app searches for flights, as a signed float (e.g. 2&deg; W = -2, 4&deg; E = 4)                  |                   |
| RADIUS_NM    | Float: Diagonal radius of a square (in nautical miles) centered on (LAT, LONG) within which the app will search for flights |                   |

### Development commands

#### To set up a development environment

```
git clone https://github.com/tti0/wtpg.git
cd wtpg
yarn install
```

#### To run a development server (with live reloading) for wtpg on your local machine

```
yarn run dev
```

#### To build and test a Docker image locally

```
docker build --tag tti0/wtpg:testing --load .
docker run -p 4459:4459 -e AEROAPI_KEY=YOUR_API_KEY -e LAT=YOUR_LATITUDE -e LONG=-YOUR_LONGITUDE -e RADIUS_NM=30 tti0/wtpg:testing
```

#### To build Docker images and push a release to Docker Hub

(replacing `x.y.z` with the release version number)
```
docker build --push --platform linux/arm/v7,linux/amd64 --tag tti0/wtpg:x.y.z --tag tti0/wtpg:latest .
```

## Licencing

This project is Copyright (c) tti0 2024, and licenced under the MIT License. Please see `LICENSE` for full details.
