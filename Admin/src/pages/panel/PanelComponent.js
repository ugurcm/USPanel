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
  const [pageReady, setPageReady] = useState(0);
  /*const [pageData, setPageData] = useState({
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
  });*/
  const [pageData, setPageData] = useState({
    title: 'Panel Bileşenleri',
    slug: 'panel_table_column',
  })
  const [crudData, setCrudData] = useState({
    crudColumns: [],
    //crudColumnSlugs: [],
    sayfaNo: 1, 
    kacar: 15,
    nereden: 0,
    sayfaSayisi: 0,
    toplam: 0,
    where: []
  })
  const [crudList, setCrudList] = useState([])

  const refreshTable = () => {
    if(pageReady == 1 && crudData.crudColumns.length){
     
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getComponentList',
        'GET',
        {
          table: pageData.slug,
          sayfaNo: crudData.sayfaNo,
          kacar: crudData.kacar,
          crudColumns: (crudData.crudColumns),
          nereden: crudData.nereden,
          sayfaSayisi: crudData.sayfaSayisi,
          toplam: crudData.toplam,
          where: crudData.where,
          dede: 123123
        }
      );
      data.then((res)=>{
        const gelen = JSON.parse(res);
        //console.log(gelen.crudData);
        
        setCrudList(gelen.crudList)
        setCrudData({...crudData, ...gelen.crudData})      
      })   
    } 
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
        //console.log(gelen);
        
        setPageName(pageName + ' ( ' +gelen.panelTable.title + ' )')
        const newWhereArr = [...crudData.where];
        newWhereArr.push({name:'panel_table_id', 'value': gelen.panelTable.id});
        //setCrudData({...crudData,  where: newWhereArr})
        //console.log(newWhereArr);
        
        setPageReady(1);

        setCrudData(
          {...crudData, 
            crudColumns: gelen.crudData.crudColumns,
            where: newWhereArr
            //crudColumnSlugs:gelen.crudData.crudColumnSlugs 
          }
        );


      })
    }
  },[]);

  useEffect(()=>{
    refreshTable();
  },[crudData.sayfaNo, crudData.kacar, crudData.crudColumns, crudData.where]);

  const crudGoNextPage = () => {
    if(crudData.sayfaNo < crudData.sayfaSayisi){
      setCrudData({...crudData, sayfaNo: crudData.sayfaNo + 1})
    }
  }
  const crudGoPrevPage = () => {
    if(crudData.sayfaNo > 1){
      setCrudData({...crudData, sayfaNo: crudData.sayfaNo - 1})
    }
  }
  const crudGoLastPage = () => {
    setCrudData({...crudData, sayfaNo: crudData.sayfaSayisi})
  }
  const crudGoFirstPage = () => {
    setCrudData({...crudData, sayfaNo: 1})
  }
  const crudSayfaNoChange = (e) => {
    setCrudData({...crudData, sayfaNo: parseInt(e.target.value) })
  }
  const kacarChange = (e) => {
    setCrudData({...crudData, kacar: parseInt(e.target.value), sayfaNo: 1 })
  }
  const CrudColumns = (props) => {
    const items = props.crudData.crudColumns.map((value, key)=>
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
      type: 'LinkWidthId',
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
            <TableControls crudData={crudData} 
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
              <CrudColumns crudData={crudData} />
            </thead>
            <tbody>
              <TableRows crudList={crudList} crudData={crudData} deleteRow={deleteRow} tableRowButtons={tableRowButtons} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={'PanelComponentForm?panelId=' + panelId} className="addBtn">Ekle</Link>
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} 
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
