import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import AppContext from '../context/AppContext';


function isInArray(array, search)
{
    return array.indexOf(search) >= 0;
}

const SidebarListe = (props) => {
  if (!props.listArr) {
    return false;
  }
  
  const linkOnClick = (id, order) => {
    //props.setActiveTab(id)
    //props.setActiveOrder(order)
    //console.log(order);
    if(order <= props.activeOrder ){   // esit seviyede ise
      props.setActiveTabArr([parseInt(id)]);
      props.setActiveOrder(order);
    }
    if(order > props.activeOrder ){   // alt seviye ise
      const newArr = [...props.activeTabArr];
      newArr.push(parseInt(id));

      props.setActiveTabArr(newArr);
      props.setActiveOrder(order);
    }
    
  }
  
  
  return (
    <div className="smenu">
      {(props.listArr?<ul>    
        {props.listArr.map((value, key) => {
          //console.log(value.id + " " + props.activeTabArr)
          //console.log((isInArray(props.activeTabArr, parseInt(value.id))))
          return (
            <CSSTransition in={(isInArray(props.activeTabArr, parseInt(value.id)))} key={value.id} timeout={500} classNames="selected" >
              <li className={(isInArray(props.activeTabArr, parseInt(value.id)) ? 'selected-enter-done' : '')}>
                <Link to="#" onClick={(e) => linkOnClick(value.id, props.order)}>
                  <span>{value.title} {props.order} {value.id}</span>
                </Link>
                <SidebarListe listArr={value.children} activeTabArr={props.activeTabArr} setActiveTabArr={props.setActiveTabArr} order={props.order + 1} activeOrder={props.activeOrder} setActiveOrder={props.setActiveOrder}  />

              </li>
            </CSSTransition>
          )
        })}
      </ul>: '' )}
    </div>
  )
}
const Sidebar = props => {
  const appContext = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(7);
  const [activeTabArr, setActiveTabArr] = useState([7]);
  const [activeOrder, setActiveOrder] = useState(1);
  const [inProp, setInProp] = useState(false);
  useEffect(() => {
  }, [appContext.sidebarData])

  useEffect(() => {
    //console.log(activeTab + " active tab degisti");
  }, [activeTab])
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  //console.log((isInArray(activeTabArr, 7)))
  return(
    <div className="sidebar">
      <div className="logo-cont">
        <Link to="/"><img src={'/src/assets/img/logo-w.png'} 
          alt="UğurSoft Yönetim Paneli" /></Link>
      </div>
      <div className="sb-list">  
        <SidebarListe listArr={appContext.sidebarData} activeTabArr={activeTabArr} setActiveTabArr={setActiveTabArr} order={1} activeOrder={activeOrder} setActiveOrder={setActiveOrder} />
      </div>

      <div className="btn-add-panel">
        <Link to="/Panel">Panel Ekle</Link>
        <Link to="/crudList">Liste ve Form</Link>
      </div>
    </div>
  )
}
export default Sidebar;

