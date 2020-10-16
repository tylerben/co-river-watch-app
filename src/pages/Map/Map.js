import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Paper } from "@material-ui/core";

import MapLayout from "../../components/MapLayout";
import MapDrawer from "../../components/MapDrawer";
import Map from "../../components/Map";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { MapContext } from "./MapProvider";

// create page styles
const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: `hidden`,
    [theme.breakpoints.up("md")]: {
      display: `flex`,
    },
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    marginTop: theme.mixins.toolbar,
  },
}));

const MapPage = (props) => {
  const classes = useStyles();
  const { controls } = useContext(MapContext);

  return (
    <MapLayout>
      <div className={classes.root}>
        <MapDrawer />
        <div className={classes.content}>
          <Box bgcolor="#f1f1f1" width="100%">
            <Map />
          </Box>

          {controls.dataViz.visible && (
            <Box
              ml="auto"
              mr="auto"
              width="95%"
              mt={-35}
              mb={8}
              zIndex={1399}
              position="relative"
            >
              <Paper style={{ padding: 24, height: 500 }}>
                <Typography variant="h5">Results</Typography>
              </Paper>
            </Box>
          )}
        </div>
      </div>
    </MapLayout>
  );
};

export default MapPage;
