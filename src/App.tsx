import './App.css';
import NoteApp from './Components/NoteApp';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import NoteDetails from './Components/NoteDetails';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<NoteApp />} />
        <Route path='/Note/:id' element={<NoteDetails />} />
    </Routes>
    </Router>
  )
}

export default App