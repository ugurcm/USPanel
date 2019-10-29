import React, {useState, useContext, useEffect} from 'react';
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
          }
        }    
      }
    })
  });


  return(
    <div className="main">
      <Sidebar />
      <div className="content">
       
        <TopBar />
       
        <div className="central">
          orta alan <br />
          <i className="fas fa-cog"></i>
        </div>  
      </div>
      
    </div>
  )
}
export default Home;

