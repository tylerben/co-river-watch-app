import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Chip, Box } from "@material-ui/core";

export type genericObject = {
  [key: string]: string | number;
};

export type ChipsFilterProps = {
  title: string;
  name: string;
  data: genericObject[];
  values: string[] | number[];
  onChange: (name: string, value: any) => void;
  valueField: string;
  displayField: string;
};

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0, 0.5, 0.5, 0),
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
    },
  },
}));

const ChipsFilter: React.FC<ChipsFilterProps> = ({
  title,
  name,
  data,
  values,
  onChange,
  valueField,
  displayField,
}) => {
  const classes = useStyles();

  return (
    <Box>
      {title && (
        <Typography variant="body1" paragraph>
          {title}
        </Typography>
      )}
      {data.map((d: genericObject) => (
        <Chip
          key={d[valueField]}
          color={
            values.includes(d[valueField] as never) ? "secondary" : "default"
          }
          onClick={() => onChange(name, d[valueField])}
          className={classes.chip}
          clickable={false}
          label={d[displayField]}
          variant={
            values.includes(d[valueField] as never) ? "default" : "outlined"
          }
        />
      ))}
    </Box>
  );
};

export default ChipsFilter;
