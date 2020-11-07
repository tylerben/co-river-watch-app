import React, { useContext } from "react";
import { Box, Typography, Button, Divider } from "@material-ui/core";
import ChipsFilter from "../ChipsFilter/ChipsFilter";
import {
  iFilteredFeatures,
  iLayer,
  iLayerSchema,
  MapContext,
} from "../../pages/Map/MapProvider";
import Autocomplete from "components/Autocomplete/Autocomplete";

export type FilterControlsProps = {
  layer: iLayer;
  open: boolean | undefined;
  onClose: () => void;
};

const getFilterValues = (
  filteredFeatures: iFilteredFeatures,
  layer: iLayer,
  filterField: iLayerSchema
) => {
  return filteredFeatures[layer.name].fields[filterField.name];
};

const LayerFeatureFilter: React.FC<FilterControlsProps> = ({
  layer,
  open = false,
  onClose,
}) => {
  const { filteredFeatures, onFilteredFeaturesChange } = useContext(MapContext);

  if (!layer) return null;
  return (
    <div>
      {open && (
        <Box
          bgcolor="#ffffff"
          boxShadow="0 0 0 2px rgba(0,0,0,.1)"
          borderRadius={4}
          position="absolute"
          zIndex={1200}
          top={10}
          left={50}
          width={500}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f5f5f6"
            pl={2}
            pr={2}
            pt={1}
            pb={1}
          >
            <Typography variant="h6">Filter Features</Typography>
            <Button
              variant="contained"
              disableElevation
              color="secondary"
              size="small"
              onClick={onClose}
            >
              Hide
            </Button>
          </Box>
          <Divider />
          <Box mt={1} mb={1} ml={2} mr={2}>
            {layer.schema.map((d, i) => {
              if (d.filter.type === "chip") {
                return (
                  <Box mt={1} key={d.name}>
                    <ChipsFilter
                      key={d.name}
                      title={d.label}
                      name={d.name}
                      data={d.filter.values}
                      values={getFilterValues(filteredFeatures!, layer, d)}
                      onChange={(name, value) => {
                        onFilteredFeaturesChange((prevState) => {
                          const newValues = { ...prevState };
                          const currFilterVals = [
                            ...newValues[layer.name].fields[name],
                          ];
                          const valIndex = currFilterVals.indexOf(value);
                          valIndex > -1
                            ? currFilterVals.splice(valIndex, 1)
                            : currFilterVals.push(value);
                          newValues[layer.name].fields[name] = currFilterVals;
                          return newValues;
                        });
                      }}
                    />
                    {i !== layer.schema.length - 1 && (
                      <Box mt={1}>
                        <Divider />
                      </Box>
                    )}
                  </Box>
                );
              } else if (d.filter.type === "search") {
                return (
                  <Box mt={1} key={d.name}>
                    <Typography variant="body1" paragraph>
                      {d.label}
                    </Typography>
                    <Autocomplete
                      multiple={d.filter.multiple}
                      data={d.filter.values}
                      name={d.name}
                      label={d.label}
                      value={getFilterValues(filteredFeatures!, layer, d)}
                      onChange={(event, value) => {
                        const { name } = event.target;
                        onFilteredFeaturesChange((prevState) => {
                          const newValues = { ...prevState };
                          newValues[layer.name].fields[name] = value;
                          return newValues;
                        });
                      }}
                      limitTags={2}
                    />
                    {i !== layer.schema.length - 1 && (
                      <Box mt={2}>
                        <Divider />
                      </Box>
                    )}
                  </Box>
                );
              }
              return null;
            })}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default LayerFeatureFilter;
