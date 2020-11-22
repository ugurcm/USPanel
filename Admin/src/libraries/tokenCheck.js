import React, {useState, useContext, useEffect} from 'react';

export default function tokenCheck (props) {
  const {appContext} = props;
  //console.log(appContext);
  //return false;
  
  //console.log("gönder")
  //console.log(appContext.userToken);
  if(appContext.userToken != 0){
    $.ajax({
      type:'POST',
      url: appContext.api_url + 'ApiUser/checkToken',
      data:{token: appContext.userToken},
      success: function(res){
        console.log(res);    
        if(res){
          let gelen = res;

          //let gelen = JSON.parse(res);
          //console.log(gelen);
          if(gelen.userData.sonuc == 'token_created'){
            appContext.setUserToken(gelen.userData.newUserToken);
            appContext.setUserData(gelen.userData.tokenData.tokenData);
            localStorage.setItem('userToken', gelen.userData.newUserToken);
            localStorage.setItem('userData', JSON.stringify(gelen.userData.tokenData.tokenData));
            //console.log(gelen.userData.newUserToken);
            //console.log(gelen.userData.tokenData.tokenData);
            
            
          }
          if(gelen.userData.sonuc == 'error'){
            //console.log(gelen);
            
            Swal.fire({
              icon: 'error',
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
        console.log(res);
        
        Swal.fire({
          icon: 'error',
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
      icon: 'error',
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


}

