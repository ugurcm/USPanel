import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from './TableRows';



export default function UserList (props) {
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
    //refreshTable();
    //pageDataGoster();
  }
  useEffect(()=>{
    refreshTable();
    //console.log(pageData);
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
  
  const CrudSayfaNoSelectInput = (props) => {
    let items = [];
    for (let i = 1; i <= pageData.crudData.crudList.sayfaSayisi; i++) {
      items.push(<option key={i} value={i} >{i}</option>)
    }
    return (
      <select onChange={crudSayfaNoChange} value={pageData.sayfaNo}>
        {items}          
      </select>
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
            <div className="tbl-controls">
              <div className="icol">
                <span>Kayıt Sayısı</span>
                <select onChange={kacarChange} value={pageData.kacar}>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div className="icol">
                <a href="#" onClick={crudGoFirstPage}><i className="fa fa-step-backward"></i></a>
              </div>
              <div className="icol">
                <a href="#" onClick={crudGoPrevPage}><i className="fa fa-angle-left"></i></a>
              </div>
              <div className="icol">
                <span>Sayfa</span>
                <CrudSayfaNoSelectInput />
              </div>
              <div className="icol">
                <span>({pageData.crudData.crudList.nereden} - {pageData.kacar} / {pageData.crudData.crudList.toplam})</span>
              </div>
              <div className="icol">
                <a href="#" onClick={crudGoNextPage}><i className="fa fa-angle-right"></i></a>
              </div>
              <div className="icol">
                <a href="#" onClick={crudGoLastPage}><i className="fa fa-step-forward"></i></a>
              </div>
            </div>
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
            <a href="" className="refreshBtn">Yenile</a>
            <a href="" className="addBtn">Ekle</a>
          </div>
          <div className="control-right">
            <div className="tbl-controls">
              <div className="icol">
                <span>Kayıt Sayısı</span>
                <select>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                </select>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-step-backward"></i></a>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-angle-left"></i></a>
              </div>
              <div className="icol">
                <span>Sayfa</span>
                <select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
              <div className="icol">
                <span>(0 - 30 / 1)</span>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-angle-right"></i></a>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-step-forward"></i></a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
