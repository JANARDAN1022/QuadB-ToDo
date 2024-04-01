import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Note,NoteState}  from '../../Types/NoteTypes';

 export function loadNotesFromLocalStorage(): Note[] | any{
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  }


  function saveNotesToLocalStorage(notes: Note[]) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

const initialState:NoteState ={
      Notes:loadNotesFromLocalStorage()
}

const AddNote = (state:NoteState,action:PayloadAction<Note>)=>{
   // console.log('Add Note:-',action.payload);
    state.Notes.push(action.payload);
    saveNotesToLocalStorage(state.Notes);
}


const DeleteNote = (state:NoteState,action:PayloadAction<string>)=>{
    state.Notes = state.Notes.filter((note) => note.id !== action.payload);    
    saveNotesToLocalStorage(state.Notes);
}

const UpdateNote = (state: NoteState, action: PayloadAction<Note>) => {
    const { id, title, body,Completed } = action.payload;
    const existingNoteIndex = state.Notes.findIndex((note) => note.id === id);
  
    if (existingNoteIndex !== -1) {
      state.Notes[existingNoteIndex] = { id, title, body,Completed };
      saveNotesToLocalStorage(state.Notes);
    }
  };

  export  function getNoteById(id: string): Note | undefined {
  const notes = loadNotesFromLocalStorage();
  if(notes){
    return notes.find((note:Note) => note.id === id);
  }
  }

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote:AddNote,
        updateNote:UpdateNote,
        deleteNote:DeleteNote,
        refresh:loadNotesFromLocalStorage,
    },
  });
  
  export const { addNote, updateNote,deleteNote,refresh, } = notesSlice.actions;
  
  export default notesSlice.reducer;