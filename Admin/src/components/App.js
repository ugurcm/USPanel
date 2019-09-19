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
  const [userTokenId, setUserTokenId] = useState(localStorage.getItem('userTokenId') || 0);
  const [userData, setUserData] = useState(initUserData);
  const startingValues = {
    base_url: 'http://localhost:8080/',
    api_url: 'http://localhost:8100/KpApi/',
    userTokenId: userTokenId,
    userData: userData,
    setUserTokenId: setUserTokenId,
    setUserData: setUserData,
  }
  return(
    <AppContext.Provider value={ startingValues } >
      <BrowserRouter>
        <React.Fragment>
          <Switch>         
            <Route path="/" exact render={()=> 
              (userTokenId == 0 ? (<Redirect to="/login" />):(<Home />))
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
