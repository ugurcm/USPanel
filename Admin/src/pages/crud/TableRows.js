import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

export default function TableRows (props) {
  const items = props.pageData.crudData.crudList.listData.map((item, key) =>
    <tr key={key}>
      {props.pageData.crudData.crudColumnSlugs.map((column,keym)=>{
        return(<td key={keym}>{item[column]}</td>)
      })}   
      <td>
        <div className="editBtns">
          <div className="item" >
            <a href="" className="btn-edit">
              <div className="icon">
                <i className="fas fa-edit"></i>        
              </div>              
              <div className="desc">
                Düzenle
              </div>
            </a>
          </div>
          <div className="item">
            <a href="">                        
              <div className="icon">
                <i className="fas fa-minus-square"></i>       
              </div>              
              <div className="desc">
                Sil
              </div>
            </a>
          </div>
          
        </div>
      </td>
    </tr>
  )
  return(
    <React.Fragment>
      {items}
    </React.Fragment>
  )
}