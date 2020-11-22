import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect, withRouter, useParams,useRouteMatch} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import doAjax from '../libraries/doAjax';
import menuTreeSelector from '../libraries/menuTreeSelector';
import tokenCheck from '../libraries/tokenCheck';

import AppContext from '../context/AppContext';
import SidebarLogo from '../assets/img/logo-w.png';

const SidebarListe = (props) => {
  const {listArr} = props;
  if (!listArr) {return false;}
  return (
    <div className="smenu">
      {(listArr?<ul>    
        {listArr.map((value, key) => {
          let link = '#';
          if(value.has_table == 1){
            link = '/crudList/' + value.slug;
          }
          if(value.component_name){
            link = '/' + value.component_name;
          }
          return (
            <CSSTransition in={true} key={value.id} timeout={500} >
              <li className={(( props.menuSecilenler[props.seviye] == key )? 'selected-enter-done' : '') + " listType" + value.list_type} data-key={key}>
                <Link to={link} onClick={(e) => props.clickMenuItem(e, link, key, props.seviye)} >
                  {(value.icon?<div className="icon"><i className={value.icon}></i></div>:'')}
                  <span>{value.title}</span>
                  {(value.children?<div className="arrow"><i className="fa fa-angle-down"></i></div>:null)}
                </Link>
                <SidebarListe listArr={value.children} menuSecilenler={props.menuSecilenler} clickMenuItem={props.clickMenuItem} seviye={props.seviye+1} />
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
  const [menuSecilenler, setMenuSecilenler] = useState([]);
  //const [suankiUrl, setSuankiUrl] = useState('');
  useEffect(() => {
    const data = doAjax(
      appContext.api_url + 'Admin/ApiAdmin/loadSidebars','GET',{}
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      appContext.setSidebarData(gelen.tree);
      //console.log(gelen.tree)

      if(gelen.tree){
        let suankiUrl = props.history.location.pathname.substring(props.history.location.pathname.lastIndexOf('/') + 1);
        menuTreeSelector({tree:gelen.tree, suankiUrl:suankiUrl, suankiUrlMenuSec: suankiUrlMenuSec});
        /*console.log(suankiUrl);
        if(gelen.tree){
          gelen.tree.map((item,key)=>{
            //console.log(item);
            if(item.slug == suankiUrl){
              setMenuSecilenler([key])
            }
          })
        }*/
      }
    })
    //console.log(props);
    //console.log(props.history.location.pathname.substring(props.history.location.pathname.lastIndexOf('/') + 1));
    //console.log(props.history.location.pathname);

    

  }, [])  
  useEffect(()=>{
    //console.log(menuSecilenler);
  },[menuSecilenler])
  const clickMenuItem = (e, link, key, seviye) => {
    e.preventDefault();
    if(link != '#'){
      props.history.push(link)
    } 
    //console.log(link);
    //console.log("menu seçildi " + seviye + " " + key);
    let newArr = [...menuSecilenler];
    newArr[seviye] = key;
    newArr.length = seviye + 1;
    setMenuSecilenler(x => newArr);
  }
  const suankiUrlMenuSec = (secilenMenuArr) => {
    setMenuSecilenler(secilenMenuArr)
  }

  return(
    <div className="sidebar">
      <div className="logo-cont">
        <Link to="/"><img src={SidebarLogo} alt="Fümesoft Yönetim Paneli" /></Link>
      </div>
      <div className="sb-list">  
        <SidebarListe listArr={appContext.sidebarData} menuSecilenler={menuSecilenler} clickMenuItem={clickMenuItem} seviye={0} />
      </div>
      <div className="btn-add-panel">
        <Link to="/panel">Panel Ekle</Link>
        <Link to="/language">Dil Ekle</Link>
      </div>
    </div>
  )
}
export default withRouter(Sidebar);
