import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import BabyNote from "./BabyNote";
import notes from "../notes";

function App() {
  const [backendData, setBackendData] = useState([{}])
  const [curNotes, setNotes] = useState(notes);

  function addNote(newNote) {
    setNotes([...curNotes, newNote]);
  }

  function deleteNote(id) {
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
