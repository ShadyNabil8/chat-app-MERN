import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import { AuthProvider } from './context/authContext';
import { GlobalStateProvider } from './context/GlobalStateContext.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <GlobalStateProvider>
            <Routes>
              <Route path='/login' element={<Login></Login>}></Route>
              <Route path='/register' element={<Register></Register>}></Route>
              <Route path='/home' element={<Home></Home>}></Route>
            </Routes>
          </GlobalStateProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
