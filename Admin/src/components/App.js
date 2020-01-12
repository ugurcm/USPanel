import React, {Component, useContext, useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';


import Home from '../pages/home/Home';
import CrudList from '../pages/crud/CrudList';
import Panel from '../pages/panel/Panel';
import PanelForm from '../pages/panel/PanelForm';
import PanelComponent from '../pages/panel/PanelComponent';
import PanelComponentForm from '../pages/panel/PanelComponentForm';
import Login from '../pages/login/Login';
import DashboardRoute from '../layouts/DashboardRoute';
import AppContext from '../context/AppContext'
import CrudForm from '../pages/crud/CrudForm';
//console.log(process.env.BASE_URL)
import Modal from '../components/form/Modal'

const App = props => {

  let initUserData = {userName: "ugur cemil"};
  if(localStorage.getItem('userData')){
    initUserData = JSON.parse(localStorage.getItem('userData'));
  }
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || 0);
  const [userData, setUserData] = useState(initUserData);
  const [globalData, setGlobalData] = useState({});
  const [modalData, setModalData] = useState({
    show: false,
    innerComp: 'ModalFileCont'
  });
  const [sidebarData, setSidebarData] = useState([]);

  const globalVars = {
    base_url: process.env.BASE_URL,
    api_url: process.env.API_URL,
    userToken: userToken,
    userData: userData,
    setUserToken: setUserToken,
    setUserData: setUserData,
    globalData: globalData,
    setGlobalData: setGlobalData,
    modalData: modalData,
    setModalData: setModalData,
    sidebarData: sidebarData,
    setSidebarData: setSidebarData,
  }
  useEffect(()=>{
    //console.log("app render");
    
  })
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
                <Route path="/panel(/:id)" component={Panel} />
                <Route path="/panelForm" component={PanelForm} />
                <Route path="/panelComponent" component={PanelComponent} />
                <Route path="/panelComponentForm" component={PanelComponentForm} />
                <Route path="/crudList" component={CrudList} />
                <Route path="/crudForm" component={CrudForm} />
              </Switch>
            </DashboardRoute>:null
          }
          
        </React.Fragment>
      </BrowserRouter>
      {modalData.show?<Modal modalData={modalData}></Modal>:null}
      
    </AppContext.Provider>
  )
}

export default App;

/*<Route path="/home" component={Home} />
<Route path="/panel" component={Panel} /><DashboardRoute path="/home" component={Home} />*/









