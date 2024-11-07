import React from 'react';
import './App.css';
import { Home } from './Pages/Home';
import { Movies } from './Pages/Movies';
import { User } from './Pages/User';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Animes } from './Pages/Animes';
import { Header } from './Components/Header/Index';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div className="App">
      <BrowserRouter>     
       <Header/>
      <Routes>
       <Route path='/' element={<Home/>} />
       <Route path='user/:id' element={<User/>} />
       <Route path='movie/:id' element={<Movies/>} />
       <Route path='tv/:id' element={<Animes/>} />
      </Routes>      
      <ToastContainer />
      </BrowserRouter>

    </div>
  );
}

export default App;
