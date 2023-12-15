import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import BabyNote from "./BabyNote";
import notes from "../notes";

function App() {
  const [noteData, setNoteData] = useState("")
  const [curNotes, setNotes] = useState(notes);

  useEffect(()=>{
    fetch('http://localhost:7777/api')
        .then((res) => res.json())
        .then((data) => setNoteData(data.content))
  },[]);

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
  return(
      <div>
        <p>{noteData}</p>
      </div>
  );
  // return (
  //   <div>
  //     <Header />
  //     <BabyNote onAdd={addNote} />
  //     {createNotes()}
  //     <Footer />
  //   </div>
  // );
}

export default App;
