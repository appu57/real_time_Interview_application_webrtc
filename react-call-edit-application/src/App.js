import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import SocketContextProvider from '../src/contexts/SocketContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';


function App() {
  return (
    <BrowserRouter>
      <SocketContextProvider>
        <Routes>
          <Route path="/" Component={LoginPage} />
          <Route path="home"  Component={HomePage} />
        </Routes>
      </SocketContextProvider>
    </BrowserRouter>
  );
}

export default App;
