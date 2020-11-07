import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import {
  Button,
  Box,
  MuiThemeProvider,
  Typography,
  Divider,
} from "@material-ui/core";
import theme from "theme";
import "./index.css";
import useFetchData from "hooks/useFetchData";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    maxWidth: 350,
  },
  popupContent: {
    minWidth: 300,
    marginTop: theme.spacing(1),
  },
}));

export type PopupTypes = {
  activeFeature: MapboxGeoJSONFeature;
  handleLink: (url: string) => void;
};

export type PopupItemProps = {
  title: string;
  value: string | number;
};

const PopupItem: React.FC<PopupItemProps> = ({ title, value }) => {
  return (
    <Box display="flex" flexGrow={0} justifyContent="space-between" mb={1}>
      <Box>
        <Typography variant="body1">{title}</Typography>
      </Box>
      <Box>
        <Typography color="textSecondary" variant="body1">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export const Popup: React.FC<PopupTypes> = ({ activeFeature, handleLink }) => {
  const classes = useStyles();
  const { data } = useFetchData<{ report: string | null; data: string | null }>(
    `wsr/${activeFeature.properties?.WaterBodyId}`,
    [activeFeature]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className={classes.popupContent}>
          <Typography variant="h6" gutterBottom>
            {activeFeature.properties?.StationName}
          </Typography>
          <Divider />
          <Box mt={1} mb={1}>
            {activeFeature.properties?.Description !== "null" && (
              <Typography color="textSecondary" variant="body1" paragraph>
                {activeFeature.properties?.Description}
              </Typography>
            )}
            <PopupItem
              title="Basin"
              value={activeFeature.properties?.RWWaterShed}
            />
            <PopupItem title="River" value={activeFeature.properties?.River} />
            <PopupItem
              title="WBID"
              value={activeFeature.properties?.WaterBodyId}
            />
            <PopupItem
              title="Status"
              value={activeFeature.properties?.StationStatus}
            />
          </Box>
        </div>
        <Box mt={1} mb={1} display="flex">
          {data.report && (
            <Box>
              <Button
                target="_blank"
                rel="noopener"
                href={data.report}
                size="small"
                variant="contained"
                color="primary"
                disableElevation
                fullWidth
              >
                Download Report
              </Button>
            </Box>
          )}
          {data.data && (
            <Box ml={1}>
              <Button
                target="_blank"
                rel="noopener"
                href={data.data}
                size="small"
                variant="contained"
                color="secondary"
                disableElevation
                fullWidth
              >
                Download Data
              </Button>
            </Box>
          )}
        </Box>
      </div>
    </MuiThemeProvider>
  );
};
