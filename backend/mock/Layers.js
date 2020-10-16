const fs = require("fs");

const parseGeoJSON = (path) => {
  return JSON.parse(fs.readFileSync(path));
};
const counties = parseGeoJSON("./mock/counties.geojson");
const rivers = parseGeoJSON("./mock/rivers.geojson");
const lakes = parseGeoJSON("./mock/lakes.geojson");
const dams = parseGeoJSON("./mock/dams.geojson");
const monitoringLocations = parseGeoJSON("./mock/monitoring_locations.geojson");
const wells = parseGeoJSON("./mock/wells.geojson");
const oilPads = parseGeoJSON("./mock/oil_pads.geojson");
const activeFires = parseGeoJSON("./mock/active_fires.geojson");
const burnZones = parseGeoJSON("./mock/burn_zones.geojson");
const countyProperties = parseGeoJSON("./mock/county_properties.geojson");
const pipelines = parseGeoJSON("./mock/pipelines.geojson");
const wwtps = parseGeoJSON("./mock/wwtps.geojson");

const defaultCircleStyles = {
  "circle-color": "#444",
  "circle-radius": 8,
  "circle-stroke-color": "#ffffff",
  "circle-stroke-width": 2,
};

const defaultLineStyles = {
  "line-color": "#444",
  "line-width": 2,
};

const defaultFillStyles = {
  "fill-color": "#444",
  "fill-opacity": 0.8,
};

const DummyLayers = [
  {
    name: "Rivers",
    geometry_type: "line",
    enabled: true,
    visible: true,
    geometry_type_ndx: 1,
    layer_categories: [1],
    spatial_data: rivers,
    paint: {
      ...defaultLineStyles,
      "line-color": "#15cc09",
    },
  },
  {
    name: "Lakes & Reservoirs",
    geometry_type: "fill",
    enabled: true,
    visible: true,
    geometry_type_ndx: 3,
    layer_categories: [1],
    spatial_data: lakes,
    paint: {
      ...defaultFillStyles,
      // "fill-color": "#15cc09",
    },
  },
  {
    name: "Dams",
    geometry_type: "circle",
    enabled: true,
    visible: true,
    geometry_type_ndx: 2,
    layer_categories: [1],
    spatial_data: dams,
    paint: {
      ...defaultCircleStyles,
    },
  },
  {
    name: "Monitoring Locations",
    geometry_type: "circle",
    enabled: false,
    visible: false,
    geometry_type_ndx: 2,
    layer_categories: [1],
    spatial_data: monitoringLocations,
    paint: {
      ...defaultCircleStyles,
    },
  },
  {
    name: "Wells",
    geometry_type: "circle",
    enabled: false,
    visible: false,
    geometry_type_ndx: 2,
    layer_categories: [1],
    spatial_data: wells,
    paint: {
      ...defaultCircleStyles,
    },
  },
  {
    name: "Major Roads",
    geometry_type: "line",
    enabled: false,
    visible: false,
    geometry_type_ndx: 1,
    layer_categories: [3],
    spatial_data: null,
    paint: null,
  },
  {
    name: "Counties",
    geometry_type: "line",
    enabled: false,
    visible: false,
    geometry_type_ndx: 3,
    layer_categories: [1],
    spatial_data: counties,
    paint: null,
  },
  {
    name: "Oil Pads",
    geometry_type: "circle",
    enabled: false,
    visible: false,
    geometry_type_ndx: 3,
    layer_categories: [1],
    spatial_data: oilPads,
    paint: {
      ...defaultCircleStyles,
    },
  },
  {
    name: "Active Fires",
    geometry_type: "circle",
    enabled: false,
    visible: false,
    geometry_type_ndx: 3,
    layer_categories: [1],
    spatial_data: activeFires,
    paint: {
      ...defaultCircleStyles,
    },
  },
  {
    name: "Burn Zones",
    geometry_type: "fill",
    enabled: false,
    visible: false,
    geometry_type_ndx: 3,
    layer_categories: [4],
    spatial_data: burnZones,
    paint: {
      ...defaultFillStyles,
    },
  },
  {
    name: "County Properties",
    geometry_type: "fill",
    enabled: false,
    visible: false,
    geometry_type_ndx: 3,
    layer_categories: [3],
    spatial_data: countyProperties,
    paint: {
      ...defaultFillStyles,
    },
  },
  {
    name: "Pipelines",
    geometry_type: "line",
    enabled: false,
    visible: false,
    geometry_type_ndx: 1,
    layer_categories: [2],
    spatial_data: pipelines,
    paint: {
      ...defaultLineStyles,
    },
  },
  {
    name: "WWTPs",
    geometry_type: "circle",
    enabled: false,
    visible: false,
    geometry_type_ndx: 2,
    layer_categories: [1],
    spatial_data: wwtps,
    paint: {
      ...defaultCircleStyles,
    },
  },
];

module.exports = {
  DummyLayers,
};
