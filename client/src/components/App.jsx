import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import BabyNote from "./BabyNote";
import {render} from "react-dom";

const api_url = 'http://localhost:7777/api'

function App() {
  const [curNotes, setNotes] = useState([]);
  const [state, setState] = useState(0);

  useEffect(()=>{
    fetch(api_url)
        .then((res) => res.json())
        .then((data) => setNotes(data))
  },[state]);

  function addNote(newNote) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({type: 'add', note:newNote})
    };

    fetch(api_url, requestOptions)
        .then(response => response.json())
        .then(data => {
          if(data.ok){
            setState(state+1)
          }
          else{
            render(<div>501 Error</div>)
          }
        })

    // setNotes([...curNotes, newNote]);
    // setState(state+1);
  }

  async function deleteNote(id) {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({type: 'delete', nid:id})
    };

    await fetch(api_url, requestOptions);
    setState(state+1);
  }

  function createNotes() {
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
