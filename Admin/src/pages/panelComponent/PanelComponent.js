import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import AppContext from "../../context/AppContext";

import Swal from "sweetalert2";

import doAjax from "../../libraries/doAjax";
import TableRows from "./compList/TableRows";
import TableControls from "./compList/TableControls";

import {pageInitWork, refreshTableWork, yukariWork, deleteRowWork} from './compList/CrudLib';

export default function PanelComponent(props) {
  const appContext = useContext(AppContext);
  const [pageId, setPageId] = useState(0);
  const [formLink, setFormLink] = useState("PanelComponentForm");
  const [pageName, setPageName] = useState("Panel Bileşenleri");
  const [crudData, setCrudData] = useState({
    table: "column",
    sayfaNo: 1,
    kacar: 100,
    sayfaSayisi: 0,
    toplam: 0,
  });
  const [crudColumns, setCrudColumns] = useState([]);
  const [crudList, setCrudList] = useState([]);
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    if (parsed.id) { //eger query string id varsa degerleri atalayim.
      pageInit({pageId:parsed.id});
    } 
  },[]);
  useEffect(() => {
    if(pageId>0) refreshTable();
  }, [crudData.sayfaNo, crudData.kacar, pageId]); 

  const pageInit = ({pageId}) => {
    pageInitWork({pageId, appContext, pageName,setPageName, setPageId,setFormLink})
  }
  const refreshTable = () => {
    refreshTableWork({appContext,pageId,crudData,setCrudColumns,setCrudList, setCrudData})
  }
  const yenile = (e) => {
    e.preventDefault();
    refreshTable();
  };
  const yukari = (e) => {
    yukariWork({e,appContext,pageId,setFormLink,history: props.history });
  }
  const crudGoNextPage = () => {
    if (crudData.sayfaNo < crudData.sayfaSayisi) {
      setCrudData({ ...crudData, sayfaNo: crudData.sayfaNo + 1 });
    }
  };
  const crudGoPrevPage = () => {
    if (crudData.sayfaNo > 1) {
      setCrudData({ ...crudData, sayfaNo: crudData.sayfaNo - 1 });
    }
  };
  const crudGoLastPage = () => {
    setCrudData({ ...crudData, sayfaNo: crudData.sayfaSayisi });
  };
  const crudGoFirstPage = () => {
    setCrudData({ ...crudData, sayfaNo: 1 });
  };
  const crudSayfaNoChange = (e) => {
    setCrudData({ ...crudData, sayfaNo: parseInt(e.target.value) });
  };
  const kacarChange = (e) => {
    setCrudData({ ...crudData, kacar: parseInt(e.target.value), sayfaNo: 1 });
  };
    
  const deleteRow = ({e, itemId}) => {
    deleteRowWork({e, itemId, appContext,pageId,crudData,setCrudColumns,setCrudList, setCrudData});
  };

  //console.log(crudColumns);
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
            <Link to={formLink} className="addBtn">Ekle</Link>
            {(pageId>0?<a href="#" onClick={yukari} className="refreshBtn">Yukarı Git</a>:null)}
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} kacarChange={kacarChange} crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage} crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} crudSayfaNoChange={crudSayfaNoChange} />
          </div>
        </div>
        <div className="list-table">
          <table>
            <thead>
              <tr>
                {crudColumns.map((value, key) => {
                  if (value.show_in_crud == 1) {
                    return <th key={key}>{value.title}</th>;
                  }
                })}
              </tr>
            </thead>
            <tbody>
              <TableRows crudColumns={crudColumns} crudList={crudList} crudData={crudData} deleteRow={deleteRow} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={formLink} className="addBtn">Ekle</Link>
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} kacarChange={kacarChange} crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage} crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} crudSayfaNoChange={crudSayfaNoChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
