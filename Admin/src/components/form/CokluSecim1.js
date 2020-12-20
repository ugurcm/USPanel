import React, {useState, useContext, useEffect} from 'react';


export default function CokluSecim (props) {
  const [secilenItem, setSecilenItem] = useState(0);
  const [secilenItemText, setSecilenItemText] = useState(0);
  const {name, componentId, onChangeCoklu, cokluSelectList, value, crudColumn, label, inputList, itemKeyName, itemKeyValue, defaultValue, hasDefault} = props;
  const [selectedValue, setSelectedValue] = useState(0);
  /*const cokluSecimEkle = (e) => {
    e.preventDefault();
    console.log(secilenItem);
  }*/
  //console.log(cokluSelectList);
  //console.log(cokluSelectList['item' + componentId]);
  //console.log(value.length);
  useEffect(()=>{
    //console.log(value);    
  },[props.value])
  
  return(
    <div className="cokluSecim">
      <div className="secimRow">
        <div className="select">
        {
          (cokluSelectList['item' + componentId]?
            //console.log(cokluSelectList['item' + componentId]['liste'])
            //console.log("okok")
            cokluSelectList['item' + componentId].map((select, selectIndex) =>{
            
            
              return (select['selectIcListe'].length?
                <select key={selectIndex} value={select.secilenItem} onChange={(e) => {
                  setSecilenItem(e.target.value);
                  setSecilenItemText(e.target.selectedOptions[0].text);
                  props.onChangeCoklu(e, selectIndex, crudColumn); 
                  }}>
                  {hasDefault==1?<option value={0}>Seçiniz</option>:''}        
                  {
                    select.selectIcListe.map((item,key)=>
                      <option value={item[itemKeyValue]} key={key}>{item[itemKeyName]}</option>
                    )
                  }        
                </select>
              :'')
              
              
            })
          :'')
          //console.log(cokluSelectList['item' + componentId].hasOwnProperty('liste'))	
        }
        </div>
        <div className="btnCont">
          <button className="beyazBtn2" onClick={(e) =>{ props.cokluSecimEkle(e, name, secilenItem, secilenItemText, crudColumn); /*setSecilenItem(0);*/ }}>Ekle</button>
        </div>
      </div>
      <div className="secimListe">
        {(value.length?
          value.map((listeItem,key)=>
            <div className="item" key={key}>
              <div className="title">{listeItem.title}</div>
              <div className="controls">
                <button onClick={(e) => props.cokluSecimKaldir(e, name, listeItem)}><i className="fa fa-times-circle"></i></button>
              </div>
            </div>
          ):'')}
      </div>

    </div>

  )
}