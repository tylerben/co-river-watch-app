import { createMuiTheme } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";
import blue from "@material-ui/core/colors/blue";

// This allows us to wrap the entire application in our custom theme
export default createMuiTheme({
  palette: {
    primary: teal,
    secondary: {
      light: blue[300],
      main: blue[600],
      dark: blue[700],
    },
    background: {
      default: "#f1f1f1",
    },
  },
  typography: {
    useNextVariants: true,
  },
});
