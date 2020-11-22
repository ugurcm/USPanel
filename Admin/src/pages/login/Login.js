import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';

import './Login.scss'
import Swal from 'sweetalert2';
import Logo from '../../assets/img/logo.png';
import { func } from 'prop-types';

const Login = props => {
  const appContext = useContext(AppContext);
  //console.log(appContext);
  const [values, setValues] = useState({user_name:"", password:""});
  //const [loading, setLoading] = useState(0);
  
  const [formLock, setFormLock] = useState(0);

  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  }
  const formSubmit = e => {
    e.preventDefault();

    if(formLock == 1){return false;}
    setFormLock( x => x = 1);
    //setLoading(x => (1));
    
    //return false;
    //console.log("form gönderildi")
    setTimeout(function(){

      
      $.ajax({
        type:'POST',
        url: appContext.api_url + 'Admin/ApiUser/formLogin',
        data: {formData: values},
        //dataType: 'json',
        error: function(res){
          console.log("UST ERROR")
          console.log(res);
        }
      }).done(function(res){
        //console.log(res);
        //setFormLock( x => x = 0);
        //setLoading(x=> 0);
        
        try {
          let gelen = JSON.parse(res);
          //let gelen = res;
          //console.log(gelen.aciklama);
          if(gelen.code == 1){  // sifre hatali
            Swal.fire({
              icon: 'error',
              title: 'Hata',
              text: gelen.sonuc,

            })
            setFormLock( x => x = 0);
            //setLoading(x=> 0);
          }
          if(gelen.code == 2){  //basarili
            Swal.fire({
              icon: 'success',
              title: 'Giriş Başarılı',
              text: 'Yönlendiriliyorsunuz...',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer:1500
            })
            //console.log(gelen)
            appContext.setUserToken(gelen.userToken);
            appContext.setUserData(gelen.userData);
            localStorage.setItem('userToken', gelen.userToken);
            localStorage.setItem('userData', JSON.stringify(gelen.userData));

            setTimeout(() => {
              props.history.push('/');
            }, 1500);


          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: error,
          })
        }
      })

    },1000);

  }
  //console.log("login sayfası");

  return (
    <div className="login-cont">

      <div className="form">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>
        <div className="head">
          <h4>Hoşgeldiniz.</h4>
          <h6>Devam etmek için şifrenizi giriniz.</h6>
        </div>
        <div className="ctrl">
          <form action="" onSubmit={e => formSubmit(e)}>
            <div className="irow">
              <div className="ival">
                <input type="text" name="user_name"
                placeholder="Kullanıcı Adı"
                className=""
                value={values.user_name}
                onChange={e=> onChange(e)}/>
              </div>
            </div>
            <div className="irow">
              <div className="ival">
                <input type="password" name="password"
                  placeholder="Şifre"
                  className=""
                  value={values.password}
                  onChange={e=> onChange(e)}
                />
              </div>
            </div>
            <div className="irow">
              <button type="submit" className="submit-ok">
                {(formLock==0?'Giriş Yap':
                  <div className="btn-loader">
                    <div className="icon"></div>
                    <div className="desc">Lütfen Bekleyiniz...</div>
                  </div>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}

/* 
  {loading == 1 ? <div className="loading-cont">
              <div className="icon"></div>
              <div className="desc">Giriş Yapılıyor</div>
            </div> : null}
*/

export default Login;
