import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../Hooks'; 
import { AddNote, DeleteNote } from '../Redux/Actions/NoteActions'; 
import { MdDelete } from "react-icons/md"; 
import ConfirmPopup from './ConfirmPopup';
import { FaBold } from "react-icons/fa6"; 
import { GoItalic } from "react-icons/go"; 
import { Note } from '../Types/NoteTypes'; 
import { useNavigate } from 'react-router-dom'; 
import { unwrapResult } from '@reduxjs/toolkit'; 

const NoteApp = () => {
  const dispatch = useAppDispatch(); // Redux dispatch hook
  const Navigate = useNavigate(); // Navigation hook
  const notes = useAppSelector((state) => state.Notes.Notes); // Accessing notes state from Redux store
  const [newNote, setNewNote] = useState<Note>({ id: '', title: '', body: { content: '', style: '' }, Completed: false,Createdon:'',Updatedon:'' }); 
  const [TextType, setTextType] = useState<string>(''); 
  const [ConfirmDeletePopup, setConfirmDeletePopup] = useState<{ open: boolean, id: string }>({ id: '', open: false }); 
 
  const TitleRef = useRef<HTMLInputElement>(null); 
  const BodyRef = useRef<HTMLTextAreaElement>(null); 
  
  const MaxLength = 300; // Maximum length for note body

  
  const handleAddNote = () => {
    if (newNote.title && newNote.body) {
      if(notes.length===0){
     dispatch(AddNote({ ...newNote, id: String(notes.length + 1),Createdon:new Date(Date.now()).toDateString() }));
      }else{
        const newID = notes[notes.length-1]?.id
        dispatch(AddNote({ ...newNote, id: String(Number(newID) + 1),Createdon:new Date(Date.now()).toDateString()}));
      }
            // Resetting new note state
            setNewNote({ id: '', title: '', body: { content: '', style: '' }, Completed: false,Createdon:'',Updatedon:'' });
    } else {
      // Focusing on the appropriate input field if data is missing
      if (!newNote.title) {
        if (TitleRef && TitleRef.current) {
          TitleRef.current.focus();
        }
      } else if (!newNote.body) {
        if (BodyRef && BodyRef.current) {
          BodyRef.current.focus();
        }
      }
    }
  };

  // Function to navigate to a specific note
  const handleGetNote = (id: string) => {
    if (id) {
      Navigate(`/Note/${id}`);
    } else {
      console.log('No Id Found');
    }
  }

  
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await dispatch(DeleteNote(id));
      // Unwrapping the result of the action
      const result = unwrapResult(response);
      if (result?.success) {
        // Closing the confirmation popup if deletion is successful
        setConfirmDeletePopup({ id: '', open: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='relative flex gap-5 flex-col overflow-x-hidden  bg-gradient-to-r from-gray-700 via-gray-900 to-black h-screen overflow-y-scroll items-center text-white p-10'>
      {/* Confirmation popup for deleting notes */}
      <div className={`${ConfirmDeletePopup.open === true ? '' : 'hidden'}  absolute top-[40%] bg-gray-500 rounded-md z-50 text-black w-[300px] flex justify-center items-center p-10 shadow-md`}>
        <ConfirmPopup handleDeleteNote={handleDeleteNote} setConfirmDeletePopup={setConfirmDeletePopup} id={ConfirmDeletePopup.id} />
      </div>
      <h1 className='text-lg font-bold'>To-Do Notes</h1>
      
      {/* Form to add a new note */}
      <div className='flex flex-col gap-2 items-center border py-3 px-4 rounded-md w-full  max-w-[900px] min-h-[165px]'>
        <h2 className='text-sm md:text-lg font-bold'>Add New To-Do Note</h2>
        <form className='flex flex-col md:flex-row md:text-base justify-between w-full text-xs items-center mt-6 '>
          {/* Title input */}
          <div className='flex items-center gap-2'>
            <label className='min-[842px]:flex hidden'>Title:</label>
            <input
              disabled={ConfirmDeletePopup.open}
              onKeyDown={(e)=>{
                if(e.key==='Enter' && newNote.title!==''){
                  e.preventDefault();
                  if(newNote.body.content!==''){
                  handleAddNote()
                  }else{
                    if(BodyRef && BodyRef.current){
                      BodyRef.current.focus();
                    }
                  }
                }
              }}
              maxLength={40}
              className='text-black rounded-md border border-gray-500 p-2 w-[200px]'
              type="text"
              placeholder='Add Note Title'
              ref={TitleRef}
              value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
          </div>
          
          {/* Body textarea */}
          <div className='flex flex-col items-center gap-2  relative'>
            <div className='flex items-center gap-2'>
              <label className='min-[842px]:flex hidden'>Body:</label>
              <textarea
                disabled={ConfirmDeletePopup.open}
                ref={BodyRef}
                placeholder='Describe Your Note'
                maxLength={MaxLength}
                className={`text-black ${TextType === 'bold' ? 'font-bold' : TextType === 'italic' ? 'italic' : TextType === 'Bold&Italic' ? 'font-bold italic' : ''}  h-[50px] min-w-full md:w-[300px] rounded-md border border-gray-500 p-2`}
                value={newNote.body.content} onChange={(e) => setNewNote({ ...newNote, body: { ...newNote.body, content: e.target.value } })}
              />
            </div>
            
            {/* Text formatting buttons */}
            <div className='flex w-full  justify-around '>
              <span className='min-[842px]:flex hidden'>Text Filters:-</span>
              <button onClick={(e: any) => {
                e.preventDefault();
                setTextType('bold');
                setNewNote({ ...newNote, body: { ...newNote.body, style: 'bold' } });
              }}>
                <FaBold />
              </button>
              <button onClick={(e: any) => {
                e.preventDefault();
                setTextType('italic');
                setNewNote({ ...newNote, body: { ...newNote.body, style: 'italic' } });
              }}>
                <GoItalic />
              </button>
              <button
                onClick={(e: any) => {
                  e.preventDefault();
                  setTextType('Bold&Italic');
                  setNewNote({ ...newNote, body: { ...newNote.body, style: 'Bold&Italic' } });
                }}
                className='flex items-center'>
                <FaBold /> & <GoItalic />
              </button>
              <button onClick={(e: any) => {
                e.preventDefault();
                setTextType('');
              }}>Normal</button>
            </div>
            <span className='absolute w-full top-[-70px] md:top-[-25px] right-[-20px] md:right-[-68%]'>Characters left: {MaxLength - newNote.body.content.length}</span>
          </div>
          <button disabled={ConfirmDeletePopup.open} className='border  border-white p-2 rounded-md' type="button" onClick={handleAddNote}>
            Add Note
          </button>
        </form>
      </div>

      {/* Displaying the list of notes */}
      <div className={`${notes?.length > 4 ? 'grid grid-cols-3 ' : 'flex flex-col justify-center items-center '} mt-12  ${ConfirmDeletePopup.open ? 'blur' : ''}  min-w-full w-full gap-5`}>
        {notes && notes.length > 0 ?
          notes.map((note: Note) => (
            <ul key={note.id} className={`relative ${note.Completed ? 'border-green-500 text-green-500' : 'border-white'} border  flex p-3  w-full max-w-max min-w-full md:min-w-[350px]`}>
              <li className='w-full'>
                <div className='p-2 w-full  flex justify-between gap-2 items-center'>
                  <span className=''>{note.Createdon}</span>
                  <div className='flex items-center gap-2'>
                    {/* Button to view/edit note */}
                    <button onClick={() => handleGetNote(note.id)} className={` text-xs text-yellow-500 hover:text-yellow-400 transition-all 300ms ease-in`}>View/Edit Note</button>
                    {/* Button to delete note */}
                    <button type="button" className='' onClick={() => setConfirmDeletePopup({ id: note.id, open: true })}>
                      <MdDelete size={20} className='text-red-400 hover:text-red-500 cursor-pointer' />
                    </button>
                  </div>
                </div>
                
                {/* Displaying note title */}
                <h1 className={`text-center ${note.Completed ? 'line-through' : 'underline'} w-full self-center`}>{note.title}</h1>
                {/* Displaying note body */}
                <p className={`${note.body.style === 'bold' ? 'font-bold' : note.body.style === 'italic' ? 'italic' : note.body.style === 'Bold&Italic' ? 'font-bold italic' : ''} ml-2  break-all flex`}>{note.body.content?.slice(0, 45)}{note.body.content?.length > 45 ? '...... ' : ' '}</p>
              </li>
            </ul>
          ))
          :
          <span className='font-bold text-center'>No Notes Found Try Adding New Notes</span>
        }
      </div>
    </div>
  );
};

export default NoteApp;
