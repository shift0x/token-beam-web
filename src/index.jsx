import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App'

import SwapPage from '././app/pages/SwapPage'
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path:"/",
        element: <SwapPage />
      },
    ]
  },
  
]);

root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain="ethereum" clientId="10b979e90e7b1522923fc2edcec0b719">
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
