import React from 'react';
import { ComponentType } from 'react';
import loadable from '@loadable/component';

// Import or lazy load ProtectedRoute
const ProtectedRoute = loadable(() => import('./protectedRoute'), { ssr: true });

// Wrapper function to apply `ProtectedRoute` logic
const wrapWithProtectedRoute = (Component: ComponentType<any>) => {
  return (props: any) => <ProtectedRoute component={Component} {...props} />;
};

export default wrapWithProtectedRoute;
