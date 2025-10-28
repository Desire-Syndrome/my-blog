import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import UseScrollToTop from "./hooks/useScrollToTop"

import { useSelector } from "react-redux";

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;


  return (

    <Router>
      <UseScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path='/dashboard' element={userInfo ? <Dashboard /> : <Navigate to="/" />}>
          
        </Route>
      </Routes>
    </Router>

  );
}

export default App