import { func } from 'prop-types';
import React from 'react';
import Swal from 'sweetalert2';
import doAjax from '../../../libraries/doAjax';
import arrayMove from 'array-move';
import {isEqual} from 'lodash';


export default function CrudLib({isim}){}
export const pageInitWork = ({appContext, state, setState, queryStringList}) => {
  
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
        
    //console.log("page init güncelledi");
    //let formLink = "/crudForm/" + gelen.panel.slug + (state.id!=undefined?'?parent='+state.id:'');


    let formLink = "/crudForm/" + gelen.panel.slug;

    let qsIcon = '';
    if(state.id!=undefined){
      qsIcon = '?';
      formLink += qsIcon + 'parent=' + state.id;
    }
    //console.log(formLink);
    //console.log(qsIcon);
    if(queryStringList.parentTable){
      
      if(qsIcon == '?'){
        qsIcon ='&';
      }else{
        qsIcon = '?';
      }
      formLink += `${qsIcon}parentTable=${queryStringList.parentTable}&parentName=${queryStringList.parentName}&parentValue=${queryStringList.parentValue}`;
    }
    //console.log(formLink);
    
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
      queryStringList:queryStringList
    }))
    //console.log(queryStringList);
    

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
      queryStringList: state.queryStringList      
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



export const onSortEnd = ({e, state, setState, appContext}) => {
  const newArr = arrayMove(state.crudList, e.oldIndex, e.newIndex);
  if(!isEqual(state.crudList, newArr)){
    setState((state) => ({...state, crudList: newArr }))

    var ids = [];
    newArr.map((val,key)=>{
      ids.push(val.id) 
    });

    

    if(ids.length){
      const data = doAjax(
        appContext.api_url + 'Admin/CrudList/saveOrder','POST', 
        {ids:ids, table: state.panel.slug, orderColumn: state.crudData.order_column}
      )
      data.then((res)=>{
        console.log(res);
      })
    }
    //console.log(ids);

  }
}





export const ozellikYukari = ({e,state,appContext,history}) => {
  e.preventDefault();

  //console.log(state);
  const data = doAjax(
    appContext.api_url + 'Admin/CrudList/ozellikYukariGit',
    'GET',{params: state.queryStringList}
  );
  data.then((res)=>{
    //console.log(res);
    const gelen = JSON.parse(res);
    //console.log(gelen);
    let gidecekLink = `/crudList/${gelen.method}/${(gelen.ustKategoriId>0?gelen.ustKategoriId:``)}`;
    //console.log(gidecekLink);
    history.push(gidecekLink);
  })

}





