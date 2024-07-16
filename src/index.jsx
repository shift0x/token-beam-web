import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App'

import SwapPage from './app/pages/SwapPage';
import HomePage from './app/pages/HomePage';
import AffiliatesPage from './app/pages/AffiliatesPage';
import { createBrowserRouter, RouterProvider} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path:"/",
        element: <HomePage />
      },
      {
        path: "/swap",
        element: <SwapPage />
      },
      {
        path: "/affiliates",
        element: <AffiliatesPage />
      }
    ]
  },
  
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
