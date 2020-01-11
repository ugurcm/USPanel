import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';

import './Login.scss'
import Swal from 'sweetalert2';

const Login = props => {
  const appContext = useContext(AppContext);
  //console.log(appContext);
  const [values, setValues] = useState({userName:"", password:""});
  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  }
  const formSubmit = e => {
    e.preventDefault();
    console.log("form gönderildi");
    //console.log(appContext.api_url)
    $.ajax({
      type:'POST',
      url: appContext.api_url + 'ApiUser/formLogin',
      data: {formData: values},
      //dataType: 'json'
      error: function(res){
        console.log(res);
        
      }
    }).done(function(res){
      //console.log(res);
      try {
        let gelen = JSON.parse(res);
        //console.log(gelen);
        if(gelen.code == 1){  // sifre hatali
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: gelen.sonuc,
          })
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
  }
  //console.log("login sayfası");
  
  return (
    <div className="login-cont">
      
      <div className="form">
        <div className="logo">
          <img src={appContext.base_url + '/src/assets/img/logo.png'} alt="" />
        </div>
        <div className="head">
          <h4>Hoşgeldiniz.</h4>
          <h6>Devam etmek için şifrenizi giriniz.</h6>
        </div>
        <div className="ctrl">
          <form action="" onSubmit={e => formSubmit(e)}>
            <div className="irow">
              <div className="ival">
                <input type="text" name="userName"
                placeholder="Kullanıcı Adı"
                className=""
                value={values.userName}
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
              <button type="submit" className="submit-ok">Giriş Yap</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login;
