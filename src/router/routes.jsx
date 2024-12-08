
import { createBrowserRouter } from "react-router";
import SignUp from '../auth/SignUp';
import SignIn  from "../auth/SignIn";
import Seller from './../pages/seller';
import ProtectedRoute from "./ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "SignUp",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <SignIn />,
  },

  {
    path: "/seller",
    element:<ProtectedRoute><Seller/></ProtectedRoute> ,
  },
]);

export default routes;