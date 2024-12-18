
import { createBrowserRouter } from "react-router";
import SignUp from '../auth/SignUp';
import SignIn  from "../auth/SignIn";
import { DetailProduct, HomeSeller, ListProduct } from "../pages";
import ProtectedRoute from "./ProtectedRoute";
import { MainLayout } from "../layout";

const routes = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  { path: "/SignUp", element: <SignUp /> },

  {
    path: "/home",
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
     
      { path: "", element: <HomeSeller /> }, 
      { path: "detail/:id", element: <DetailProduct /> },
      { path: "products", element: <ListProduct /> },
    ],
    
  },

]);

export default routes;