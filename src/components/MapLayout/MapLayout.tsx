import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import Sidebar from "components/Sidebar";
import TopNav from "components/TopNav";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: `hidden`,
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
  },
}));

const MapLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <div className={classes.root}>
      {desktop ? <TopNav /> : <Sidebar />}
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default MapLayout;
