import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
const Home = props => {

  const appContext = useContext(AppContext);

  useEffect(() => {
    // Update the document title using the browser API
    //document.title = `You clicked ${count} times`;
    //console.log("home controller");
    //console.log(appContext);
    if(appContext.userToken != 0){
      $.ajax({
        type:'POST',
        url: appContext.api_url + 'ApiUser/loadDashboard',
        data:{token: appContext.userToken},
        success: function(res){
          //console.log(res);    
          if(res){
            let gelen = JSON.parse(res);
            //console.log(gelen);
            if(gelen.userData.sonuc == 'error'){
              //console.log(gelen);
              
              Swal.fire({
                type: 'error',
                title: 'Hata Oluştu. ',
                text: gelen.userData.description + ' Yönlendiriliyorsunuz...',
                showConfirmButton: false,
                allowOutsideClick: false,
                timer:1500
              })
              setTimeout(() => {
                appContext.setUserToken("");
                localStorage.setItem('userToken', "");
                props.history.push("/login");
              }, 1500);
            }
          }    
        },
        error: function(res){
          Swal.fire({
            type: 'error',
            title: 'Hata Oluştu. ',
            text: 'Api Sunucusu Çalışmıyor. Data alınamadı.',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer:1500
          })
        }
      })
    }else{
      Swal.fire({
        type: 'error',
        title: 'Hata Oluştu. ',
        text: 'Token Bulunamadı Yönlendiriliyorsunuz...',
        showConfirmButton: false,
        allowOutsideClick: false,
        timer:1500
      })
      setTimeout(() => {
        appContext.setUserToken("");
        localStorage.setItem('userToken', "");
        props.history.push("/login");
      }, 1500);
      
      
    }
  },[]);

  console.log("anasayfa yüklendi");
  
  return(
    <div className="page-home">
      anasayfa
    </div>
  )
}
export default Home;

