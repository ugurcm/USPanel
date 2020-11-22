import React, {useState, useContext, useEffect} from 'react';
import { useHistory, Link } from "react-router-dom";

import AppContext from '../context/AppContext';
import Swal from 'sweetalert2';

const TopBar = (props) => {
  const appContext = useContext(AppContext);
  let history = useHistory();
  
  const tarih = new Date();
  const hour = tarih.getHours();
  const minute = tarih.getMinutes();
  
  //console.log(appContext);
  
  const btnLogout = (e) =>{
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Sistemden Çıkış Yapılmıştır.',
      text: 'Yönlendiriliyorsunuz...',
      showConfirmButton: false,
      allowOutsideClick: false,
      timer:1500
    })
    setTimeout(() => {
      appContext.setUserToken("");
      localStorage.setItem('userToken', "");
      history.push("/login");
    }, 1500);
  }

  return (
    <div className="head-bar">
      
      <div className="right-side">
        <a href={appContext.api_url} target="_blank" className="tooltip" data-tip="Siteye Git">
          <i className="fas fa-laptop"></i>
          <span>Siteye Git</span>
        </a>
        <a href="#" className="tooltip" data-tip="FümeSoft Destek">
          <i className="fas fa-question-circle"></i>
          <span>Destek</span>
        </a>
        
        <a href="#" className="tooltip" data-tip="Yardım Merkezi">
          <i className="fas fa-book"></i>
          <span>Yardım</span>
        </a>
        <a href="#" onClick={btnLogout} className="tooltip" data-tip="Çıkış">
          <i className="fas fa-power-off"></i>
          <span>Çıkış</span>
        </a>
        
      </div>
    </div>
  )
}
export default TopBar;

/* 
<div className="left-side">
              
        <div className="buttons">
          <Link to="/home" className="tooltip" data-tip="Anasayfa">
            <i className="fas fa-home"></i>
            <span>Anasayfa</span>
          </Link>
          <Link to="/contact" className="tooltip" data-tip="Gelen Mesajlar">
            <i className="far fa-envelope"></i>
            <span>Gelen Mesajlar</span>
          </Link>
          <Link to="/contact" className="tooltip" data-tip="Gelen Mesajlar">
            <i className="fas fa-calculator"></i>
            <span>CRM Girişi</span>
          </Link>
        </div>
      </div>
*/