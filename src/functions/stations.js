const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const qs = require("qs");

const app = express();

const router = express.Router();

const WatershedMappings = {
  RG: "Rio Grande",
  SP: "South Platte",
  AK: "Arkansas",
  GR: "Green River",
  CO: "Colorado",
  SJ: "San Juan",
  DO: "Dolores",
  GU: "Gunnison",
};

const transformStationData = (features = []) => {
  const includeFields = [
    "StationNumber",
    "StationName",
    "River",
    "WaterBodyId",
    "RWWaterShed",
    "StationStatus",
    "Latitude",
    "Longitude",
    "Description",
  ];
  return features.map((d) => {
    const rec = {};
    includeFields.forEach((key) => {
      rec[key] =
        key === "RWWaterShed" ? WatershedMappings[d[key]] || "NA" : d[key];
    });
    return rec;
  });
};

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

const uniqueBy = (data, iterator) => {
  if (!data.length > 0) return [];
  return [...new Set(data.map((d) => d[iterator]))];
};

const getType = (features) => {
  if (!features.length > 0) return null;
  return typeof features[0];
};

const generateSchema = (features = [], config = []) => {
  if (!features.length > 0 || !config.length > 0) return null;
  return config.map(({ name, label, filter }) => {
    const values = uniqueBy(features, name);
    return {
      name,
      label,
      type: getType(values),
      filter: {
        ...filter,
        values,
      },
    };
  });
};

/**
 * Get all river watch stations
 */
router.get("/", async (req, res) => {
  // Set up a cancellation source
  let didCancel = false;

  const formData = {
    username: "ben.tyler@lrewater.com",
    password: "testTEST3!",
    grant_type: "password",
    email: "",
    orgaspnetuserid: "",
    organizationname: "",
    kitnumber: "",
    organizationid: "",
  };

  try {
    const token = await axios.post(
      "https://www.coloradoriverwatch.com/Token",
      qs.stringify(formData),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const data = await axios.post(
      "https://www.coloradoriverwatch.com/api/Station/SearchStation",
      {},
      { headers: { Authorization: `Bearer ${token.data.access_token}` } }
    );

    const stationData = transformStationData(data.data);

    if (!didCancel) {
      // Ignore if we started fetching something else
      const layers = [
        {
          name: "Major River Basins - Fill",
          geometry_type: "fill",
          legend: true,
          enabled: true,
          visible: true,
          filterable: false,
          layer_categories: [],
          layer_source_type: "tileset",
          layer_source_name: "basins-cznq7c",
          spatial_data: "mapbox://river-watch.c15qj8jj",
          paint: {
            "fill-color": "#444",
            "fill-opacity": 0.4,
            "fill-outline-color": "#ffffff",
          },
        },
        {
          name: "Major River Basins - Outline",
          geometry_type: "line",
          legend: false,
          enabled: true,
          visible: true,
          filterable: false,
          layer_categories: [],
          layer_source_type: "tileset",
          layer_source_name: "basins-cznq7c",
          spatial_data: "mapbox://river-watch.c15qj8jj",
          paint: {
            "line-color": "#ffffff",
            "line-width": 2,
          },
        },
        {
          name: "River Watch Stations",
          geometry_type: "circle",
          legend: true,
          enabled: true,
          visible: true,
          filterable: true,
          layer_categories: [],
          layer_source_type: "geojson",
          spatial_data: generateGeoJSON(stationData),
          paint: {
            "circle-color": "#ffff00",
            "circle-radius": 8,
            "circle-stroke-color": "#444444",
            "circle-stroke-width": 2,
          },
          schema: generateSchema(stationData, [
            {
              name: "StationName",
              label: "Station Name",
              filter: {
                type: "search",
                multiple: true,
              },
            },
            {
              name: "RWWaterShed",
              label: "Major River Basin",
              filter: {
                type: "chip",
                multiple: true,
              },
            },
            {
              name: "River",
              label: "River",
              filter: {
                type: "search",
                multiple: true,
              },
            },
            {
              name: "WaterBodyId",
              label: "Water Body ID (WBID)",
              filterType: {
                type: "search",
                multiple: true,
              },
            },
            {
              name: "StationStatus",
              label: "Station Status",
              filterType: {
                type: "chip",
                multiple: true,
              },
            },
          ]),
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
