import React, {Component, useContext, useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';

import Home from '../pages/home/Home';
import Login from '../pages/login/Login';
import AppContext from '../context/AppContext'


const App = props => {

  let initUserData = {userName: "ugur cemil"};
  if(localStorage.getItem('userData')){
    initUserData = JSON.parse(localStorage.getItem('userData'));
  }
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || 0);
  const [userData, setUserData] = useState(initUserData);
  const [globalData, setGlobalData] = useState({});
  const startingValues = {
    base_url: process.env.base_url,
    api_url: process.env.api_url,
    userToken: userToken,
    userData: userData,
    setUserToken: setUserToken,
    setUserData: setUserData,
    globalData: globalData,
    setGlobalData: setGlobalData,
  }
  
  return(
    <AppContext.Provider value={ startingValues } >
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route path="/" exact render={()=>
              (userToken == 0 ? (<Redirect to="/login" />):(<Home />))
            } />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App;
