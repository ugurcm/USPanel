import React, {useState, useContext, useEffect} from 'react';


export default function FormButton (props) {
  let myReturn;
  if(props.formLock == 0){
    myReturn = 'Kaydet';
  }else{
    myReturn = <div className="btn-loader">
      <div className="icon"></div>
      <div className="desc">Lütfen Bekleyiniz...</div>
    </div>
  }
  return myReturn
}