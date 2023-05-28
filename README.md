# wtpg
Where's That Plane Going?

[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/tti0/wtpg?label=docker%20version)](https://hub.docker.com/r/tti0/wtpg)

An simple Express web app to show details of any planes in the sky within a given radius of your location, using data from the FlightAware AeroAPI (https://flightaware.com/commercial/aeroapi/). Perfect to quickly find where a plane you spot in the sky at home is going.

Details of flights are cached locally using node-persist (https://github.com/simonlast/node-persist) to reduce API usage.

Intended to be run on a Raspberry Pi (served to your local network) as a Docker container. Docker images are available for `linux/amd64` and `linux/arm/v7`.

## Usage

The project is intended to be run in a Docker container. The latest image is available from Docker Hub (https://hub.docker.com/r/tti0/wtpg), as `tti0/wptg:latest`, or specifying a version number.

Use `docker run` or with Docker Compose, making sure to expose container port 4459 (the web app is available on this port via HTTP), and setting the correct environment variables, as below.

### Environment variables

All environment variables are mandatory; the app will not start without them being set.

| **Variable** | **Description**                                                                                                            | **Default value** |
|--------------|----------------------------------------------------------------------------------------------------------------------------|-------------------|
| AEROAPI_KEY  | String: API key for FlightAware AeroAPI                                                                                     |                   |
| LAT          | Float: Latitude of point around which the app searches for flights, as a signed float (e.g. 2&deg; S = -2)                   |                   |
| LONG         | Float: Longitude of point around which the app searches for flights, as a signed float (e.g. 2&deg; W = -2)                  |                   |
| RADIUS_NM    | Float: Diagonal radius of a square (in nautical miles) centered on (LAT, LONG) within which the app will search for flights |                   |

## Licencing

This project is Copyright (c) tti0 2023, and licenced under the MIT License. Please see `LICENSE` for full details.
