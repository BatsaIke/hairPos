import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "@fontsource/luckiest-guy";
import useScrollHandler from "./components/hooks/hooks/useScrollHandler";
import routes from "./routes/routes";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import { AppProvider } from "./AppContext";
import { Suspense } from "react";
import { CartProvider } from "./components/context/CartContext";
import { ProductProvider } from "./components/context/ProductContext";
import { OrderProvider } from "./components/context/OrderContext";
import { AuthProvider } from "./components/context/AuthProvider";
import { NotificationProvider } from "./components/context/NotificationContext";
import Spinner from "./components/UI/Spinner";

export const App = () => {
  useScrollHandler();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Set loading state on route changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading delay
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <AppProvider>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <NotificationProvider>
              <CartProvider>
                {loading && <Spinner />}
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
                              <Suspense fallback={<Spinner />}>
                                <Component {...route.props} />
                              </Suspense>
                            </Layout>
                          }
                        >
                          {children.map((child, childIndex) => (
                            <Route
                              key={childIndex}
                              path={child.path}
                              element={
                                <Suspense fallback={<Spinner />}>
                                  <child.component {...child.props} />
                                </Suspense>
                              }
                            />
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
