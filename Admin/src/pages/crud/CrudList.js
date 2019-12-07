import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from './TableRows';
import TableControls from './TableControls'


export default function CrudList (props) {
  const appContext = useContext(AppContext);

  const [pageData, setPageData] = useState({
    panelTable: "Şubeler",
    table: "subeler",
    sayfaNo: 1, 
    kacar: 2,
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

  //const [sayfaNo,setSayfaNo] = useState(1);
  
  const refreshTable = () => {
    const data = doAjax(
      appContext.api_url + 'ApiUser/getCrudData',
      'GET',
      {
        panelTable: pageData.panelTable,
        table: pageData.table,
        sayfaNo: pageData.sayfaNo,
        kacar: pageData.kacar
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
    refreshTable();
  },[pageData.sayfaNo, pageData.kacar]);

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
    console.log("kacar change")
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
  
  
  
  return (
    <div className="page-content">
      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">Kullanıcılar</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <a href="#" className="addBtn">Ekle </a>
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
              <TableRows pageData={pageData} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <a href="#" className="addBtn">Ekle </a>
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
