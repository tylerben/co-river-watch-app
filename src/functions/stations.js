const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

const app = express();

const router = express.Router();

const generateGeoJSON = (features = []) => {
  return {
    type: "FeatureCollection",
    features: features.map((feat) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [feat.Longitude, feat.Latitude],
        },
        properties: feat,
      };
    }),
  };
};

/**
 * Get all river watch stations
 */
router.get("/", async (req, res) => {
  // Set up a cancellation source
  let didCancel = false;

  try {
    const data = await axios.post(
      "https://www.coloradoriverwatch.com/api/Station/GetStationData"
    );
    if (!didCancel) {
      // Ignore if we started fetching something else
      const layers = [
        {
          name: "River Watch Stations",
          geometry_type: "circle",
          enabled: true,
          visible: true,
          layer_categories: [],
          spatial_data: generateGeoJSON(data.data),
          paint: {
            "circle-color": "#ffff00",
            "circle-radius": 8,
            "circle-stroke-color": "#444444",
            "circle-stroke-width": 2,
          },
        },
      ];
      res.json(layers);
    }
  } catch (err) {
    // Is this error because we cancelled it ourselves?
    if (axios.isCancel(err)) {
      console.log(`call was cancelled`);
    } else {
      console.error(err);
    }
  }
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/.netlify/functions/stations/", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
