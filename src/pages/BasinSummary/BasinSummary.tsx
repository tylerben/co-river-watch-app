import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Container, Paper, Typography } from "@material-ui/core";
import BackArrow from "@material-ui/icons/KeyboardBackspace";
import { Link, useParams } from "react-router-dom";
import ReportsLayout from "components/ReportsLayout";
import { Basins } from "pages/BasinSummaries/Basins";

const useStyles = makeStyles(({ mixins, breakpoints, spacing }) => ({
  root: {
    overflowX: `hidden`,
    [breakpoints.up("md")]: {
      display: `flex`,
    },
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    marginTop: mixins.toolbar as any,
  },
  toolbar: mixins.toolbar,
  container: {
    marginTop: spacing(6),
    marginBottom: spacing(6),
  },
  paper: {
    padding: spacing(3),
  },
  img: {
    maxHeight: 400,
  },
}));

export type BasinData = {
  id: number;
  name: string;
  description: string;
  slug: string;
  image: any;
};

const BasinSummary: React.FC = (props) => {
  const classes = useStyles();
  const { basin } = useParams<{ basin: string }>();
  const basinData = useMemo<BasinData | undefined>(() => {
    if (basin) {
      return Basins.find((d) => d.slug === basin);
    }
  }, [basin]);

  if (!basinData) return null;
  return (
    <ReportsLayout>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Container maxWidth="md" className={classes.container}>
            <Box mb={1}>
              <Button
                size="large"
                startIcon={<BackArrow />}
                component={Link}
                to="/basin-summaries"
              >
                Return to Basins
              </Button>
            </Box>
            <Paper className={classes.paper}>
              <Box mb={3} textAlign="center">
                <img
                  className={classes.img}
                  src={basinData.image}
                  alt={basinData.name}
                />
              </Box>
              <Typography variant="h4" gutterBottom>
                {basinData.name} Basin
              </Typography>
              {basinData.description.split("\n").map((text) => (
                <Typography
                  key={text.substring(0, 8)}
                  variant="body1"
                  paragraph
                >
                  {text}
                </Typography>
              ))}
            </Paper>
          </Container>
        </div>
      </div>
    </ReportsLayout>
  );
};

export default BasinSummary;
