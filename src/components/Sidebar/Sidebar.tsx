import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItems } from "../../utils/constants";
import logo from "../../images/starterkit_logo_white.png";
import { useAuth0 } from "../../hooks/useAuth0";

export type iMenuItem = {
  link: string;
  title: string;
  activePath: string;
  exact?: boolean;
  icon: any;
  loginRequired: boolean;
  rolesRequired?: string[];
};

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  mobileToolbar: {
    backgroundColor: theme.palette.primary.main,
    color: `#ffffff`,
  },
  toolbar: {
    textAlign: "center",
    padding: theme.spacing(1, 0),
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    width: drawerWidth,
    overflow: `auto!important`,
    backgroundColor: theme.palette.primary.main,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  logo: {
    maxWidth: 160,
  },
  nav: {
    color: `#ffffff`,
  },
  navIcon: {
    color: `#ffffff`,
  },
  navText: {
    "& span": {
      fontSize: `18px!important`,
    },
  },
}));

const Sidebar: React.FC = () => {
  const classes = useStyles();
  let history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth0();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // function for naviating to a specific page in the app
  const goTo = (route: string) => {
    history.push(`/${route}`);
    localStorage.setItem("last_url", history.location.pathname);
  };

  /**
   * Utility function used to determine if a menu link is active
   * @param {*} item
   */
  const setActive = (item: iMenuItem) => {
    if (item.exact) {
      return history.location.pathname === `/${item.activePath}`;
    } else {
      return history.location.pathname.includes(item.activePath);
    }
  };

  const returnMenuItem = (
    item: iMenuItem,
    isAuthenticated: boolean,
    user: { [key: string]: any }
  ) => {
    const li = (
      <ListItem
        button
        onClick={() => goTo(item.link)}
        selected={setActive(item)}
        key={item.title}
      >
        <ListItemIcon className={classes.navIcon}>
          <item.icon />
        </ListItemIcon>
        <ListItemText className={classes.navText} primary={item.title} />
      </ListItem>
    );

    if (item.loginRequired && item.rolesRequired && user) {
      let roleSwitch = false;
      const roles = [...item.rolesRequired];
      roles.forEach((role) => {
        if (user["https://ccwcd2.org/roles"].includes(role)) {
          roleSwitch = true;
        }
      });
      if (isAuthenticated && roleSwitch) {
        return li;
      }
    } else if (item.loginRequired) {
      if (isAuthenticated) {
        return li;
      }
    } else {
      return li;
    }
  };

  const drawer = (
    <div id="sidebar">
      <div className={classes.toolbar}>
        <img src={logo} className={classes.logo} alt="Logo" />
      </div>
      <List className={classes.nav}>
        {MenuItems.map((item) => returnMenuItem(item, isAuthenticated, user))}
      </List>
    </div>
  );

  return (
    <div>
      <Toolbar className={classes.mobileToolbar}>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          LRE Starter Kit Basic
        </Typography>
      </Toolbar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default Sidebar;
