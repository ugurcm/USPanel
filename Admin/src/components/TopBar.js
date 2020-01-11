import React, {useState, useContext, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import AppContext from '../context/AppContext';
import Swal from 'sweetalert2';

const TopBar = (props) => {
  const appContext = useContext(AppContext);
  let history = useHistory();

  
  const btnLogout = () =>{
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
      <div className="left-side">
        1231231231
      </div>
      <div className="right-side">
        <button onClick={btnLogout}>Çıkış Yap</button>
      </div>
    </div>
  )
}
export default TopBar;