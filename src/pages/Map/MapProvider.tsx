import React, {
  useMemo,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { matchSorter } from "match-sorter";
import useFetchData from "hooks/useFetchData";
import { DummyBasemapLayers } from "utils/constants";
import { Map as MapboxMap, AnyPaint } from "mapbox-gl";

export type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export type GeometryType = "line" | "circle" | "fill";

export type iLayerSchema = {
  name: string;
  label: string;
  filter: {
    type: "search" | "chip";
    multiple: boolean;
    values: string[] | number[];
  };
};

export interface iLayer {
  name: string;
  geometry_type: GeometryType;
  legend: boolean;
  enabled: boolean;
  visible: boolean;
  filterable: boolean;
  layer_categories: string[];
  layer_source_type: "geojson" | "tileset";
  layer_source_name?: string;
  spatial_data:
    | GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    | string;
  paint: AnyPaint;
  schema: iLayerSchema[];
  [key: string]: any;
}

export type iMapProviderValue = {
  map: MapboxMap | null;
  controls: iControls | null;
  activeFilterFeaturesLayer?: iLayer | null;
  activeZoomToLayer?: string | null;
  activeBasemap?: iActiveBasemap | null;
  basemapLayers: iBasemap[] | null;
  layers: iLayer[] | null;
  filteredLayers: iLayer[] | null;
  filteredFeatures: iFilteredFeatures | null;
  visibleLayers: iLayer[] | null;
  layersLoaded: boolean;
  filterValues: iFilterValues;
  searchValue: string;
  filterActive: boolean;
  onMapChange: (map: MapboxMap) => void;
  handleControlsVisibility: (control: string, state?: boolean) => void;
  onFilterFeaturesLayerChange: (val: iLayer) => void;
  onZoomToLayerChange: (val: string) => void;
  onBasemapChange: Dispatcher<iActiveBasemap>;
  onLayerChange: Dispatcher<iLayer[]>;
  onFilteredFeaturesChange: Dispatcher<iFilteredFeatures>;
  onFilteredLayerChange: Dispatcher<iLayer[]>;
  onVisibleLayerChange: Dispatcher<iLayer[]>;
  onFilterValuesChange: (name: string, val: string | string[]) => void;
  onSearchValueChange: (val: string) => void;
  resetFilters: () => void;
  onSelectAllLayers: () => void;
  onSelectNoneLayers: () => void;
};

export type iMapProviderProps = {
  children: React.ReactNode;
};

export type iFilterValues = {
  [key: string]: any;
  layerCategories: string[];
  geometryTypes: string[];
};

export type iFilteredFeatures = {
  [key: string]: {
    layer_name: string;
    fields: {
      [key: string]: any;
    };
  };
};

export type iBasemap = {
  name: string;
  styleURL: string;
  image: string;
};

export type iActiveBasemap = {
  name: string;
  styleURL: string;
};

export type iControls = {
  [key: string]: {
    visible: boolean;
    persistState: boolean;
  };
};

/**
 * Create a context that will be used to share global state
 * throughout the Map page.
 * The context contains stores state such as the currently selected
 * water year and month and the current water year
 * It also contains a handler for when the water year/month
 * filters are changed by the user
 */
export const MapContext = React.createContext<iMapProviderValue>({
  map: null,
  controls: null,
  activeFilterFeaturesLayer: null,
  activeZoomToLayer: null,
  activeBasemap: null,
  basemapLayers: null,
  layers: null,
  filteredLayers: null,
  filteredFeatures: null,
  visibleLayers: null,
  layersLoaded: false,
  filterValues: {
    layerCategories: [],
    geometryTypes: [],
  },
  searchValue: "",
  filterActive: false,
  onMapChange: (map) => {},
  handleControlsVisibility: (control: string, state?: boolean) => {},
  onFilterFeaturesLayerChange: (val: iLayer) => {},
  onZoomToLayerChange: (val: string) => {},
  onBasemapChange: () => {},
  onLayerChange: () => {},
  onFilteredFeaturesChange: () => {},
  onFilteredLayerChange: () => {},
  onVisibleLayerChange: () => {},
  onFilterValuesChange: (name: string, val: string | string[]) => {},
  onSearchValueChange: (val: string) => {},
  resetFilters: () => {},
  onSelectAllLayers: () => {},
  onSelectNoneLayers: () => {},
});

/**
 * Utility function used to check if a the drawer is currently open
 * @param {*} val
 */
const checkControlOpen = (val: string | null, defaultVisibility = true) => {
  if (val === "true") {
    return true;
  } else if (val === "false") {
    return false;
  }
  return defaultVisibility;
};

/**
 * Create the context provider for the map context
 */
export const MapProvider: React.FC<iMapProviderProps> = (props) => {
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [
    activeFilterFeaturesLayer,
    setActiveFilterFeaturesLayer,
  ] = useState<iLayer | null>(null);
  const [activeZoomToLayer, setActiveZoomToLayer] = useState<string | null>(
    null
  );
  const [activeBasemap, setActiveBasemap] = useState<iActiveBasemap>({
    name: "Streets",
    styleURL: "mapbox://styles/mapbox/streets-v11",
  });
  const [filteredFeatures, setFilteredFeatures] = useState<iFilteredFeatures>(
    {}
  );
  const [basemapLayers] = useState<iBasemap[]>(DummyBasemapLayers);
  const {
    data: layers,
    setData: setLayers,
    isLoading: isLayersLoading,
  } = useFetchData<iLayer[]>("stations", []);
  const {
    data: filteredLayers,
    setData: setFilteredLayers,
    isLoading: isFilteredLayersLoading,
  } = useFetchData<iLayer[]>("stations", []);
  const {
    data: visibleLayers,
    setData: setVisibleLayers,
    isLoading: isVisibleLayersLoading,
  } = useFetchData<iLayer[]>("stations", []);
  const layersLoaded = useMemo(() => {
    return (
      !isLayersLoading && !isFilteredLayersLoading && !isVisibleLayersLoading
    );
  }, [isLayersLoading, isFilteredLayersLoading, isVisibleLayersLoading]);
  const [filterValues, setFilterValues] = useState<iFilterValues>({
    layerCategories: [],
    geometryTypes: [],
  });
  const [searchValue, setSearchValue] = useState("");

  const [controls, setControls] = useState<iControls>({
    drawer: {
      persistState: true,
      visible: checkControlOpen(
        sessionStorage.getItem("sk_drawer_control"),
        true
      ),
    },
    basemap: {
      persistState: true,
      visible: checkControlOpen(
        sessionStorage.getItem("sk_basemap_control"),
        false
      ),
    },
    layers: {
      persistState: true,
      visible: checkControlOpen(
        sessionStorage.getItem("sk_layers_control"),
        false
      ),
    },
    filterLayers: {
      persistState: true,
      visible: checkControlOpen(
        sessionStorage.getItem("sk_filterLayers_control"),
        false
      ),
    },
    filterLayerFeatures: {
      persistState: false,
      visible: false,
    },
    dataViz: {
      persistState: false,
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
      filterValues.layerCategories.length === 0
    ) {
      setFilteredLayers(layers);
    } else {
      let filteredByChips = [...layers];

      if (filterValues.geometryTypes.length > 0) {
        filteredByChips = filteredByChips.filter((layer) =>
          filterValues.geometryTypes.includes(layer.geometry_type)
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

  useEffect(() => {
    if (layers.length !== 0) {
      const filterEnabledLayers = layers.filter((layer) => layer.filterable);
      const initFilterVals: iFilteredFeatures = {};
      filterEnabledLayers.forEach((layer) => {
        initFilterVals[layer.name] = {
          layer_name: layer.name,
          fields: layer.schema.reduce((acc: { [key: string]: any }, curr) => {
            acc[curr.name] = [];
            return acc;
          }, {}),
        };
      });
      setFilteredFeatures(initFilterVals);
    }
  }, [layers]);

  const resetFilters = () => {
    setSearchValue("");
    setFilterValues({
      geometryTypes: [],
      layerCategories: [],
    });
  };

  const onSelectAllLayers = () => {
    setFilteredLayers((prevState) => {
      let newValues = [...prevState].map((d: iLayer) => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers((prevState) => {
      let newValues = [...prevState].map((d: iLayer) => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setLayers((prevState) => {
      let newValues = [...prevState].map((d: iLayer) => {
        let rec = { ...d };
        if (filteredLayers.map((dd: iLayer) => dd.name).includes(d.name)) {
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
      let newValues = [...prevState].map((d: iLayer) => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers((prevState) => {
      let newValues = [...prevState].map((d: iLayer) => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setLayers((prevState) => {
      let newValues = [...prevState].map((d: iLayer) => {
        let rec = { ...d };
        if (filteredLayers.map((dd: iLayer) => dd.name).includes(d.name)) {
          rec.enabled = false;
          rec.visible = false;
        }
        return rec;
      });
      return newValues;
    });
  };

  const handleControlsVisibility = (control: string, state?: boolean) => {
    setControls((prevState) => {
      let newValues = { ...prevState };
      const stateString = state?.toString();

      if (typeof state === "undefined" || state === null) {
        if (newValues[control].persistState) {
          sessionStorage.setItem(
            `sk_${control}_control`,
            (!newValues[control].visible).toString()
          );
        }

        if (control === "basemap" && !newValues.basemap.visible) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, "false");
        }

        if (control === "layers" && !newValues.layers.visible) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, "false");
        }

        newValues[control].visible = !newValues[control].visible;
      } else {
        sessionStorage.setItem(`sk_${control}_control`, stateString as string);
        newValues[control].visible = state;

        if (control === "basemap" && state === true) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, "false");
        }

        if (control === "layers" && state === true) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, "false");
        }
      }
      return newValues;
    });
  };

  const onMapChange = (val: MapboxMap) => setMap(val);
  const onBasemapChange: Dispatcher<iActiveBasemap> = (val) =>
    setActiveBasemap(val);
  const onFilterFeaturesLayerChange: Dispatcher<iLayer | null> = (val) =>
    setActiveFilterFeaturesLayer(val);
  const onZoomToLayerChange: Dispatcher<string | null> = (val) =>
    setActiveZoomToLayer(val);
  const onLayerChange: Dispatcher<iLayer[]> = (val) => setLayers(val);
  const onFilteredLayerChange: Dispatcher<iLayer[]> = (val) =>
    setFilteredLayers(val);
  const onVisibleLayerChange: Dispatcher<iLayer[]> = (val) =>
    setVisibleLayers(val);
  const onFilteredFeaturesChange: Dispatcher<iFilteredFeatures> = (val) =>
    setFilteredFeatures(val);
  const onFilterValuesChange = (name: string, val: string | string[]) => {
    setFilterValues((prevState) => {
      let newValues: iFilterValues = { ...prevState };
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
  const onSearchValueChange = (val: string) => setSearchValue(val);

  return (
    <MapContext.Provider
      value={{
        map,
        controls,
        activeFilterFeaturesLayer,
        activeZoomToLayer,
        activeBasemap,
        basemapLayers,
        layers,
        filteredFeatures,
        filteredLayers,
        visibleLayers,
        layersLoaded,
        filterValues,
        searchValue,
        filterActive,
        handleControlsVisibility,
        onMapChange,
        onFilteredFeaturesChange,
        onFilterFeaturesLayerChange,
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
