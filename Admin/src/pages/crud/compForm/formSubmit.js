import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../../libraries/doAjax';
import Swal from 'sweetalert2';

export default function formSubmit ({appContext, e, state, props, id}){
  e.preventDefault();


  const data = doAjax(
    appContext.api_url + 'Admin/CrudForm/saveForm',
    'POST',
    { formData: state.values, 
      formType: state.formType,
      panelId: state.panel.id,
      id: id,
      stateComp: state.stateComp,
    }
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
        if(state.params.parentName){
          let redirectLink = `/crudList/${state.panel.slug}?parentTable=${state.params.parentTable}&parentName=${state.params.parentName}&parentValue=${state.params.parentValue}`;
          //console.log(redirectLink);
          props.history.push(redirectLink);
          return false;
        }
        props.history.push('/crudList/' + state.panel.slug + (state.parent>0?'/'+state.parent:''));
      }, 1500)    
    }else{}  
     

  })


}
