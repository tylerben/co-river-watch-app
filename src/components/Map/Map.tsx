import React, { useEffect, useRef, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth0 } from "../../hooks/useAuth0";
import axios from "axios";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import BasemapControl from "../BasemapControl/BasemapControl";
import LayerControl from "../LayerControl/LayerControl";
import { MapContext } from "../../pages/Map/MapProvider";
import FiltersControls from "../FiltersControl/FiltersControl";
import DataVizControl from "../DataVizControl/DataVizControl";
const turf = require("@turf/turf");

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN as string;

// create page styles
const useStyles = makeStyles((theme) => ({
  map: {
    position: "relative",
    width: "100%",
    height: "100vh",
  },
  toolbar: theme.mixins.toolbar,
}));

const Map = () => {
  const classes = useStyles();
  const { getTokenSilently } = useAuth0();
  const {
    map,
    onMapChange,
    controls,
    handleControlsVisibility,
    basemapLayers,
    activeBasemap,
    activeZoomToLayer,
    onBasemapChange,
    filteredLayers,
    visibleLayers,
    onVisibleLayerChange,
    onFilteredLayerChange,
    onLayerChange,
    onZoomToLayerChange,
  } = useContext(MapContext);
  const mapContainer = useRef(null); // create a reference to the map container
  const [draw, setDraw] = useState(new MapboxDraw()); //eslint-disable-line
  const [mapIsLoaded, setMapIsLoaded] = useState(false);

  /**
   * create the map on page load and
   * add a simple zoom control
   */
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: activeBasemap?.styleURL,
      center: [-105.849298, 38.948947],
      zoom: 6.57,
      scrollZoom: false,
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-left");
    map.addControl(draw, "top-left");

    map.on("load", () => {
      setMapIsLoaded(true);
    });

    map.on("draw.create", updateDrawings);
    map.on("draw.delete", updateDrawings);
    map.on("draw.update", updateDrawings);

    function updateDrawings(e: React.MouseEvent) {
      let data = draw.getAll();
      async function saveDrawings() {
        try {
          const token = await getTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.put(
            `${process.env.REACT_APP_ENDPOINT}/api/user-geometry`,
            { features: data.features },
            { headers }
          );
        } catch (err) {
          // Is this error because we cancelled it ourselves?
          if (axios.isCancel(err)) {
            console.log(`call was cancelled`);
          } else {
            console.error(err);
          }
        }
      }
      saveDrawings();
    }

    onMapChange(map);
  }, []); //eslint-disable-line

  /**
   * TODO define actual geometry data type
   * Load map geometry from database
   */
  // const { data: geometryData } = useFetchData<any[]>("user-geometry", []);

  // useEffect(() => {
  //   if (geometryData.length > 0 && mapIsLoaded) {
  //     let feature = {
  //       type: "FeatureCollection",
  //       features: geometryData.map((feature) => ({
  //         type: "Feature",
  //         properties: {},
  //         geometry: feature.geometry,
  //       })),
  //     };
  //     draw.add(feature);
  //   }
  // }, [draw, geometryData, mapIsLoaded]);

  /**
   * Update the map style whenever the activeBasemap
   * changes
   */
  useEffect(() => {
    if (typeof map !== "undefined" && map !== null && map.isStyleLoaded()) {
      map.setStyle(activeBasemap?.styleURL!);
      map.on("style.load", function() {
        visibleLayers?.map((layer) => {
          if (
            !map.getSource(`${layer.name}-source`) &&
            layer.spatialData !== null &&
            layer.paint !== null
          ) {
            map.addSource(`${layer.name}-source`, {
              type: "geojson",
              data: layer.spatial_data,
            });

            map.addLayer({
              id: layer.name,
              type: layer.geometry_type,
              source: `${layer.name}-source`,
              // "source-layer": `${layer.name}-source`,
              layout: {
                visibility: layer.visible ? "visible" : "none",
              },
              paint: layer.paint,
            });
          }
          return layer;
        });

        visibleLayers?.map((layer) => {
          if (
            map.getSource(`${layer.name}-source`) &&
            layer.spatialData !== null &&
            layer.paint !== null
          ) {
            (map.getSource(`${layer.name}-source`) as GeoJSONSource).setData(
              layer.spatial_data
            );
            map.setLayoutProperty(
              layer.name,
              "visibility",
              layer.visible ? "visible" : "none"
            );
          }
          return layer;
        });
      });
    }
  }, [activeBasemap, map]); //eslint-disable-line

  useEffect(() => {
    if (typeof map !== "undefined" && map !== null) {
      setTimeout(() => {
        map.resize();
      }, 500);
    }
  }, [controls?.drawer?.visible, map]); //eslint-disable-line

  useEffect(() => {
    if (typeof map !== "undefined" && map !== null) {
      map.on("load", () => {
        visibleLayers?.map((layer) => {
          if (
            !map.getSource(`${layer.name}-source`) &&
            layer.spatialData !== null &&
            layer.paint !== null
          ) {
            console.log(layer);
            map.addSource(`${layer.name}-source`, {
              type: "geojson",
              data: layer.spatial_data,
            });

            map.addLayer({
              id: layer.name,
              type: layer.geometry_type,
              source: `${layer.name}-source`,
              // "source-layer": `${layer.name}-source`,
              layout: {
                visibility: layer.visible ? "visible" : "none",
              },
              paint: layer.paint,
            });
          }
          return layer;
        });
        // map.setStyle(activeBasemap.styleURL);
      });
      visibleLayers?.map((layer) => {
        if (
          map.getSource(`${layer.name}-source`) &&
          layer.spatialData !== null &&
          layer.paint !== null
        ) {
          (map.getSource(`${layer.name}-source`) as GeoJSONSource).setData(
            layer.spatial_data
          );
          map.setLayoutProperty(
            layer.name,
            "visibility",
            layer.visible ? "visible" : "none"
          );
        }
        return layer;
      });
    }
  }, [map, visibleLayers, activeBasemap]);

  useEffect(() => {
    if (typeof map !== "undefined" && map !== null && map.isStyleLoaded()) {
      const layer = filteredLayers?.find((d) => d.name === activeZoomToLayer);
      const bbox = turf.bbox(layer?.spatial_data);

      map.fitBounds(bbox, {
        padding: 100,
      });
    }
  }, [activeZoomToLayer, map]); //eslint-disable-line

  const handleLayerToggle = (name: string) => {
    onVisibleLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.visible = !rec.visible;
        }
        return rec;
      });
    });
    onFilteredLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          // rec.enabled = !rec.enabled;
          rec.visible = !rec.visible;
        }
        return rec;
      });
    });
    onLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          // rec.enabled = !rec.enabled;
          rec.visible = !rec.visible;
        }
        return rec;
      });
    });
  };

  return (
    <>
      <div className={classes.toolbar}></div>
      <div ref={mapContainer} className={classes.map}>
        <BasemapControl
          layers={basemapLayers}
          open={controls?.basemap.visible}
          onClose={() => handleControlsVisibility("basemap")}
          activeBasemap={activeBasemap}
          onBasemapChange={onBasemapChange}
        />
        <LayerControl
          layers={visibleLayers?.filter((d) => d.enabled)}
          open={controls?.layers.visible}
          onLayerChange={handleLayerToggle}
          onZoomToLayerChange={onZoomToLayerChange}
          onClose={() => handleControlsVisibility("layers")}
        />
        <FiltersControls
          open={controls?.filterLayers.visible}
          onClose={() => handleControlsVisibility("filterLayers")}
        />
        <DataVizControl
          open={controls?.dataViz.visible}
          onClose={() => handleControlsVisibility("dataViz")}
        />
      </div>
    </>
  );
};

export default Map;
