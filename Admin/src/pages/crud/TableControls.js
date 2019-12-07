import React, {useState, useContext, useEffect} from 'react';


export default function TableControls(props){

  const CrudSayfaNoSelectInput = (props) => {
    let items = [];
    for (let i = 1; i <= props.pageData.crudData.crudList.sayfaSayisi; i++) {
      items.push(<option key={i} value={i} >{i}</option>)
    }
    return (
      <select onChange={props.crudSayfaNoChange} value={props.pageData.sayfaNo}>
        {items}          
      </select>
    )
  }
  return(
    <div className="tbl-controls">
      <div className="icol">
        <span>Kayıt Sayısı</span>
        <select onChange={props.kacarChange} value={props.pageData.kacar}>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="10">10</option>
        </select>
      </div>
      <div className="icol">
        <a href="#" onClick={props.crudGoFirstPage}><i className="fa fa-step-backward"></i></a>
      </div>
      <div className="icol">
        <a href="#" onClick={props.crudGoPrevPage}><i className="fa fa-angle-left"></i></a>
      </div>
      <div className="icol">
        <span>Sayfa</span>
        <CrudSayfaNoSelectInput pageData={props.pageData} crudSayfaNoChange={props.crudSayfaNoChange} />
      </div>
      <div className="icol">
        <span>({props.pageData.crudData.crudList.nereden} - {props.pageData.kacar} / {props.pageData.crudData.crudList.toplam})</span>
      </div>
      <div className="icol">
        <a href="#" onClick={props.crudGoNextPage}><i className="fa fa-angle-right"></i></a>
      </div>
      <div className="icol">
        <a href="#" onClick={props.crudGoLastPage}><i className="fa fa-step-forward"></i></a>
      </div>
    </div>
  )
}