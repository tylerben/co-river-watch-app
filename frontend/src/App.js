import React, { Suspense } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useAuth0 } from "./hooks/useAuth0";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import Loading from "./components/Loading";
import theme from "./theme";
import { MapProvider } from "./pages/Map/MapProvider";

const Home = React.lazy(() => import("./pages/Home"));
const MapPage = React.lazy(() => import("./pages/Map"));
const AuthenticatedHome = React.lazy(() => import("./pages/AuthenticatedHome"));
const Contacts = React.lazy(() => import("./pages/DataManagement/Contacts"));
const ContactGroups = React.lazy(() =>
  import("./pages/DataManagement/ContactGroups")
);
const ContactsToGroups = React.lazy(() =>
  import("./pages/DataManagement/ContactsToGroups")
);
const Orders = React.lazy(() => import("./pages/DataManagement/Orders"));

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
            <PrivateRoute
              path="/map"
              exact
              render={() => (
                <MapProvider>
                  <MapPage />
                </MapProvider>
              )}
            />

            {/* Private Route Example */}
            <PrivateRoute
              path="/authenticated-home"
              exact
              component={AuthenticatedHome}
            />
            <PrivateRoute
              path="/data-management/contacts"
              exact
              component={Contacts}
            />
            <PrivateRoute
              path="/data-management/contact-groups"
              exact
              component={ContactGroups}
            />
            <PrivateRoute
              path="/data-management/contacts-to-groups"
              exact
              component={ContactsToGroups}
            />
            <PrivateRoute
              path="/data-management/orders"
              exact
              component={Orders}
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
