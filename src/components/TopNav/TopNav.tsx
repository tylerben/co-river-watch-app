import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { checkActive } from "../../utils";
import { useAuth0 } from "../../hooks/useAuth0";

export type iMenuItem = {
  link: string;
  title: string;
  activePath: string;
  exact?: boolean;
  loginRequired: boolean;
  rolesRequired?: string[];
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: `relative`,
    zIndex: 1400,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  activeLink: {
    color: `#ffffff`,
    backgroundColor: `rgba(0,0,0,0.2)`,
    fontSize: 17,
    margin: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    borderRadius: 4,
    textDecoration: `none`,
    "&:hover": {
      backgroundColor: `rgba(0,0,0,0.2)`,
      textDecoration: `none`,
    },
  },
  link: {
    color: `#ffffff`,
    fontSize: 17,
    margin: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    borderRadius: 4,
    textDecoration: `none`,
    "&:hover": {
      backgroundColor: `rgba(255,255,255,0.2)`,
      textDecoration: `none`,
    },
  },
}));

const TopNav: React.FC = () => {
  const classes = useStyles();
  let history = useHistory();
  const { isAuthenticated, user } = useAuth0();

  /**
   * Assign appropriate class name to menu item based
   * on if menu item is active or not
   * @param {*} url
   */
  const handleActive = (url: string, exact?: boolean) => {
    const active = checkActive(history, url, exact);
    if (active) {
      return classes.activeLink;
    }
    return classes.link;
  };

  // Configure sidebar menu items
  const MenuItems: iMenuItem[] = [
    // {
    //   link: "",
    //   title: "Home",
    //   activePath: "/",
    //   exact: true,
    //   loginRequired: false,
    // },
    {
      link: "map",
      title: "Station Map",
      activePath: "map",
      exact: true,
      loginRequired: false,
    },
    {
      link: "reports",
      title: "Reports",
      activePath: "reports",
      exact: true,
      loginRequired: false,
    },
  ];

  const returnMenuItem = (
    item: iMenuItem,
    isAuthenticated: boolean,
    user: { [key: string]: any }
  ) => {
    const li = (
      <Link
        key={item.link}
        component={RouterLink}
        to={item.link}
        className={handleActive(item.activePath, item.exact)}
      >
        {item.title}
      </Link>
    );

    if (item.loginRequired && item.rolesRequired && user) {
      let roleSwitch = false;
      const roles = [...item.rolesRequired];
      roles.forEach((role) => {
        if (user["https://lre-starter-kit-basic.org/roles"].includes(role)) {
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

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Colorado River Watch Data Explorer
          </Typography>
          {MenuItems.map((item) => returnMenuItem(item, isAuthenticated, user))}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopNav;
