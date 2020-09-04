import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as firebase from "firebase";
import {
  FuegoProvider,
  useCollection,
  useDocument,
} from "@nandorojo/swr-firestore";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAN6BrzWq63NDIfIDgOkyi0OSKUEdNPcfI",
  authDomain: "react-router-firestore.firebaseapp.com",
  databaseURL: "https://react-router-firestore.firebaseio.com",
  projectId: "react-router-firestore",
  storageBucket: "react-router-firestore.appspot.com",
  messagingSenderId: "879025554208",
  appId: "1:879025554208:web:b39002bd68c27250d60d45",
};
firebase.initializeApp(FIREBASE_CONFIG).firestore().enablePersistence();
const fuego = {
  db: firebase.firestore(),
  auth: firebase.auth,
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(
    () => fuego.auth().onAuthStateChanged((user) => setLoaded(true)),
    []
  );
  if (!loaded) {
    return "loading";
  }
  return (
    <FuegoProvider fuego={fuego}>
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
    </FuegoProvider>
  );
}

let i = 0;

function Home() {
  const [doc, setDoc] = useState(null);
  const [collection, setCollection] = useState(null);
  const { data: swrDoc, update: updateDoc } = useDocument(`test/test`, {
    listen: true,
  });
  const { data: swrCollection, update: updateCollection } = useCollection(
    `test`
  );
  console.log(`RENDER LOOP #${i++}`);
  // standard firestore
  useEffect(() => {
    /*
    const getDoc = async () => {
      const docSnapshot = await fuego.db.collection("test").doc("test").get();
      //console.log("documentGet metadata:", docSnapshot.metadata);
      setDoc(docSnapshot);
    };
    const getCollection = async () => {
      const collectionSnapshot = await fuego.db.collection("test").get();
      //console.log("collectionGet metadata:", collectionSnapshot.metadata);
      setDoc(collectionSnapshot);
    };
    */
    const cleanDocumentSnapshot = fuego.db
      .collection("test")
      .doc("test")
      .onSnapshot((documentSnapshot) => {
        console.log("documentSnapshot metadata:", documentSnapshot.metadata);
        setDoc(documentSnapshot);
      });
    const cleanCollectionSnapshot = fuego.db.collection("test").onSnapshot(
      (querySnapshot) => {
        console.log("collectionSnapshot metadata:", querySnapshot.metadata);
        setCollection(querySnapshot);
      },
      (error) => null
    );
    //getDoc(); // needs no cleanup
    //getCollection();

    return () => {
      cleanDocumentSnapshot();
      cleanCollectionSnapshot();
    };
  }, []);
  console.log("firestore doc:");
  console.log(doc);
  console.log("firestore collection:");
  console.log(collection);

  console.log("swr doc:");
  console.log(swrDoc);
  console.log("swr collection:");
  console.log(swrCollection);
  return <h2>Home</h2>;
}

function About() {
  i = 0;
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
