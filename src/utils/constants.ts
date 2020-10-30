import HomeIcon from "@material-ui/icons/Home";
import MapIcon from "@material-ui/icons/LocationOn";
import StreetsImg from "images/streets.png";
import OutdoorsImg from "images/outdoors.png";
import SatelliteImg from "images/satellite.jpg";
import LightImg from "images/light.png";
import DarkImg from "images/dark.png";
import RasterImg from "images/raster.png";

export const MenuItems = [
  {
    link: "",
    title: "Home",
    activePath: "",
    exact: true,
    icon: HomeIcon,
    loginRequired: false,
  },
  {
    link: "map",
    title: "Map",
    activePath: "map",
    exact: true,
    icon: MapIcon,
    loginRequired: false,
  },
];

export const DummyBasemapLayers = [
  {
    name: "Streets",
    styleURL: "mapbox://styles/mapbox/streets-v11",
    image: StreetsImg,
  },
  {
    name: "Outdoors",
    styleURL: "mapbox://styles/mapbox/outdoors-v11",
    image: OutdoorsImg,
  },
  {
    name: "Satellite",
    styleURL: "mapbox://styles/mapbox/satellite-streets-v11",
    image: SatelliteImg,
  },
  {
    name: "Light",
    styleURL: "mapbox://styles/mapbox/light-v10",
    image: LightImg,
  },
  {
    name: "Dark",
    styleURL: "mapbox://styles/mapbox/dark-v10",
    image: DarkImg,
  },
  {
    name: "Raster",
    styleURL: "mapbox://styles/lrewater/ckfmqvtng6cad19r1wgf9acz8",
    image: RasterImg,
  },
];
