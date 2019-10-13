import React, {useState, useContext, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';


import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
const Home = props => {
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
  useEffect(() => {
    // Update the document title using the browser API
    //document.title = `You clicked ${count} times`;
    //console.log("home controller");
    
    $.ajax({
      type:'POST',
      url: appContext.api_url + 'ApiUser/loadDashboard',
      data:{token: appContext.userToken},
      success: function(res){
        console.log(res);    
        if(res){
          let gelen = JSON.parse(res);
          console.log(gelen);
          
          /*if(gelen.sonuc == 'error'){
            Swal.fire({
              type: 'error',
              title: 'Hata Oluştu. ',
              text: gelen.description + ' Yönlendiriliyorsunuz...',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer:1500
            })
            setTimeout(() => {
              appContext.setUserToken("");
            }, 1500);
          }*/
        }    
      }
    })
  });


  return(
    <div className="main">
      <Sidebar />
      <div className="content">
        <div className="head-bar">
          <div className="left-side">
            1231231231
          </div>
          <div className="right-side">
            <button onClick={btnLogout}>Çıkış Yap</button>
          </div>
        </div>
      </div>
      
    </div>
  )
}
export default Home;

