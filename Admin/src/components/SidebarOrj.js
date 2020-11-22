import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect, withRouter, useParams,useRouteMatch} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import doAjax from '../libraries/doAjax';
import tokenCheck from '../libraries/tokenCheck';

import AppContext from '../context/AppContext';
import SidebarLogo from '../assets/img/logo-w.png';

function isInArray(array, search){
  if(array){
    return array.indexOf(search) >= 0;
  }
}


const SidebarListe = (props) => {
  if (!props.listArr) {
    return false;
  }
  //console.log(props);
  const linkOnClick = (e, value, order, link) => {
    e.preventDefault();
    console.log(props)
    if(link != '#'){
      props.history.push(link)
    }
    //console.log(props.activeTabArr)
    //order -> Seçilen alt menu seviyesi, 1, 2, 3, 4 alt alta devam
    //props.activeOrder -> Daha önce Seçilen alt menu seviyesi, 1, 2, 3, 4 alt alta devam
    //props.activeTabArr -> seviye arrayı örn: 1,1 - 2,1  2. menunun 1 idli elemanını belirtiyor. idye göre
    if(order <= props.activeOrder ){   // esit seviyede ise
      console.log("eşit")
      let newArr = [...props.activeTabArr];
      let aIndex = newArr.find(index => index == parseInt(value.id))
      if(newArr.indexOf(aIndex) != -1){   // Aynı satırın alt sayfaları seçilirse arrayı bir arttır
        newArr.length = newArr.indexOf(aIndex)+1;
        props.setActiveTabArr(newArr);
      }
      if(newArr.indexOf(aIndex) == -1){   // Başka bir satır seçilirse arrayı seçilen seviyeye kadar azalt
        newArr.length = order - 1;
        newArr.push(parseInt(value.id))
        props.setActiveTabArr(newArr);
      }
      props.setActiveOrder(order);
    }
    if(order > props.activeOrder ){   // alt seviye ise arrayı 0dan oluştur
      console.log("alt seviye");
      const newArr = [...props.activeTabArr];
      newArr.push(parseInt(value.id));
      props.setActiveTabArr(newArr);
      props.setActiveOrder(order); 
    }
  }
  return (
    <div className="smenu">
      {(props.listArr?<ul>    
        {props.listArr.map((value, key) => {
          
          let link = '#';
          //console.log(value)
          if(value.has_table == 1){
            link = '/crudList/' + value.slug;
          }
          if(value.component_name){
            link = '/' + value.component_name;
          }
           
          //console.log(props.activeTabArr);
          //console.log(parseInt(value.id));
          //console.log(props.activeOrder);
          
          return (
            <CSSTransition in={(isInArray(props.activeTabArr, parseInt(value.id)) )} key={value.id} timeout={500} classNames="selected" >
              <li className={((isInArray(props.activeTabArr, parseInt(value.id))   )? 'selected-enter-done' : '') + " listType" + value.list_type}>
                {
                  (value.list_type==2?
                    <a href={link} onClick={(e) => linkOnClick(e, value, props.order, link)} >
                      {(value.icon?<div className="icon"><i className={value.icon}></i></div>:'')}
                      <span>{value.title}</span>
                      {(value.children?<div className="arrow"><i className="fa fa-angle-down"></i></div>:null)}
                    </a>
                  :
                    <div className="menu-list-head">
                      {(value.icon?<div className="icon"><i className={value.icon}></i></div>:'')}
                      <span>{value.title}</span>
                      {(value.children?<div className="arrow"><i className="fa fa-angle-down"></i></div>:null)}
                    </div>
                  )
                }
                  
                <SidebarListe listArr={value.children} activeTabArr={props.activeTabArr} setActiveTabArr={props.setActiveTabArr} order={props.order + 1} activeOrder={props.activeOrder} setActiveOrder={props.setActiveOrder} history={props.history} />
              </li>
            </CSSTransition>
          )
        })}
      </ul>: '' )}
    </div>
  )
}
const Sidebar = props => {
  //console.log(props)
  const appContext = useContext(AppContext);
  const [activeTabArr, setActiveTabArr] = useState([2,4]);  //idlere göre seçim 2nin altındaki 4 nolu id
  const [activeOrder, setActiveOrder] = useState(1);  // seviye derinlik seçimi 1in altında 2,3 devam eder.

  useEffect(() => {}, [appContext.sidebarData])
  useEffect(() => {
    
    //console.log(location);
    //console.log(props.location.pathname)
    const data = doAjax(
      appContext.api_url + 'Admin/ApiAdmin/loadSidebars','GET',{
        url: props.location.pathname
      }
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      console.log(gelen);
      appContext.setSidebarData(gelen.tree);
      setActiveTabArr(gelen.menuSecilenIdler);
      setActiveOrder(gelen.menuDerinlik);
    })
    
    //console.log(appContext.sidebarData);
    

  }, [])  
  
  return(
    <div className="sidebar">
      <div className="logo-cont">
        <Link to="/"><img src={SidebarLogo} 
          alt="Fümesoft Yönetim Paneli" /></Link>
      </div>
      <div className="sb-list">  
        <SidebarListe listArr={appContext.sidebarData} activeTabArr={activeTabArr} setActiveTabArr={setActiveTabArr} order={1} activeOrder={activeOrder} setActiveOrder={setActiveOrder} history={props.history} />
      </div>
      <div className="btn-add-panel">
        <Link to="/panel">Panel Ekle</Link>
        <Link to="/language">Dil Ekle</Link>
      </div>
    </div>
  )
}
export default withRouter(Sidebar);
