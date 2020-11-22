import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../../../context/AppContext';
import Swal from 'sweetalert2';

//import AktifPasif from './listComponents/AktifPasif';

export default function TableRow (props) {
  //console.log(props.pageData.crudData.crudColumns);
  //console.log(props);
  
  /*const listComponents = {
    'AktifPasif': AktifPasif,
  }*/

  const CustomButton = (buttonProps) => {
    const bProps = buttonProps.buttonProps;
    const {item} = buttonProps;
    if(!bProps.type){
      return;
    }
    //console.log(bProps);
    
    if(bProps.type == 'LinkWidthId'){
      return(
        <Link to={bProps.link + '' + item.id} className="btn-edit" data-tooltip={bProps.name}>
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

  
  //console.log(props.crudList);
  return(
    <React.Fragment>
      {props.crudList.length?props.crudList.map((item, key) =>
        
        <tr key={key}>
          {props.crudColumns.map((column,keym)=>{
            /*if(column.componentName == 'AktifPasif'){
              column.listComponent = column.componentName;
            }*/
            if(column.listComponent){
              let value = (item[column.as]?item[column.as]:item[column.slug]);
              const SecilenComponent = listComponents[column.listComponent];
              return(<td key={keym}><SecilenComponent column={column} value={value} tableName={props.tableName} row={item} /></td>)
            }else{
              if(column.slug){
                let yazi = (item[column.as]?item[column.as]:item[column.slug]);
                if(column.panel_table_column_input_id == 8){
                  yazi = <Link to={'/CrudList/' + column.tableName + '/' + item.id }>{column.title}</Link>
                }              
                return(<td key={keym}>{yazi}</td>)
              }
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