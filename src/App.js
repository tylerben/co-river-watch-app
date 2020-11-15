import React, { Suspense } from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useAuth0 } from "./hooks/useAuth0";
import NotFound from "./components/NotFound";
import Loading from "./components/Loading";
import theme from "./theme";
import { MapProvider } from "./pages/Map/MapProvider";

const MapPage = React.lazy(() => import("./pages/Map"));
const ReportsPage = React.lazy(() => import("./pages/Reports"));
const BasinSummariesPage = React.lazy(() => import("./pages/BasinSummaries"));
const BasinSummaryPage = React.lazy(() => import("./pages/BasinSummary"));

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/map" />
            </Route>
            <Route
              path="/map"
              exact
              render={() => (
                <MapProvider>
                  <MapPage />
                </MapProvider>
              )}
            />
            <Route
              path="/reports"
              exact
              render={() => (
                <MapProvider>
                  <ReportsPage />
                </MapProvider>
              )}
            />
            <Route
              path="/basin-summaries"
              exact
              render={() => (
                <MapProvider>
                  <BasinSummariesPage />
                </MapProvider>
              )}
            />
            <Route
              path="/basin-summaries/:basin"
              exact
              render={() => (
                <MapProvider>
                  <BasinSummaryPage />
                </MapProvider>
              )}
            />
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export default App;
