import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import BabyNote from "./BabyNote";

const api_url = 'http://localhost:7777/api'

function App() {
  const [curNotes, setNotes] = useState([]);
  const [state, setState] = useState(0);

  useEffect(()=>{
    //Initialize curNotes.
    fetch(api_url)
        .then((res) => res.json())
        .then((data) => setNotes(data))
  },[state]);

  async function addNote(newNote) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({type: 'add', note:newNote})
    };

    //Send POST request, wait for OK from server, then change state to reflect on the client side.
    await fetch(api_url, requestOptions);
    setState(state+1);

  }

  async function deleteNote(id) {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({type: 'delete', nid:id})
    };
    //Send POST request, wait for OK from server, then change state to reflect on the clide side.
    await fetch(api_url, requestOptions);
    setState(state+1);
  }

  function createNotes() {
    //idx no longer used to map, we have nid.
    return curNotes.map((note) => {
      return (
        <Note
          key={note.nid}
          id={note.nid}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
      );
    });
  }

  return (
    <div>
      <Header />
      <BabyNote onAdd={addNote} />
      {createNotes()}
      <Footer />
    </div>
  );
}

export default App;
