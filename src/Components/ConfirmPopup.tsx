import React from 'react';

// Define props interface
interface ConfirmPopupProps {
  handleDeleteNote: (id: string) => void; 
  id: string; // ID of the note to be deleted
  setConfirmDeletePopup: React.Dispatch<React.SetStateAction<{
    open: boolean;
    id: string;
  }>>; 
}

const ConfirmPopup = ({ handleDeleteNote, id, setConfirmDeletePopup }: ConfirmPopupProps) => {

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Confirmation message */}
      <span className="text-white font-bold">Are you sure? Delete Note {id}</span>
      <div className="flex gap-2 items-center">
        {/* Delete button */}
        <button onClick={() => handleDeleteNote(id)} className="py-1 px-2 transition-all ease-in 300ms bg-red-400 hover:bg-red-500 border text-white rounded-md">Delete</button>
        {/* Cancel button */}
        <button onClick={() => setConfirmDeletePopup({ id: '', open: false })} className="py-1 px-2 text-white bg-blue-400 hover:bg-blue-500 border transition-all ease-in 300ms rounded-md">Cancel</button>
      </div>
    </div>
  );
}

export default ConfirmPopup;
