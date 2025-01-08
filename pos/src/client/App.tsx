import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@fontsource/luckiest-guy";
import useScrollHandler from "./components/hooks/hooks/useScrollHandler";
import routes from "./routes/routes";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import { getCookie } from "./utils/functions";
import { AppProvider } from "./AppContext";

import { Suspense } from "react";
import { CartProvider } from "./components/context/CartContext";
import { ProductProvider } from "./components/context/ProductContext";
import { OrderProvider } from "./components/context/OrderContext";
import { AuthProvider } from "./components/context/AuthProvider";
import { NotificationProvider } from "./components/context/NotificationContext";
import Spinner from "./components/UI/Spinner";
/* XXXXXXXXXXXXXXXXXXX */

/* WORDS BEFORE: If you run the SSR server as yarn build and then yarn serve, it will be marked as NODE_ENV=PRODUCTION*/
/* If you run by using yarn dev:server, it will use NODE_ENV=DEVELOPMENT */

/* XXXXXXXXXXXXXXXXXXX */

export const App = () => {
  useScrollHandler();
  // useAuthTokenExpiration(auth);

  return (
   
        
              <AppProvider>
                <AuthProvider>
              <ProductProvider>
                <OrderProvider>
                <NotificationProvider>
                <CartProvider>
                <Suspense fallback={<Spinner />}>
                  <Routes>
                    {routes.map((route, index) => {
                      const Layout = route.layout || React.Fragment;
                      const Component = route.component;
                      const children = route.children || [];

                      return (
                        <Route
                          key={index}
                          path={route.path}
                          element={
                            <Layout>
                              <Component {...route.props} />
                            </Layout>
                          }
                        >
                          {children.map((child: any, childIndex: number) => (
                            <Route key={childIndex} path={child.path} element={<child.component {...child.props} />} />
                          ))}
                        </Route>
                      );
                    })}
                  </Routes>
                </Suspense>
                
                </CartProvider>
                </NotificationProvider>
                </OrderProvider>
                </ProductProvider>
                </AuthProvider>
              </AppProvider>
           
        
  );
};

export default App;
