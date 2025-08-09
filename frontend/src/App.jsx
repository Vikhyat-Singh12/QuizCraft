import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import CreateForm from './pages/Form';
import Home from './pages/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Preview from './pages/Preview';
import SubmitTest from './pages/SubmitTest';
import Error404 from './pages/Eror_404';


const App = () => {  
  const {user,getMe} = useAuthStore();
  useEffect(() => {
    getMe();
  }, []);
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={user ? <CreateForm /> : <Login />} />
        <Route path="/signup" element={user ? <Home /> : <Signup/>} />
        <Route path="/login" element={user ? <Home /> : <Login/>} />
        <Route path="/preview/:formId" element={user ? <Preview /> : <Home/>} />
        <Route path="/test/:formId" element={user ? <SubmitTest /> : <Home/>} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer/>
      <Toaster/>
    </Router>
  );
};

export default App;
