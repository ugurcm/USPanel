import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../../libraries/doAjax';

export default function PageLoad (props){}
export const pageLoad = ({appContext, parsed, setFormType, setFormId, 
  values,setValues,setPanel,setPageTitle,setComponentList,
  setColumnTypeList,setPageReady }) => {
  
  if(parsed.id){
    setFormType('update');  // eger sadece id var ise form tipini guncelleme olarak degistirelim.
  }
  
  if(parsed.id || parsed.panelId){
    console.log("get form data")
    const data = doAjax(
      appContext.api_url + 'Admin/PanelComponent/getFormData',
      'GET',
      {id: parsed.id, panel_id: parsed.panelId}
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      //console.log(gelen);
      if(gelen.panel){
        setPanel(gelen.panel);
        setPageTitle(gelen.panel.title + ' Tablosuna Sütun Ekle / Düzenle');
      }
      if(gelen.formData){
        setValues({...values, ...gelen['formData']});
      }
      if(gelen.componentList){    // component listesi
        setComponentList(gelen.componentList);
      }
      if(gelen.columnTypeList){   // tablo veri tipi listesi
        setColumnTypeList(gelen.columnTypeList);
      }
      setPageReady(1);
    })
  }
  
}