import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';


export default function TableRows (props) {
  //console.log(props.pageData.crudData.crudColumns);
  
  const CustomButton = (buttonProps) => {
    const bProps = buttonProps.buttonProps;
    const {item} = buttonProps;
    if(!bProps.type){
      return;
    }
    //console.log(bProps);
    
    if(bProps.type == 'LinkWidthId'){
      return(
        <Link to={bProps.link + '?id=' + item.id} className="btn-edit" data-tooltip={bProps.name}>
          {buttonProps.children}
        </Link>
      )
    }
    if(bProps.type == 'ClickEvent'){
      return(
        <a href="#" className="btn-delete" data-tooltip={bProps.name} onClick={(e)=>bProps.eventFunction(e, item.id)}>                   
          {buttonProps.children}                                
        </a>
      );
    }
  }
  const Buttons = (buProps) => {
    let buttonCont = props.tableRowButtons.map((buttonProps, key)=>
      <div className="item" key={key}>
        <CustomButton buttonProps={buttonProps} item={buProps.item}>
          <div className="icon">
            <i className={buttonProps.icon}></i>        
          </div> 
          <div className="desc">{buttonProps.name}</div>  
        </CustomButton>
      </div>
    )
    return buttonCont; 
  }
  //console.log(props);
  //console.log(props.crudList.listData);
  //return false;
  
  //<Buttons item={item} />
  //console.log((props.crudList.length?'var':'yok'));
  
  return(
    <React.Fragment>
      {props.crudList.length?props.crudList.map((item, key) =>
        <tr key={key}>
          {props.crudData.crudColumns.map((column,keym)=>{
            if(column.slug){
              return(<td key={keym}>{(item[column.as]?item[column.as]:item[column.slug])}</td>)
            }
          })}   
          <td className="rowBtns">
            <div className="editBtns">
              <Buttons item={item} />
            </div>
          </td>
        </tr>
      ):<tr><td colSpan={10}>Kayıt Bulunamadı.</td></tr>}
    </React.Fragment>
  )
}