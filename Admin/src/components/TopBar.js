import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../context/AppContext';

const TopBar = (props) => {
  const appContext = useContext(AppContext);
  const btnLogout = () =>{
    Swal.fire({
      type: 'success',
      title: 'Sistemden Çıkış Yapılmıştır.',
      text: 'Yönlendiriliyorsunuz...',
      showConfirmButton: false,
      allowOutsideClick: false,
      timer:1500
    })
    setTimeout(() => {
      appContext.setUserToken("");
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