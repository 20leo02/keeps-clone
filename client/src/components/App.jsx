import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import BabyNote from "./BabyNote";

function App() {
  const [curNotes, setNotes] = useState([]);
  const [state, setState] = useState(0);

  useEffect(()=>{
    fetch('http://localhost:7777/api')
        .then((res) => res.json())
        .then((data) => setNotes(data))
  },[state]);

  function addNote(newNote) {
    setNotes([...curNotes, newNote]);
  }

  function deleteNote(id) {
    //const deletedNote = curNotes.filter((__, idx) => idx === id)
    setNotes(curNotes.filter((__, idx) => idx !== id));
  }

  function createNotes() {
    return curNotes.map((note, idx) => {
      return (
        <Note
          key={idx}
          id={idx}
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
