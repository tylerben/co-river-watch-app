import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import GraphIcon from "@material-ui/icons/Assessment";

const DataVizControl = ({ open = false, onClose }) => {
  return (
    <div>
      <Box
        bgcolor="#ffffff"
        boxShadow="0 0 0 2px rgba(0,0,0,.1)"
        borderRadius={4}
        position="absolute"
        zIndex={1200}
        top={135}
        right={15}
        display="flex"
        flexDirection="column"
      >
        <Tooltip title="Data Viz Controls">
          <IconButton color={open ? "secondary" : "default"} onClick={onClose}>
            <GraphIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default DataVizControl;
