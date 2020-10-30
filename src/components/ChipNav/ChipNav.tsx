import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Chip, Link } from "@material-ui/core";
import { Flex } from "../Flex";

export type ChipNavProps = {
  title: string;
  menuItems: {
    id: string | number;
    title: string;
    path: string;
  }[];
};

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(0, 2, 1, 0),
  },
  chip: {
    cursor: "pointer",
    margin: theme.spacing(0, 1, 1, 0),
  },
}));

const ChipNav: React.FC<ChipNavProps> = ({ title, menuItems, ...other }) => {
  const classes = useStyles();
  return (
    <Flex alignItems="center">
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {menuItems.map((item) => (
        <Link key={item.id} component={RouterLink} to={item.path}>
          <Chip label={item.title} color="primary" className={classes.chip} />
        </Link>
      ))}
    </Flex>
  );
};

export default ChipNav;
