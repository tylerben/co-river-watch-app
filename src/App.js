import React, { Suspense } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useAuth0 } from "./hooks/useAuth0";
import NotFound from "./components/NotFound";
import Loading from "./components/Loading";
import theme from "./theme";
import { MapProvider } from "./pages/Map/MapProvider";

const Home = React.lazy(() => import("./pages/Home"));
const MapPage = React.lazy(() => import("./pages/Map"));

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
            <Route path="/" exact component={Home} />
            <Route
              path="/map"
              exact
              render={() => (
                <MapProvider>
                  <MapPage />
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
