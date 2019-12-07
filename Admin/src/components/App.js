import React, {Component, useContext, useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';


import Home from '../pages/home/Home';
import CrudList from '../pages/crud/CrudList';
import Panel from '../pages/panel/Panel';
import PanelForm from '../pages/panel/PanelForm';
import Login from '../pages/login/Login';
import DashboardRoute from '../layouts/DashboardRoute';
import AppContext from '../context/AppContext'

//console.log(process.env.BASE_URL)

const App = props => {

  let initUserData = {userName: "ugur cemil"};
  if(localStorage.getItem('userData')){
    initUserData = JSON.parse(localStorage.getItem('userData'));
  }
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || 0);
  const [userData, setUserData] = useState(initUserData);
  const [globalData, setGlobalData] = useState({});
  const globalVars = {
    base_url: process.env.BASE_URL,
    api_url: process.env.API_URL,
    userToken: userToken,
    userData: userData,
    setUserToken: setUserToken,
    setUserData: setUserData,
    globalData: globalData,
    setGlobalData: setGlobalData,
  }
  return(
    <AppContext.Provider value={ globalVars } >
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route path="/" exact render={()=>
              (userToken == 0 ? (<Redirect to="/login" />):(<Redirect to="/home" />))
            } />
            <Route path="/login" component={Login} />            
          </Switch>
          {userToken?
            <DashboardRoute>          
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/panel" component={Panel} />
                <Route path="/panelForm" component={PanelForm} />
                <Route path="/crudList" component={CrudList} />
              </Switch>
            </DashboardRoute>:null
          }
          
        </React.Fragment>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App;

/*<Route path="/home" component={Home} />
<Route path="/panel" component={Panel} /><DashboardRoute path="/home" component={Home} />*/









