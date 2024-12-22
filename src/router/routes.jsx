
import { createBrowserRouter } from "react-router";
import SignUp from '../auth/SignUp';
import SignIn  from "../auth/SignIn";
import { HomeSeller, ListProduct} from "../pages";
import ProtectedRoute from "./ProtectedRoute";
import { MainLayout } from "../layout";
import { MainLayoutCostumer } from "../layout/costumer";
import { HomeCostumer, ProductDetail } from "../pages/costumer";
import PrivateRoute from "./privateRoute";

const routes = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  { path: "/SignUp", element: <SignUp /> },


  // part untuk seller
  {
    path: "/seller",
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
     
      { path: "", element: <HomeSeller /> }, 
      { path: "products", element: <ListProduct /> },
    ],
    
  },

  // part untuk costumer
  {
    path: "/home",
    element: <PrivateRoute><MainLayoutCostumer /></PrivateRoute> ,
    children: [

      { path: "", element: <HomeCostumer /> },
      { path: "detail/:id", element: <ProductDetail/> },

    ],
    },

      // Fallback for undefined routes
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
  ]
  )


export default routes;