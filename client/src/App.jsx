import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import UseScrollToTop from "./hooks/useScrollToTop"

import { useSelector } from "react-redux";

import Home from './pages/Home'
import Blog from './pages/Blog'
import Dashboard from './pages/Dashboard'
import NewArticle from './pages/dashboard/NewArticle'
import EditProfile from './pages/dashboard/EditProfile'


function App() {

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;


  return (

    <Router>
      <UseScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/blog" element={<Blog />}></Route>
        <Route exact path='/dashboard' element={userInfo ? <Dashboard /> : <Navigate to="/" />}>
          <Route exact path='new-article' element={<NewArticle />} />
          <Route exact path='edit-profile' element={<EditProfile />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App