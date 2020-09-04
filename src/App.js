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
                <Link to="/">Firestore Data Route</Link>
              </li>
              <li>
                <Link to="/about">No Data</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/about">
              <About />
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
  const {
    data: swrCollection,
    update: updateCollection,
  } = useCollection(`test`, { listen: true }); //listening results in faster data acess because it use local firestore cache
  console.log(`RENDER LOOP #${i++}`);
  // standard firestore
  useEffect(() => {
    const cleanDocumentSnapshot = fuego.db
      .collection("test")
      .doc("test")
      .onSnapshot((documentSnapshot) => {
        console.log("documentSnapshot metadata:", documentSnapshot.metadata);
        setDoc(documentSnapshot.data());
      });
    const cleanCollectionSnapshot = fuego.db.collection("test").onSnapshot(
      (querySnapshot) => {
        console.log("collectionSnapshot metadata:", querySnapshot.metadata);
        setCollection(querySnapshot.docs.map((doc) => doc.data()));
      },
      (error) => null
    );

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
  return (
    <div>
      <h2>Firestore Data Route</h2>
      firestore doc:
      <pre>{JSON.stringify(doc)}</pre>
      firestore collection:
      <pre>{JSON.stringify(collection)}</pre>
      swr doc:
      <pre>{JSON.stringify(swrDoc)}</pre>
      swr collection:
      <pre>{JSON.stringify(swrCollection)}</pre>
    </div>
  );
}

function About() {
  i = 0;
  return <h2>NO data</h2>;
}
