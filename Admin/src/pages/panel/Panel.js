import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from '../crud/TableRows';
import TableControls from '../crud/TableControls'
import PanelTableRows from './PanelTableRows'


export default function Panel (props) {
  const appContext = useContext(AppContext);
  const [pageId, setPageId] = useState('');
  const [pageReady, setPageReady] = useState(0);
  const [pageData, setPageData] = useState({
    panelTable: "Admin Panel Modülleri",
    table: "panel_table",
    sayfaNo: 1, 
    kacar: 30,
    where: [],
    crudData: {
      crudColumns: [],
      crudColumnSlugs: [],
      crudList: {
        listData: [],
        nereden: 0,
        sayfaSayisi: 0,
        toplam: 0
      }
    }
  });
  const refreshTable = () => {
    if(pageReady == 1){
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getCrudData',
        'GET',
        {
          pageId: pageId, 
          table: pageData.table,
          sayfaNo: pageData.sayfaNo,
          kacar: pageData.kacar
        }
      );
      data.then((res)=>{
        //console.log(res);      
        const gelen = JSON.parse(res);
        setPageData({ ...pageData, crudData: gelen.crudData});
      })
    }
  }
  const yenile = () => {
    refreshTable();
  }
  const yukari = () => {
    const data = doAjax(
      appContext.api_url + 'ApiPanel/findPageParent',
      'GET',{pageId: pageId, table: pageData.table }
    );
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      //console.log(gelen);
      if(gelen.secilenPage){
        props.history.push('Panel?id=' + gelen.secilenPage.parent);
      }
      
      //setPageData({ ...pageData, crudData: gelen.crudData});
    })
  }
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    //console.log(parsed);
    //console.log("panel yüklendi");
    
    if(!parsed.id){
      setPageReady(1);
      setPageId(0);
      //console.log("id yok");
      
      
    }
    if(parsed.id){
      //console.log("id var");
      //console.log(parsed.id);
      setPageReady(1);
      setPageId(parsed.id);
    }
  })
  useEffect(()=>{
    refreshTable();
  },[pageData.sayfaNo, pageData.kacar, pageId]);

  const crudGoNextPage = () => {
    if(pageData.sayfaNo < pageData.crudData.crudList.sayfaSayisi){
      setPageData({ ...pageData, sayfaNo: pageData.sayfaNo + 1 });
    }
  }
  const crudGoPrevPage = () => {
    if(pageData.sayfaNo > 1){
      setPageData({ ...pageData, sayfaNo: pageData.sayfaNo - 1 });
    }
  }
  const crudGoLastPage = () => {
    setPageData({ ...pageData, sayfaNo: pageData.crudData.crudList.sayfaSayisi });
  }
  const crudGoFirstPage = () => {
    setPageData({ ...pageData, sayfaNo: 1 });
  }
  const crudSayfaNoChange = (e) => {
    setPageData({ ...pageData, sayfaNo: parseInt(e.target.value) });
  }
  const kacarChange = (e) => {
    setPageData({ ...pageData, kacar: parseInt(e.target.value) , sayfaNo: 1 });
  }
  const CrudColumns = (props) => {
    const items = props.pageData.crudData.crudColumns.map((value, key)=>
      <th key={key}>{value.title}</th>
    );
    return(
      <tr>{items}</tr>
    )
  }
  const deleteRow = (e, itemId) => {
    e.preventDefault();
    let c = confirm('Tablo ve içindeki tüm veriler silinecek. Emin misiniz?');
    if(!c) return false;
    const data = doAjax(
      appContext.api_url + 'ApiPanel/deleteRow',
      'POST',
      {
        itemId: itemId
      }
    );
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      if(gelen.sonuc == 'ok'){
        Swal.fire({
          icon: 'success',
          title: 'İşlem Başarılı',
          text: gelen.aciklama,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer:1000
        })
        refreshTable()
      }
    })
  }

 

  
  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{pageData.panelTable}</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={'PanelForm'} className="addBtn">Ekle</Link>
            <a href="#" onClick={yukari} className="refreshBtn">Yenile</a>
          </div>
          <div className="control-right">
            <TableControls pageData={pageData} 
              kacarChange={kacarChange} 
              crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage}
              crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} 
              crudSayfaNoChange={crudSayfaNoChange}
              />
          </div>
        </div>
        <div className="list-table">          
          <table>
            <thead>
              <CrudColumns pageData={pageData} />
            </thead>
            <tbody>
              <PanelTableRows pageData={pageData} deleteRow={deleteRow} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={'PanelForm'} className="addBtn">Ekle</Link>
          </div>
          <div className="control-right">
            <TableControls pageData={pageData} 
              kacarChange={kacarChange} 
              crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage}
              crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} 
              crudSayfaNoChange={crudSayfaNoChange}
              />
          </div>
        </div>

      </div>
    </div>
  )
}
