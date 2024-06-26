import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import SocketContextProvider from '../src/contexts/SocketContext';
import SelectedUserContextProvider from '../src/contexts/SelectedUserContext';

import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';


function App() {
  return (
    <BrowserRouter>
      <SocketContextProvider>
        <SelectedUserContextProvider>
        <Routes>
          <Route path="/" Component={LoginPage} />
          <Route path="home"  Component={HomePage} />
        </Routes>
        </SelectedUserContextProvider>
      </SocketContextProvider>
    </BrowserRouter>
  );
}

export default App;
