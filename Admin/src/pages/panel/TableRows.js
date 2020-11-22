import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

export default function TableRows (props) {
  //console.log(props)
  //console.log(props.pageData.crudData.crudColumns);
  
  /*const deleteRow = (e, itemId = 0) => {
    props.deleteRow(e, itemId);
  }*/
  //console.log(props);
  //console.log(props.crudData.crudColumns);
  //console.log(props.crudList);
  let items = props.crudList.map((item, key) =>
    <tr key={key}>
      {props.crudColumns.map((column,keym)=>{
        if(column.slug && column.show_in_crud){
          return(<td key={keym}>{item[column.slug]}</td>)
        }
      })}   
      <td className="rowBtns">
        <div className="editBtns">
          <div className="item" >
            <Link to={'panel?id=' + item.id} className="btn-edit" data-tooltip="Alt Paneller">
              <div className="desc">Alt Paneller</div>  
            </Link>
          </div>
          {
            (item.has_table==1?<div className="item" >
            <Link to={'panelComponent?id=' + item.id} className="btn-edit" data-tooltip="Bileşenler">
              <div className="desc">Bileşenler</div>  
            </Link>
          </div>:null)
          }
          
          <div className="item" >
            <Link to={'panelForm?id=' + item.id} className="btn-edit" data-tooltip="Düzenle">
              <div className="icon">
                <i className="far fa-edit"></i>        
              </div> 
              <div className="desc">Düzenle</div>  
            </Link>
          </div>
          <div className="item">
            <a href="#" className="btn-delete" data-tooltip="Sil" onClick={(e)=>props.deleteRow(e, item.id)}>                   
              <div className="icon">
                <i className="fa fa-times"></i>       
              </div> 
              <div className="desc">Sil</div>                                
            </a>
          </div>
          
        </div>
      </td>
    </tr>
  )
  if(props.crudList.length <= 0){
    //console.log("0 lan");
    items = <tr><td colSpan={10}>Kayıt Bulunamadı.</td></tr>
  }
  //console.log(items);
  
  return(
    <React.Fragment>
      {items}
    </React.Fragment>
  )
}