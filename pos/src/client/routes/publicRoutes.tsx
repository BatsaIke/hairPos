import loadable from "@loadable/component";
import { RouteType } from "./types";
import { TextContentRoutes } from "./contentRoutes/contentRoutes";
import wrapWithProtectedRoute from "../routes/wrapWithProtectedRoute";

// Dynamically load components for better performance
const Dashboard = loadable(() => import("../components/Dashboard/Dashboard"), { ssr: true });
const PublicLayout = loadable(() => import("../layouts/public/PublicLayout"), { ssr: true });
const Salesscreen = loadable(() => import("../components/SalesScreen/SalesScreen"), { ssr: true });
const CheckoutPage = loadable(() => import("../components/Checkoutpage/CheckoutPage"), { ssr: true });
const NotificationPage = loadable(() => import("../components/Dashboard/NotificationList/NotificationPage"), { ssr: true });

const Login = loadable(() => import("../pages/Login/LoginPage"), { ssr: true });
const Signup = loadable(() => import("../pages/Register/SignupPage"), { ssr: true });



// Utility functions and constants
const clearNotification = () => {
  console.log("Notifications cleared!");
};

// Define public routes
const publicRoutes: RouteType[] = [
  {
    path: "",
    component: wrapWithProtectedRoute(Dashboard),
  },
  {
    path: "sales",
    component: wrapWithProtectedRoute(Salesscreen),
  },
  {
    path: "checkout",
    component: wrapWithProtectedRoute(CheckoutPage),
  },
  {
    path: "login",
    component: Login,
  },
  {
    path: "signup",
    component: Signup,
  },
  {
    path: 'notifications',
    component: wrapWithProtectedRoute(NotificationPage),
  },
 
  
  ...TextContentRoutes, 
];

export default publicRoutes;
