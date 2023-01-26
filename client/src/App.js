import React, { Component } from 'react'
//import {BrowserRouter, Route, Routes} from "react-router-dom"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home';
import Results from './components/Results'
import Leaderboard from './components/Leaderboard'


class App extends Component{
  render() {
    return(
      <div>
        <Router>
          <Routes>
              <Route exact path="/" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/results" element={<Results />}></Route>
              <Route path="/leaderboard" element={<Leaderboard />}></Route>
            </Routes>
        </Router>
          
        
      </div>
    )


  }
}

export default App