import React, { useState, useContext } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Drawer,
  IconButton,
  Box,
  Divider,
  Grid,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import FilterIcon from "@material-ui/icons/FilterList";
import HideIcon from "@material-ui/icons/VisibilityOff";
import DrawerTabs from "../DrawerTabs/DrawerTabs";
import DrawerTabPanel from "../DrawerTabPanel/DrawerTabPanel";
import LayerSearch from "../LayerSearch/LayerSearch";
import LayersList from "../LayerList/LayersList";
import { MapContext } from "../../pages/Map/MapProvider";

const drawerWidth = 340;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 0,
  },
  drawerOpen: {
    backgroundColor: "#f7f7f7",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: "#f7f7f7",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(6) + 1,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  icon: {
    color: theme.palette.secondary.main,
  },
  selected: {
    borderRight: `2px solid ${theme.palette.primary.main}`,
  },
  settingsIcon: {
    color: theme.palette.text.secondary,
  },
  popover: {
    padding: theme.spacing(2),
    maxWidth: 400,
  },
  btn: {
    margin: theme.spacing(2),
  },
}));

const MapDrawer: React.FC = () => {
  const classes = useStyles();
  const {
    filterActive,
    filteredLayers,
    controls,
    searchValue,
    onLayerChange,
    onFilteredLayerChange,
    onVisibleLayerChange,
    handleControlsVisibility,
    onSearchValueChange,
    resetFilters,
    onSelectAllLayers,
    onSelectNoneLayers,
  } = useContext(MapContext);

  const [activeTab, setActiveTab] = useState<number>(
    parseInt(sessionStorage.getItem("sk_active_drawer_tab") as string) || 0
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchValueChange(e.target.value);
  };

  const handleLayerToggle = (name: string) => {
    onVisibleLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.enabled = !rec.enabled;
          rec.visible = rec.enabled ? true : false;
        }
        return rec;
      });
    });
    onFilteredLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.enabled = !rec.enabled;
          rec.visible = rec.enabled ? true : false;
        }
        return rec;
      });
    });
    onLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.enabled = !rec.enabled;
          rec.visible = rec.enabled ? true : false;
        }
        return rec;
      });
    });
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: controls?.drawer?.visible,
        [classes.drawerClose]: !controls?.drawer?.visible,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: controls?.drawer?.visible,
          [classes.drawerClose]: !controls?.drawer?.visible,
        }),
      }}
    >
      <div className={classes.toolbar} />
      {controls?.drawer?.visible && (
        <div>
          <DrawerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <DrawerTabPanel activeTab={activeTab} index={0}>
            <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
              <LayerSearch
                value={searchValue}
                handleSearch={handleSearch}
                width="95%"
              />
            </Box>
            {/* <Box m={1}>
              <Button
                variant="contained"
                disableElevation
                size="small"
                color="secondary"
                disabled={controls.filterLayers.visible}
                fullWidth
                startIcon={<FilterIcon />}
                onClick={() => handleControlsVisibility("filterLayers")}
              >
                Filter Layers
              </Button>
            </Box> */}
            <Box m={1}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    size="small"
                    onClick={onSelectAllLayers}
                  >
                    + Select All
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    size="small"
                    onClick={onSelectNoneLayers}
                  >
                    - Select None
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <LayersList
              items={filteredLayers}
              searchText={searchValue}
              resetFilters={resetFilters}
              handleLayerToggle={handleLayerToggle}
              filterActive={filterActive}
            />
            <Divider />
          </DrawerTabPanel>
          {/* <DrawerTabPanel activeTab={activeTab} index={1}>
            TEST2
          </DrawerTabPanel> */}
        </div>
      )}

      {controls?.drawer?.visible ? (
        <>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handleControlsVisibility("drawer", false)}
            className={classes.btn}
            startIcon={<HideIcon />}
          >
            Hide Navigation
          </Button>
          {/* Necessary to create padding below btn */}
          <div className={classes.toolbar} />
        </>
      ) : (
        <IconButton onClick={() => handleControlsVisibility("drawer", true)}>
          <MenuIcon />
        </IconButton>
      )}
    </Drawer>
  );
};

export default MapDrawer;
