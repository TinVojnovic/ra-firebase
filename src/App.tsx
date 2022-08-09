import React, { useEffect, useState } from "react";
import "./App.css";
import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

interface City {
  id: string;
  city: string;
  country: string;
}

function App() {
  const [items, setItems] = useState<City[]>([]);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  useEffect(() => {
    setListener();

    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        const uid = user.uid;

        console.log(user);
      } else {
      }
    });
  }, []);

  function setListener() {
    const q = query(collection(db, "cities"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((item) => item.data()) as City[];

      setItems(items);
    });
  }

  function handle() {
    const collectionRef = collection(db, "cities");

    addDoc(collectionRef, {
      city: "Zagreb",
      country: "Croatia",
    });
  }

  function handleForm(e: React.FormEvent) {
    /*e.preventDefault();
    if (!email || !password) {
      console.log("NEMA");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });*/

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  function logout() {
    signOut(auth)
  }

  function renderCities() {
    return items?.map((item) => {
      return (
        <div key={item.id}>
          <p>{item.city}</p>
          <p>{item.country}</p>
        </div>
      );
    });
  }

  return (
    <div className="App">
      <button onClick={handle}>Add</button>
      <form onSubmit={handleForm}>
        <input onChange={(e) => setEmail(e.currentTarget.value)} type="email" />
        <br />
        <input
          onChange={(e) => setPassword(e.currentTarget.value)}
          type="password"
        />
        <br />
        <button>Submit</button>
      </form>

      <button onClick={logout}>Logout</button>
      {renderCities()}
    </div>
  );
}

export default App;
