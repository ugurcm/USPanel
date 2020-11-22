import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect,withRouter } from 'react-router-dom';
import AppContext from '../context/AppContext';

import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';


import Swal from 'sweetalert2';


const DashboardRoute = props => {
  //console.log(props);  
  const appContext = useContext(AppContext);

  useEffect(()=>{
    //console.log("dashboard route yüklendi");
    //console.log(props);
    
    
  },[])

  return(
    <div className="main">
      <Sidebar {...props} />
      <div className="content">       
        <TopBar />       
        <div className="central">
          {props.children}
        </div>  
      </div>  
    </div>
  )
}
export default withRouter(DashboardRoute);

