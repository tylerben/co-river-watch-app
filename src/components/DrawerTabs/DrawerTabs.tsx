import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import ViewIcon from "@material-ui/icons/Category";

export type DrawerTabProps = {
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;
};

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginTop: theme.spacing(1),
    borderBottom: "1px solid #dddddd",
  },
  tab: {
    display: "flex",
    justifyItems: "center",
  },
}));

function a11yProps(index: number) {
  return {
    id: `sidebar-tab-${index}`,
    "aria-controls": `sidebar-tabs-panel-${index}`,
  };
}

const DrawerTabs: React.FC<DrawerTabProps> = ({ activeTab, setActiveTab }) => {
  const classes = useStyles();

  /**
   * Utility function used to set the tab label
   * Adds in the provided icon as well
   * @param {*} label
   * @param {*} Icon
   */
  const setTabLabel = (label: string, Icon: any) => {
    return (
      <div className={classes.tab}>
        <Icon style={{ marginRight: 8 }} />
        {label}
      </div>
    );
  };

  /**
   * Event handler for setting the active tab
   * Additionally updates the "er_active_report_tab"
   * in the user's session storage so that their
   * last selected tab is remembered
   * @param {*} event
   * @param {*} newValue
   */
  const handleChange = (
    event: React.ChangeEvent<{}>,
    value: number | string
  ) => {
    sessionStorage.setItem("er_active_report_tab", value as string);
    setActiveTab(value as number);
  };

  return (
    <Tabs
      className={classes.tabs}
      value={activeTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}
      aria-label="sidebar-tabs-nav"
    >
      <Tab label={setTabLabel("Layers", LayersIcon)} {...a11yProps(0)} />
      <Tab label={setTabLabel("Legend", ViewIcon)} {...a11yProps(1)} />
    </Tabs>
  );
};

export default DrawerTabs;
