import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../../libraries/doAjax';
import Swal from 'sweetalert2';

export default function formSubmit ({appContext,e,values,formType,props}){
  e.preventDefault();
  
  const data = doAjax(
    appContext.api_url + 'Admin/PanelComponent/saveForm',
    'POST',
    {formData: values, formType:formType}
  );// formType: formType, formId: formId, panelId: panelId, tableName:tableName
  data.then((res)=>{
    //console.log(res);    
    const gelen = JSON.parse(res);
    if(gelen.sonuc == 'err'){
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: gelen.aciklama,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer:1500
      })
    }
    if(gelen.sonuc == 'ok'){
      Swal.fire({
        icon: 'success',
        title: 'İşlem Başarılı',
        text: gelen.aciklama,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer:1500
      })
      setTimeout(()=>{ 
        props.history.push('panelComponent?id=' + values.panel_id);
      }, 1500)      
    }else{}   
     

  })


}
