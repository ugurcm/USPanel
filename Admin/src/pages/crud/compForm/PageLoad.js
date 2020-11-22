import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../../libraries/doAjax';

export default function PageLoad (props){}
export const pageLoad = ({ appContext, table, id, state, setState, params}) => {
  
  
  const data = doAjax(
    appContext.api_url + 'Admin/CrudForm/getFormData',
    'GET',
    {table, id}
  );
  data.then((res)=>{
    //console.log(res);
    const gelen = JSON.parse(res);
    //console.log(gelen);
    let parent = 0;
    if(params['parent']){
      parent = params['parent']
    }
    //console.log("page load parent: " + parent);
    if(gelen.altKategoriColumn){
      parent = gelen.formData[gelen.altKategoriColumn['slug']];
      //console.log(parent);
    }
    setState((state) => ({...state, 
      pageTitle: gelen.panel.title + " Ekle / Düzenle",
      panel: gelen.panel,
      columns: gelen.columns,
      values: gelen.formData,
      parent: parent
    }))
  })

}