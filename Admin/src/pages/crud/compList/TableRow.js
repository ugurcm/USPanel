import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../../../context/AppContext';
import Swal from 'sweetalert2';
import DragRow from './DragRow';

export default function TableRow ({item, state, setState, deleteRow, appContext}) {
  //console.log(item);
  //console.log(crudColumns);
  //console.log(state);

  const eventFunction = ({e, itemId, eventFunction,state,setState,appContext}) => {
    e.preventDefault();
    if(eventFunction == 'deleteRow'){     
      deleteRow({e, itemId, eventFunction,state,setState,appContext});
    }
  }

  return(
    <tr>
      {state.crudColumns.map((column, key)=>{

        let returnEdilecek = item[column['slug']];

        if(column.buttons){
          //console.log(state);
          const btnList = column.buttons.map((btn, keyb)=>{
            let btnReturn = null;
            if(btn.type == 'LinkWidthId'){

              let btnLink = btn.link + '/' + item.id;
              //eğer özellik alt kategorisi varsa onu linke ekle
              if(state.queryStringList.parentTable){
                btnLink += `?parentTable=${state.queryStringList.parentTable}&parentName=${state.queryStringList.parentName}&parentValue=${state.queryStringList.parentValue}`;
              }

              btnReturn = <Link key={keyb} to={btnLink} className="btn-edit">
                <div className="icon">
                  <i className={btn.icon}></i>        
                </div> 
                <div className="desc">{btn.name}</div>  
              </Link>
            }
            if(btn.type == 'ClickEvent'){
              btnReturn = <a key={keyb} href="#" onClick={(e)=>eventFunction({e,itemId:item.id,eventFunction: btn.eventFunction,state,setState,appContext})} className="btn-edit">
                <div className="icon">
                  <i className={btn.icon}></i>        
                </div> 
                <div className="desc">{btn.name}</div>  
              </a>
            }
            if(btn.type == 'AltKategori'){
              //console.log(column);
              //console.log(btn);
              btnReturn = <Link key={keyb} to={btn.link + '/' +item.id} className="altkategori-link">{btn.name}</Link>
            }
            if(btn.type == 'AltKategoriOtherTable'){
              //console.log(column);
              //console.log(btn);
              btnReturn = <Link key={keyb} to={`${btn.link}?parentTable=${state.panel.slug}&parentName=${column.target_table_secilen_kolon}&parentValue=${item.id}`} className="altkategori-link">{btn.name}</Link>
            }

            if(btn.type == 'DragRow'){
              btnReturn = <DragRow key={key} />
            }

            return btnReturn;
          })
          returnEdilecek = <div className="editBtns">{btnList}</div>
        }

        return <td key={key}>{returnEdilecek}</td>
      })}
    </tr>
  )
}