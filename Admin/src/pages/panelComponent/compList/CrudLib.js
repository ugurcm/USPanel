import { func } from 'prop-types';
import React from 'react';
import Swal from 'sweetalert2';
import doAjax from '../../../libraries/doAjax';


export default function CrudLib({isim}){}
export const pageInitWork = ({pageId, appContext, pageName,setPageName, setPageId,setFormLink}) => {
  const data = doAjax(
    appContext.api_url + "Admin/PanelComponent/pageInit",
    "POST",{pageId: pageId,}
  );
  data.then((res) => {          
    const gelen = JSON.parse(res);
    setPageName(pageName + " ( " + gelen.panel.title + " )");
    setPageId((x) => (x = pageId)); 
    setFormLink("panelComponentForm?panelId=" + pageId);
  });
}
export const refreshTableWork = ({appContext,pageId,crudData,setCrudColumns,setCrudList, setCrudData}) => {
  const data = doAjax(
    appContext.api_url + "Admin/PanelComponent/getListData",
    "GET",
    {
      pageId: pageId,
      table: crudData.table,
      sayfaNo: crudData.sayfaNo,
      kacar: crudData.kacar,
      sayfaSayisi: crudData.sayfaSayisi,
      toplam: crudData.toplam,
      orderby: "t.count",
      orderType: "asc",        
    }
  );
  data.then((res) => {
    const gelen = JSON.parse(res);
    //console.log(gelen);
    setCrudColumns(x => (x = gelen.crudColumns));
    setCrudList(x => (x = gelen.crudList));
    setCrudData(x => ({...crudData, ...gelen.crudData}))
  });
};
export const yukariWork = ({e,appContext,pageId,setFormLink,history }) => {
  e.preventDefault();
  //console.log(pageId);
  //console.log(pageData);
  const data = doAjax(
    appContext.api_url + 'Admin/Panel/findPageParent',
    'GET',{pageId: pageId, table: 'panel' }
  );
  
  data.then((res)=>{
    //console.log(res);      
    const gelen = JSON.parse(res);
    //console.log(gelen);
    if(gelen.secilenPage){
      let yonlendirilecekUrl = 'panel';
      let panelFormLinki = 'PanelForm';
      //console.log(gelen)
      if(gelen.secilenPage.parent > 0){
        yonlendirilecekUrl += '?id=' + gelen.secilenPage.parent;
        panelFormLinki += 'PanelForm?parent=' + gelen.secilenPage.parent;
      }
      setFormLink(panelFormLinki);
      history.push(yonlendirilecekUrl);
    }
  })
}

export const deleteRowWork = ({e, itemId,appContext,pageId,crudData,setCrudColumns,setCrudList, setCrudData}) => {
  e.preventDefault();
  
  let c = confirm("Tablo ve içindeki tüm veriler silinecek. Emin misiniz?");
  if (!c) return false;
  const data = doAjax(appContext.api_url + "Admin/PanelComponent/deleteRow", "POST", {
    itemId: itemId,
  });
  data.then((res) => {
    console.log(res);
    const gelen = JSON.parse(res);
    if (gelen.sonuc == "ok") {
      Swal.fire({
        icon: "success",
        title: "İşlem Başarılı",
        text: gelen.aciklama,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1000,
      });
      refreshTableWork({appContext,pageId,crudData,setCrudColumns,setCrudList, setCrudData});
    }
  });
};



