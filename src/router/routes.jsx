
import { createBrowserRouter } from "react-router";
import SignUp from '../auth/SignUp';
import SignIn  from "../auth/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import { MainLayout } from "../layout";
import { MainLayoutCostumer } from "../layout/costumer";
import { HomeCostumer, ProductDetailPage, DemoPage,  } from "../pages/costumer";
import PrivateRoute from "./privateRoute";
import GLBViewerDemo from "../pages/costumer/GLBViewerDemo";
import Admin from "../pages/admin/Admin";
import ListProduct from "../pages/admin/ListProduct";

const routes = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "/demo", element: <DemoPage /> },
   {path: "/screenshot-demo",element: <GLBViewerDemo />,},
   {path: "/glb-demo",element: <GLBViewerDemo />,},


  // part untuk admin
  {
    path: "/admin",
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
     
      { path: "", element: <Admin /> }, 
      { path: "products", element: <ListProduct /> },
    ],
    
  },

  // part untuk costumer
  {
    path: "/home",
    element: <PrivateRoute><MainLayoutCostumer /></PrivateRoute> ,
    children: [

      { path: "", element: <HomeCostumer /> },
      { path: "detail/:id", element: <ProductDetailPage/> },

    ],
    },

  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
  ]
  )


export default routes;