import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import ReportsLayout from "components/ReportsLayout";
import { Basins } from "pages/BasinSummaries/Basins";
import { Link } from "react-router-dom";

const excerpt = (text: string, limitChars = 300) => {
  return text.substring(0, limitChars) + "...";
};

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
}));

const BasinSummaries: React.FC = (props) => {
  const classes = useStyles();
  return (
    <ReportsLayout>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Container maxWidth="lg" className={classes.container}>
            <Typography variant="h4" gutterBottom>
              Major Colorado River Basins
            </Typography>
            <Typography variant="body1" paragraph>
              Learn about the major river basins of Colorado that have helped
              earn us the nickname of the headwaters state.
            </Typography>
            <Grid container spacing={3}>
              {Basins.map((basin) => (
                <Grid item xs={12} md={4} key={basin.id}>
                  <Card key={basin.id}>
                    <CardContent>
                      <Typography variant="h5" color="primary" gutterBottom>
                        {basin.name}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {excerpt(basin.description)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        component={Link}
                        to={`/basin-summaries/${basin.slug}`}
                      >
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>
      </div>
    </ReportsLayout>
  );
};

export default BasinSummaries;
