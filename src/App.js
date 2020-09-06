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
const collectionPath = "test";
const docPath = `${collectionPath}/test`;
function Home() {
  console.log(`RENDER LOOP #${i++}`);
  const { data: swrDoc, update: updateDoc } = useDocument(docPath, {
    listen: true,
  });
  const {
    data: swrCollection,
    add: addDocumentSWR,
  } = useCollection(collectionPath, { listen: true }); //listening results in faster data acess because it use local firestore cache

  // standard firestore
  const [doc, setDoc] = useState(null);
  const [collection, setCollection] = useState(null);
  useEffect(() => {
    const cleanDocumentSnapshot = fuego.db
      .doc(docPath)
      .onSnapshot((documentSnapshot) => {
        console.log("documentSnapshot metadata:", documentSnapshot.metadata);
        setDoc(documentSnapshot);
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

  const updateDocFirestore = () => {
    doc.ref.set({ time: Date.now() }, { merge: true });
  };

  const addDocFirestore = () => {
    fuego.db
      .collection(collectionPath)
      .add({ type: "firestore", time: Date.now() });
  };

  console.log("firestore doc:");
  console.log(doc && doc.data());
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
      <pre>{JSON.stringify(doc && doc.data())}</pre>
      firestore collection:
      {collection && collection.length}
      <pre>{JSON.stringify(collection)}</pre>
      swr doc:
      <pre>{JSON.stringify(swrDoc)}</pre>
      swr collection:
      {swrCollection && swrCollection.length}
      <pre>{JSON.stringify(swrCollection)}</pre>
      <div>
        <button onClick={updateDocFirestore}>update document</button>
        <button onClick={() => updateDoc({ time: Date.now() })}>
          update document swr
        </button>
        <button onClick={addDocFirestore}>add document</button>
        <button
          onClick={() => addDocumentSWR({ test: "hi", time: Date.now() })}
        >
          add document swr
        </button>
      </div>
    </div>
  );
}

function About() {
  i = 0;
  return <h2>NO data</h2>;
}
