import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';

import tokenCheck from '../../libraries/tokenCheck';
import loadSidebars from '../../libraries/loadSidebars';

import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
const Home = props => {

  const appContext = useContext(AppContext);

  useEffect(() => {
    tokenCheck({appContext});
    loadSidebars({appContext});
    
  },[]);

  console.log("anasayfa yüklendi");
  
  return(
    <div className="page-home">
      anasayfa
    </div>
  )
}
export default Home;

