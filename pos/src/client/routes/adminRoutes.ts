import loadable from "@loadable/component";
import { RouteType } from "./types";
import wrapWithProtectedRoute from "../routes/wrapWithProtectedRoute";
import AdminLayout from "../AdminDashboard/components/AdminLayout/AdminLayout";

// Lazy load components
const Dashboard = loadable(() => import("../AdminDashboard/components/Dashboard/Dashboard"), { ssr: true });
const Customers = loadable(() => import("../AdminDashboard/components/Customers/Customers"), { ssr: true });
const NotFound = loadable(() => import("../AdminDashboard/components/Notfound/Notfound"), { ssr: true });
const Products = loadable(() => import("../AdminDashboard/components/Products/Products"), { ssr: true });
const Sales = loadable(() => import("../AdminDashboard/components/Sales/Sales"), { ssr: true });
const Settings = loadable(() => import("../AdminDashboard/components/Settings/Setting"), { ssr: true });
const Reports = loadable(() => import("../AdminDashboard/components/Reports/Reports"), { ssr: true });


// Define the routes using the wrapper function
const adminRoutes: RouteType[] = [
  {
    path: "admin",
    layout: AdminLayout, 
    component: AdminLayout,
    children: [
      {
        path: "",
        index: true,
        component: wrapWithProtectedRoute(Dashboard),
      },
      {
        path: "customers",
        component: wrapWithProtectedRoute(Customers),
      },
      {
        path: "products",
        component: wrapWithProtectedRoute(Products),
      },
      {
        path: "sales",
        component: wrapWithProtectedRoute(Sales),
      },
      {
        path: "settings",
        component: wrapWithProtectedRoute(Settings),
      },
      {
        path: "reports",
        component: wrapWithProtectedRoute(Reports),
      },
      
      
    ],
  },
  { path: "*", component: NotFound },
];

export default adminRoutes;
