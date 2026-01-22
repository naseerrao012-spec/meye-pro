import { useState } from 'react'
import AddStudent from "./pages/datacell/AddStudent"
import AddTeacher from './pages/admin/AddTeacher';
import './App.css'
import Enrollment from './pages/datacell/Enrollment';
 
function App() {
  const [count, setCount] = useState(0)

  return (
   
    <div>
      <AddStudent />
      <hr />
      <AddTeacher />
      <hr />
      <Enrollment />
    </div>
  
      
  );
}

export default App
