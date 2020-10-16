import React, { useState, useEffect } from "react";
import matchSorter from "match-sorter";

import useFetchData from "../../hooks/useFetchData";

import StreetsImg from "../../images/streets.png";
import OutdoorsImg from "../../images/outdoors.png";
import SatelliteImg from "../../images/satellite.jpg";
import LightImg from "../../images/light.png";
import DarkImg from "../../images/dark.png";
import RasterImg from "../../images/raster.png";

/**
 * Create a context that will be used to share global state
 * throughout the Map page.
 * The context contains stores state such as the currently selected
 * water year and month and the current water year
 * It also contains a handler for when the water year/month
 * filters are changed by the user
 */
export const MapContext = React.createContext({
  map: {},
  controls: {},
  activeZoomToLayer: {},
  activeBasemap: {},
  basemapLayers: [],
  layers: [],
  filteredLayers: [],
  visibleLayers: [],
  filterValues: {},
  searchValue: "",
  filterActive: false,
  onMapChange: () => {},
  handleControlsVisibility: () => {},
  onZoomToLayerChange: () => {},
  onBasemapChange: () => {},
  onLayerChange: () => {},
  onFilteredLayerChange: () => {},
  onVisibleLayerChange: () => {},
  onFilterValuesChange: () => {},
  onSearchValueChange: () => {},
  resetFilters: () => {},
  onSelectAllLayers: () => {},
  onSelectNoneLayers: () => {},
});

export const DummyBasemapLayers = [
  {
    name: "Streets",
    styleURL: "mapbox://styles/mapbox/streets-v11",
    image: StreetsImg,
  },
  {
    name: "Outdoors",
    styleURL: "mapbox://styles/mapbox/outdoors-v11",
    image: OutdoorsImg,
  },
  {
    name: "Satellite",
    styleURL: "mapbox://styles/mapbox/satellite-streets-v11",
    image: SatelliteImg,
  },
  {
    name: "Light",
    styleURL: "mapbox://styles/mapbox/light-v10",
    image: LightImg,
  },
  {
    name: "Dark",
    styleURL: "mapbox://styles/mapbox/dark-v10",
    image: DarkImg
  },
  {
    name: "Raster",
    styleURL: "mapbox://styles/lrewater/ckfmqvtng6cad19r1wgf9acz8",
    image: RasterImg
  },
];

/**
 * Utility function used to check if a the drawer is currently open
 * @param {*} val
 */
const checkControlOpen = (val, defaultVisibility = true) => {
  if (val === null || val === "undefined") {
    return defaultVisibility;
    //eslint-disable-next-line
  } else if (val == "true") {
    return true;
    //eslint-disable-next-line
  } else if (val == "false") {
    return false;
  }
};

/**
 * Create the context provider for the map context
 * @param {*} props
 */
export const MapProvider = (props) => {
  const [map, setMap] = useState();
  const [filterActive, setFilterActive] = useState(false);
  const [activeZoomToLayer, setActiveZoomToLayer] = useState(null);
  const [activeBasemap, setActiveBasemap] = useState({
    name: "Streets",
    styleURL: "mapbox://styles/mapbox/streets-v11",
  });
  const [basemapLayers] = useState(DummyBasemapLayers);
  const [
    layers,
    isLayersLoading, //eslint-disable-line
    setLayers,
  ] = useFetchData("map-example/layers", []);
  const [
    filteredLayers,
    isFilteredLayersLoading, //eslint-disable-line
    setFilteredLayers,
  ] = useFetchData("map-example/layers", []);
  const [
    visibleLayers,
    isVisibleLayersLoading, //eslint-disable-line
    setVisibleLayers,
  ] = useFetchData("map-example/layers", []);
  const [filterValues, setFilterValues] = useState({
    layerCategories: [],
    geometryTypes: [],
  });
  const [searchValue, setSearchValue] = useState("");

  const [controls, setControls] = useState({
    drawer: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_drawer_control"),
        true
      ),
    },
    basemap: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_basemap_control"),
        false
      ),
    },
    layers: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_layers_control"),
        false
      ),
    },
    filterLayers: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_filterLayers_control"),
        false
      ),
    },
    dataViz: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_dataViz_control"),
        false
      ),
    },
  });

  useEffect(() => {
    if (
      searchValue !== "" ||
      filterValues.geometryTypes.length !== 0 ||
      filterValues.layerCategories.length !== 0
    ) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }, [searchValue, filterValues]);

  useEffect(() => {
    if (
      searchValue === "" &&
      filterValues.geometryTypes.length === 0 &&
      filterValues.layerCategories === 0
    ) {
      setFilteredLayers(layers);
    } else {
      let filteredByChips = [...layers];

      if (filterValues.geometryTypes.length > 0) {
        filteredByChips = filteredByChips.filter((layer) =>
          filterValues.geometryTypes.includes(layer.geometry_type_ndx)
        );
      }

      if (filterValues.layerCategories.length > 0) {
        filteredByChips = filteredByChips.filter((layer) => {
          return filterValues.layerCategories.some((r) =>
            layer.layer_categories.includes(r)
          );
        });
      }

      const filtered = matchSorter(filteredByChips, searchValue, {
        keys: ["name"],
      });
      setFilteredLayers(filtered);
    }
  }, [searchValue, layers, filterValues]); //eslint-disable-line

  const resetFilters = () => {
    setSearchValue("");
    setFilterValues({
      geometryTypes: [],
      layerCategories: [],
    });
  };

  const onSelectAllLayers = () => {
    setFilteredLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        if (filteredLayers.map((dd) => dd.name).includes(d.name)) {
          rec.enabled = true;
          rec.visible = true;
        }
        return rec;
      });
      return newValues;
    });
  };

  const onSelectNoneLayers = () => {
    setFilteredLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        if (filteredLayers.map((dd) => dd.name).includes(d.name)) {
          rec.enabled = false;
          rec.visible = false;
        }
        return rec;
      });
      return newValues;
    });
  };

  const handleControlsVisibility = (control, state) => {
    setControls((prevState) => {
      let newValues = { ...prevState };

      if (typeof state === "undefined" || state === null) {
        sessionStorage.setItem(
          `sk_${control}_control`,
          !newValues[control].visible
        );

        if (control === "basemap" && !newValues.basemap.visible) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, false);
        }

        if (control === "layers" && !newValues.layers.visible) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, false);
        }

        newValues[control].visible = !newValues[control].visible;
      } else {
        sessionStorage.setItem(`sk_${control}_control`, state);
        newValues[control].visible = state;

        if (control === "basemap" && state === true) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, false);
        }

        if (control === "layers" && state === true) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, false);
        }
      }
      return newValues;
    });
  };

  const onMapChange = (val) => setMap(val);
  const onBasemapChange = (val) => {
    setActiveBasemap(val);
  };
  const onZoomToLayerChange = (val) => setActiveZoomToLayer(val);
  const onLayerChange = (val) => setLayers(val);
  const onFilteredLayerChange = (val) => setFilteredLayers(val);
  const onVisibleLayerChange = (val) => setVisibleLayers(val);
  const onFilterValuesChange = (name, val) => {
    setFilterValues((prevState) => {
      let newValues = { ...prevState };
      let filterVals = [...newValues[name]];
      const existingIndex = filterVals.indexOf(val);
      if (existingIndex === -1) {
        filterVals.push(val);
      } else {
        filterVals.splice(existingIndex, 1);
      }
      newValues[name] = filterVals;
      return newValues;
    });
  };
  const onSearchValueChange = (val) => setSearchValue(val);

  return (
    <MapContext.Provider
      value={{
        map,
        controls,
        activeZoomToLayer,
        activeBasemap,
        basemapLayers,
        layers,
        filteredLayers,
        visibleLayers,
        filterValues,
        searchValue,
        filterActive,
        handleControlsVisibility,
        onMapChange,
        onZoomToLayerChange,
        onBasemapChange,
        onLayerChange,
        onFilteredLayerChange,
        onVisibleLayerChange,
        onFilterValuesChange,
        onSearchValueChange,
        resetFilters,
        onSelectAllLayers,
        onSelectNoneLayers,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
