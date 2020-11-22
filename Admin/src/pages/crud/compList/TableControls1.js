import React, {useState, useContext, useEffect} from 'react';


export default function TableControls(props){
  const kayitSayilari = [15, 30, 50, 75, 100 ];
  const CrudSayfaNoSelectInput = (props) => {
    let items = [];
    //console.log(props.crudData.sayfaSayisi);
    items.push(<option key={1} value={1} >{1}</option>)
    for (let i = 2; i <= props.crudData.sayfaSayisi; i++) {
      items.push(<option key={i} value={i} >{i}</option>)
    }
    return (
      <select onChange={props.crudSayfaNoChange} value={props.crudData.sayfaNo}>
        {items}          
      </select>
    )
  }
  return(
    <div className="tbl-controls">
      <div className="icol">
        <span>Kayıt Sayısı</span>
        <select onChange={props.kacarChange} value={props.crudData.kacar}>
          {kayitSayilari.map((value, key)=><option key={key} value={value}>{value}</option>)}
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
        <CrudSayfaNoSelectInput crudData={props.crudData} crudSayfaNoChange={props.crudSayfaNoChange} />
      </div>
      <div className="icol">
        <span>({props.crudData.nereden} - {props.crudData.kacar} / {props.crudData.toplam})</span>
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