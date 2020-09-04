import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import firebase from "./firebase";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(
    () => firebase.auth().onAuthStateChanged((user) => setLoaded(true)),
    []
  );
  if (!loaded) {
    return "loading";
  }
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  const [doc, setDoc] = useState(null);
  const [collection, setCollection] = useState(null);
  useEffect(() => {
  console.log("firebase route useEffect");
    const getDoc = async () => {
      const docSnapshot = await firebase
        .firestore()
        .collection("test")
        .doc("test")
        .get();
      console.log("documentGet metadata:", docSnapshot.metadata);
      setDoc(docSnapshot);
    };
    const getCollection = async () => {
      const collectionSnapshot = await firebase
        .firestore()
        .collection("test")
        .get();
      console.log("collectionGet metadata:", collectionSnapshot.metadata);
      setDoc(collectionSnapshot);
    };
    const cleanDocumentSnapshot = firebase
      .firestore()
      .collection("test")
      .doc("test")
      .onSnapshot((documentSnapshot) => {
        console.log("documentSnapshot metadata:", documentSnapshot.metadata);
        setDoc(documentSnapshot);
      });
    const cleanCollectionSnapshot = firebase
      .firestore()
      .collection("test")
      .onSnapshot(
        (querySnapshot) => {
          console.log("collectionSnapshot metadata:", querySnapshot.metadata);
          setCollection(querySnapshot);
        },
        (error) => null
      );
    getDoc(); // needs no cleanup
    getCollection();

    return () => {
      cleanDocumentSnapshot();
      cleanCollectionSnapshot();
    };
  }, []);

  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
