import {createAsyncThunk,Dispatch } from "@reduxjs/toolkit"; 
import {
    addNote,
    deleteNote,
    updateNote,
    refresh
} from '../Reducers/NoteReducer';
import { Note } from "../../Types/NoteTypes";



export const AddNote = createAsyncThunk('notes/add',async(Note:Note,{ dispatch }: { dispatch: Dispatch })=>{
    try{
     dispatch(addNote(Note));
     return {success:true}
    }catch(error:any){
    console.log(error);
    }
})

// UpdateNote async thunk
export const UpdateNote = createAsyncThunk('notes/update',async (note: Note, { dispatch }: { dispatch: Dispatch }) => {
      try {
        dispatch(updateNote(note));
        return { success: true }; // Return success status
      } catch (error: any) {
        console.log(error);
        return { success: false };
      }
    }
  );
  


export const DeleteNote = createAsyncThunk('notes/delete',async(NoteID:string,{ dispatch }: { dispatch: Dispatch })=>{
    try{
     dispatch(deleteNote(NoteID));
     return {success:true}
    }catch(error:any){
    console.log(error);
    }
});

// export const GetNote = createAsyncThunk('notes/Get',async(NoteID:string,{ dispatch }: { dispatch: Dispatch })=>{
//     try{
//      dispatch(getNote(NoteID));
//     }catch(error:any){
//     console.log(error);
//     }
// });

export const RefreshNotes = createAsyncThunk('notes/Refresh',async(_,{ dispatch }: { dispatch: Dispatch })=>{
    try{
     dispatch(refresh());
    }catch(error:any){
    console.log(error);
    }
});