import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';

import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from '../crud/TableRows';
import TableControls from '../crud/TableControls'
import queryString from 'query-string';


export default function PanelComponent (props) {
  const appContext = useContext(AppContext);
  const [panelId, setPanelId] = useState(0);
  const [pageName, setPageName] = useState('Panel Bileşenleri');
  const [pageLoadComplete, setPageLoadComplete] = useState(0);
  const [pageData, setPageData] = useState({
    table: "panel_table_column",
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
    const data = doAjax(
      appContext.api_url + 'ApiPanel/getPanelTableColumn',
      'GET',
      {
        table: pageData.table,
        sayfaNo: pageData.sayfaNo,
        kacar: pageData.kacar,
        where: pageData.where
      }
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      setPageData({ ...pageData, crudData: gelen.crudData});      
    })    
  }
  const yenile = () => {
    refreshTable();
  }
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if(parsed.id){
      setPanelId(parsed.id);
      const data = doAjax(
        appContext.api_url + 'ApiPanel/panelComponentInit',
        'POST',
        {
          pageId: parsed.id
        }
      );
      data.then((res)=>{    
        const gelen = JSON.parse(res);
        setPageName(pageName + ' ( ' +gelen.panelTable.title + ' )')
        let newWhereArr = pageData.where;
        newWhereArr.push({name:'panel_table_id', 'value': gelen.panelTable.id});
        setPageData({...pageData,  where: newWhereArr})
        setPageLoadComplete(1);
      })
    }
  },[]);

  useEffect(()=>{
    if(pageLoadComplete == 1){
      refreshTable();
    }
  },[pageData.sayfaNo, pageData.kacar, pageLoadComplete]);

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
    let c = confirm('Bu kolona ait tablodaki data silinecek. Emin misiniz?');
    if(!c) return false;
    const data = doAjax(
      appContext.api_url + 'ApiPanel/deleteRowTableColumn',
      'POST',
      {
        itemId: itemId
      }
    );
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      //console.log(gelen);
      
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

  const tableRowButtons = [
    {
      name: 'Düzenle',
      type: 'Link',
      link: 'PanelComponentForm',
      icon: 'far fa-edit'
    },
    {
      name: 'Sil',
      type: 'ClickEvent',
      link: '',
      icon: 'fa fa-times',
      eventFunction: deleteRow
    }
  ]

  
  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{pageName}</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={'PanelComponentForm?panelId=' + panelId} className="addBtn">Ekle</Link>
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
              <TableRows pageData={pageData} deleteRow={deleteRow} tableRowButtons={tableRowButtons} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={'PanelComponentForm?panelId=' + panelId} className="addBtn">Ekle</Link>
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
