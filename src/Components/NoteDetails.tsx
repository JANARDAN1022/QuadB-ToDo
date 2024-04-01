import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoteById } from '../Redux/Reducers/NoteReducer'; 
import { UpdateNote } from '../Redux/Actions/NoteActions'; 
import { CiEdit } from "react-icons/ci"; 
import { RxCross1 } from "react-icons/rx"; 
import { Note } from '../Types/NoteTypes'; 
import { useDispatch } from 'react-redux'; 
import { unwrapResult } from '@reduxjs/toolkit'; 

const NoteDetails = () => {
  const { id } = useParams<{ id: string }>(); // Getting note id from URL params
  const [note, setNote] = useState<Note | null>(null); 
  const dispatch = useDispatch(); 
  const Navigate = useNavigate(); 
  const [updatedNote, setUpdatedNote] = useState<Note>({
    id: id ? id : '', 
    body: note ? note.body : { content: '', style: '' }, 
    Completed: note ? note.Completed : false, 
    title: note ? note.title : '' 
  });
  const [Updating, setUpdating] = useState(false); 
  const TitleRef = useRef<HTMLInputElement>(null); 
  const BodyRef = useRef<HTMLTextAreaElement>(null);

  //UseEffect to fetch note details when id changes
  useEffect(() => {
    if (id) {
      const fetchnote = getNoteById(id);
      if (fetchnote) {
        setNote(fetchnote as Note);
      }
    }
  }, [id]);

  // Function to handle edit mode
  const HandleEdit = () => {
    if (!Updating && note && id) {
      setUpdatedNote({
        body: note.body,
        Completed: note.Completed,
        id: id,
        title: note.title
      });
      setUpdating(true);
      TitleRef.current?.focus();
    } else {
      setUpdating(false);
    }
  }

  // Function to handle note update
  const handleUpdateNote = async () => {
    if (note && id) {
      if (updatedNote.body.content !== '' && updatedNote.title !== '' && (updatedNote.body.content !== note.body.content || updatedNote.title !== note.title || updatedNote.Completed !== note.Completed)) {
        const response = await dispatch<any>(UpdateNote(updatedNote));
        // Unwrap the result to get the action payload
        const result = unwrapResult(response);
        if (result?.success) {
          // Fetching the updated note and updating state
          const NewNote = await getNoteById(id);
          if (NewNote) {
            setNote(NewNote as Note);
            setUpdatedNote({
              id: NewNote.id,
              body: {
                content: NewNote.body.content,
                style: note.body.style
              },
              Completed: NewNote.Completed === true ? true : false,
              title: NewNote.title,
            });
            setUpdating(false);
          }
        }
      }
    }
  }

  return (
    <div className='relative flex gap-5 flex-col justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-black h-screen overflow-y-scroll items-center text-white p-10'>
      {/* Button to go back */}
      <button className='text-white rounded-md border py-2 px-4 absolute top-5 left-5 opacity-80 hover:opacity-100 transition-all ease-in-out duration-300' onClick={() => Navigate('/')}>Go back</button>
      <h1 className='absolute top-20 font-bold text-xl'>Note Details</h1>
      {/* Displaying note details */}
      {note ? (
        <div className='flex flex-col items-center w-[600px] justify-center self-center border relative border-yellow-400 shadow-md shadow-yellow-500 rounded-lg  p-10 gap-2'>
          {/* Displaying note ID */}
          <p className='absolute left-5 top-5'>ID: {note.id}</p>
          {/* Displaying note status */}
          {!Updating ?
            <span className={`absolute cursor-pointer  right-14 top-5 ${note.Completed ? 'text-green-500 hover:text-green-500 border-green-500' : 'text-blue-400 hover:text-blue-500 border-blue-500'}  transition-all ease-in 300ms mr-3 flex items-center`}><span className='text-white mr-1'>Status:</span>{note.Completed ? 'Completed' : 'Pending'}</span>
            :
            <span onClick={() => {
              if (note.Completed === updatedNote.Completed) {
                setUpdatedNote({ ...updatedNote, Completed: !note.Completed })
              } else {
                setUpdatedNote({ ...updatedNote, Completed: note.Completed })
              }
            }} className={`absolute cursor-pointer right-14 top-5 ${!note.Completed ? 'text-green-500 hover:text-green-500 border-green-500' : 'text-blue-400 hover:text-blue-500 border-blue-500'} ${updatedNote.Completed !== note.Completed ? 'border px-2 ' : ''} transition-all ease-in 300ms mr-3 flex items-center`}><span className='text-white mr-1'>Mark</span>{note.Completed ? 'Pending' : 'Completed'} {updatedNote.Completed !== note.Completed ? '' : '?'}</span>
          }
          {/* Edit and Close icons */}
          <CiEdit onClick={HandleEdit} size={30} className={`${!Updating ? '' : 'hidden'} absolute cursor-pointer hover:text-blue-500 right-5 top-5 text-blue-400 transition-all ease-in 300ms`} />
          <RxCross1 onClick={() => {
            setUpdating(false)
            setUpdatedNote({ ...updatedNote, Completed: note.Completed })
          }} size={30} className={`${!Updating ? 'hidden' : ''} absolute cursor-pointer hover:text-red-500 right-5 top-5 text-red-400 transition-all ease-in 300ms`} />
          {/* Displaying and editing note title */}
          <p className='flex gap-2 items-center mt-5'>Title: <span className={`${!Updating ? '' : 'hidden'}`}>{note.title}</span>
            <input maxLength={40} className={`${!Updating ? 'hidden' : ''} border p-2 outline-none border-white bg-transparent text-white rounded-md`} type='text' ref={TitleRef} placeholder={`${note.title}`} value={updatedNote.title} onChange={(e: any) => setUpdatedNote({ ...updatedNote, title: e.target.value })} />
          </p>
          {/* Displaying and editing note body */}
          <p className='flex gap-2 w-full mt-3'>Body:
            <span className={`${!Updating ? '' : 'hidden'}`}>{note.body.content}</span>
            <textarea maxLength={300} rows={5} ref={BodyRef} className={`${!Updating ? 'hidden' : ''} w-[400px]  outline-none  rounded-md overflow-hidden resize-none max-h-[300px]  bg-transparent text-white `} placeholder={`${note.body.content}`} value={updatedNote.body.content} onChange={(e: any) => setUpdatedNote({ ...updatedNote, body: e.target.value })} />
          </p>
          {/* Button to save changes */}
          <button onClick={handleUpdateNote} className={`${!Updating ? 'hidden' : ''} self-end bg-blue-400 hover:bg-blue-500 text-[rgba(255,255,255,0.8)] hover:text-white transition-all ease-in 300ms px-2 py-1 font-bold rounded-md`}>Save Changes</button>
        </div>
      ) : (
        <p>Note not found</p>
      )}
    </div>
  );
};

export default NoteDetails;
