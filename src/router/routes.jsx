
import { createBrowserRouter } from "react-router";
import SignUp from '../auth/SignUp';
import SignIn  from "../auth/SignIn";
import { MainLayout } from "../layout";
import { MainLayoutCostumer } from "../layout/costumer";
import { HomeCostumer, ProductDetailPage, DemoPage, CheckoutPage } from "../pages/costumer";
import Admin from "../pages/admin/Admin";
import ListProduct from "../pages/admin/ListProduct";
import { AdminOnlyRoute, AuthenticatedRoute, RoleBasedRedirect } from "./RoleBasedRoute";

const routes = createBrowserRouter([
  // Redirect berdasarkan role jika user sudah login
  { 
    path: "/dashboard", 
    element: <RoleBasedRedirect /> 
  },
  
  // Public routes - tidak perlu login
  { 
    path: "/", 
    element: <MainLayoutCostumer />,
    children: [
      { path: "", element: <HomeCostumer /> },
      { path: "detail/:id", element: <ProductDetailPage/> },
    ],
  },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/demo", element: <DemoPage /> },

  // Admin-only routes
  {
    path: "/admin",
    element: <AdminOnlyRoute><MainLayout /></AdminOnlyRoute>,
    children: [
      { path: "", element: <Admin /> }, 
      { path: "products", element: <ListProduct /> },
    ],
  },

  // Protected routes - memerlukan login (any role)
  {
    path: "/checkout",
    element: <AuthenticatedRoute><MainLayoutCostumer /></AuthenticatedRoute>,
    children: [
      { path: "", element: <CheckoutPage /> },
    ],
  },

  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
]);


export default routes;