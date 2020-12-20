import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
import {SortableHandle} from 'react-sortable-hoc';

const DragHandle = SortableHandle(()=> <span><i className="fas fa-arrows-alt"></i></span>);

export default function TableRows (props) {
  //console.log(props)
  const {item,key} = props;
  //console.log(item);
  //let items = props.crudList.map((item, key) =>
  let items = 
    <tr>
      <td><DragHandle key={key} /></td>
      {props.crudColumns.map((column,keym)=>{
        if(column.slug && column.show_in_crud){
          let returnEdilecek = item[column['slug']];

          return(<td key={keym}>{returnEdilecek}</td>)
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
  //)
  /*if(props.crudList.length <= 0){
    //console.log("0 lan");
    items = <tr><td colSpan={10}>Kayıt Bulunamadı.</td></tr>
  }*/
  //console.log(items);
  
  return(
    <React.Fragment>
      {items}
    </React.Fragment>
  )
}