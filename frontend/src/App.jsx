import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import { AuthorizationProvider } from './context/authorizationContext';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthorizationProvider>
          <Routes>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/register' element={<Register></Register>}></Route>
            <Route path='/home' element={<Home></Home>}></Route>
          </Routes>
        </AuthorizationProvider>
      </BrowserRouter>
    </>
  )
}

export default App
