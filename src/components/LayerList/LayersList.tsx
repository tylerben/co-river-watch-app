import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Checkbox,
  ListItemSecondaryAction,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@material-ui/core";
import FilterIcon from "@material-ui/icons/FilterList";
import LineIcon from "images/line_icon.png";
import PolygonIcon from "images/polygon_icon.png";
import PointIcon from "images/point_icon.png";
import { MapContext } from "pages/Map/MapProvider";

export type GeometryType = "line" | "fill" | "circle";

export type LayerItem = {
  name: string;
  geometry_type: GeometryType;
  enabled: boolean;
  filterable: boolean;
};

export type LayersListItemProps = {
  name: string;
  geometryType: GeometryType;
  enabled: boolean;
  filterable: boolean;
  handleLayerToggle: (val: string) => void;
};

export type LayersListProps = {
  items: LayerItem[] | null;
  searchText: string;
  resetFilters: () => void;
  handleLayerToggle: (val: string) => void;
  filterActive: boolean;
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: 500,
    overflowY: "scroll",
  },
  img: {
    width: "100%",
  },
  listItemText: {
    color: (props: { enabled?: boolean }) =>
      props.enabled ? theme.palette.text.primary : theme.palette.text.secondary,
    fontWeight: (props: { enabled?: boolean }) => (props.enabled ? 500 : 400),
  },
  secondaryAction: {
    display: "flex",
    alignItems: "center",
  },
  zoomIcon: {
    color: theme.palette.text.secondary,
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const setIcon = (type: GeometryType) => {
  const geometryFormatted = type.toLowerCase();
  if (geometryFormatted === "line") return LineIcon;
  if (geometryFormatted === "fill") return PolygonIcon;
  if (geometryFormatted === "circle") return PointIcon;
};

const LayerListItem: React.FC<LayersListItemProps> = ({
  name,
  geometryType,
  enabled,
  filterable,
  handleLayerToggle,
}) => {
  const classes = useStyles({ enabled });
  const {
    layers,
    onFilterFeaturesLayerChange,
    handleControlsVisibility,
  } = useContext(MapContext);

  return (
    <>
      <ListItem button>
        <Box width={20} mr={2}>
          <img
            src={setIcon(geometryType)}
            alt={geometryType}
            className={classes.img}
          />
        </Box>
        <ListItemText primary={name} className={classes.listItemText} />
        <ListItemSecondaryAction className={classes.secondaryAction}>
          {enabled && filterable && (
            <IconButton
              onClick={() => {
                onFilterFeaturesLayerChange(
                  layers?.filter((layer) => layer.name === name)[0]!
                );
                handleControlsVisibility("filterLayerFeatures");
              }}
            >
              <FilterIcon />
            </IconButton>
          )}

          <Checkbox
            edge="start"
            checked={enabled}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": "Layer Toggle" }}
            color="primary"
            onChange={() => handleLayerToggle(name)}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {/* <Divider /> */}
    </>
  );
};

const LayersList: React.FC<LayersListProps> = ({
  items,
  searchText,
  resetFilters,
  handleLayerToggle,
  filterActive,
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      {filterActive && (
        <Box
          m={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="primary">
            {items?.length} results found
          </Typography>
          <Button
            variant="contained"
            disableElevation
            size="small"
            onClick={resetFilters}
          >
            Clear
          </Button>
        </Box>
      )}
      <Divider />
      <List dense>
        {items?.length === 0 ? (
          <Box m={1} textAlign="center">
            <Typography variant="body1">No layers found</Typography>
          </Box>
        ) : (
          items?.map((item, i) => (
            <LayerListItem
              name={item.name}
              geometryType={item.geometry_type}
              enabled={item.enabled}
              filterable={item.filterable}
              key={item.name}
              handleLayerToggle={handleLayerToggle}
            />
          ))
        )}
      </List>
    </div>
  );
};

LayersList.propTypes = {};

export default LayersList;
