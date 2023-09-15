import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home.tsx";
import ErrorPage from "./ErrorPage.tsx";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import "./index.css";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import DisplayPoem from "./DisplayPoem.tsx";
import Root from "./Root.tsx";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
} from "reactfire";
import LogIn from "./LogIn.tsx";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBrC8XPP3Car005B7i0UoA8POwGQPHO1zc",
  authDomain: "poem-from-image.firebaseapp.com",
  projectId: "poem-from-image",
  storageBucket: "poem-from-image.appspot.com",
  messagingSenderId: "169553295103",
  appId: "1:169553295103:web:b358c42b11c545f8d4beca",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: async () => {
      const auth = getAuth();
      await auth.authStateReady();

      if (!auth.currentUser) {
        return redirect("/login");
      }

      return null;
    },
    children: [
      {
        path: "/",
        element: (<Home />),
      },
      {
        path: "poems/:poemId",
        loader: async ({ params }) => {
          console.log(params);
          return { poemId: params.poemId };
        },
        element: <DisplayPoem />,
      },
    ],
  },
  {
    path: "/login",
    element: <LogIn />,
  },
]);



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseApp={firebaseApp}>
    <AuthProvider sdk={getAuth(firebaseApp)}>
      <StorageProvider sdk={getStorage(firebaseApp)}>
        <FirestoreProvider sdk={getFirestore(firebaseApp)}>
          <RouterProvider router={router} />
        </FirestoreProvider>
      </StorageProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);
