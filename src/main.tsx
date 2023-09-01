import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ErrorPage from "./ErrorPage.tsx";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DisplayPoem from "./DisplayPoem.tsx";
import Root from "./Root.tsx";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
} from "reactfire";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "poems/:poemId",
        element: <DisplayPoem />,
      },
    ],
  },
]);

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBrC8XPP3Car005B7i0UoA8POwGQPHO1zc",
  authDomain: "poem-from-image.firebaseapp.com",
  projectId: "poem-from-image",
  storageBucket: "poem-from-image.appspot.com",
  messagingSenderId: "169553295103",
  appId: "1:169553295103:web:b358c42b11c545f8d4beca",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseApp={firebaseApp}>
      <StorageProvider sdk={getStorage(firebaseApp)}>
        <FirestoreProvider sdk={getFirestore(firebaseApp)}>
          <RouterProvider router={router} />
        </FirestoreProvider>
      </StorageProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);
