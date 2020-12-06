import { func } from 'prop-types';
import React from 'react';
import Swal from 'sweetalert2';
import doAjax from '../../../libraries/doAjax';


export default function CrudLib({isim}){}
export const pageInitWork = ({appContext, state, setState}) => {
  
  setState((state)=>({...state, initWorkLoading:false}))
  //console.log("page init work");
  const data = doAjax(
    appContext.api_url + "Admin/CrudList/pageInit",
    "GET",{table: state.slug,id:state.id}
  );
  data.then((res) => {      
    //console.log(res);    
    const gelen = JSON.parse(res);
    //console.log(gelen);
        

    let formLink = "/crudForm/" + gelen.panel.slug + (state.id!=undefined?'?parent='+state.id:'');
    
    setState((state) => ({
      ...state, 
      initWorkLoading:true,
      title: gelen.baslik,
      panel: gelen.panel,
      formLink: formLink,
      crudData: {...state.crudData, 
        table: gelen.panel.slug, 
        order_column:gelen.panel.order_column,
        order_type: gelen.panel.order_type
      },
    }))
    

  });
}

export const refreshTableWork = ({appContext, state, setState}) => {
  //console.log(crudData)
  //console.log(state);
  //console.log("refresh table work");
  const data = doAjax(
    appContext.api_url + "Admin/CrudList/getListData",
    "GET",
    {
      id: (state.id?state.id:0),
      panelId: state.panel.id,
      table: state.panel.slug,
      sayfaNo: state.crudData.sayfaNo,
      kacar: state.crudData.kacar,
      sayfaSayisi: state.crudData.sayfaSayisi,
      toplam: state.crudData.toplam,
      orderby: state.crudData.order_column,
      orderType: state.crudData.order_type,        
    }
  );
  data.then((res) => {
    //console.log(res);
    const gelen = JSON.parse(res);
    //console.log(gelen);
    setState((state) => ({
      ...state,
      crudColumns: gelen.crudColumns,
      crudList: gelen.crudList,
      crudData: {...state.crudData, ...gelen.crudData}
    }))
    /*setCrudColumns(x => (x = gelen.crudColumns));
    setCrudList(x => (x = gelen.crudList));
    setCrudData(x => ({...crudData, ...gelen.crudData}))*/
  });
};

export const deleteRow = ({e, itemId, eventFunction,state,setState,appContext}) => {
  e.preventDefault();
  //console.log("delete burada lib")
  //console.log(itemId);
  //console.log(state.crudData);
  
  let c = confirm('Seçilen satır silinecek. Emin misiniz?');
  if(!c) return false;
  const data = doAjax(
    appContext.api_url + 'Admin/CrudList/deleteRow',
    'POST',
    {
      itemId: itemId,
      table: state.crudData.table
    }
  );
  data.then((res)=>{
    //console.log(res);  
    refreshTableWork({table:state.crudData.table, appContext,state,setState});
    //setState(state => ({...state, crudData: {...state.crudData, sayfaNo: 1}})); 
    var gelen = JSON.parse(res);
    if(gelen.sonuc == 'ok'){
      Swal.fire({
        icon: 'success',
        title: 'İşlem Başarılı',
        text: gelen.aciklama,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer:1000
      })
    }
  })


}

export const yukariGit = ({e,state,appContext,history}) => {
  e.preventDefault();

  //console.log(state);
  const data = doAjax(
    appContext.api_url + 'Admin/CrudList/yukariGit',
    'GET',{id: state.id, table: state.panel.slug}
  );
  data.then((res)=>{
    //console.log(res);
    const gelen = JSON.parse(res);
    //console.log(gelen);
    
    history.push('/crudList/' + state.panel.slug + '/' + gelen.gidilecekId);
    
    /*if(gelen.secilenPage){
      let yonlendirilecekUrl = '/CrudList/' + slug + '';
      if(gelen.secilenPage[gelen.parent.slug] > 0){
        yonlendirilecekUrl += '?id=' + gelen.secilenPage[gelen.parent.slug];
      }   
      history.push(yonlendirilecekUrl);
    }*/

  })
}







