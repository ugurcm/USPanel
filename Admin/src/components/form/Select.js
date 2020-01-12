import React, {useState, useContext, useEffect} from 'react';


export default function Select (props) {
  const {name, onChange, value, label, inputList, itemKeyName, itemKeyValue, defaultValue} = props;
  //console.log("input List Yazdir"); 
  //console.log(inputList);
  //console.log("--------------");
  //console.log(itemKeyName + " " + itemKeyValue);
  //console.log(value);
  
  return(
    <div className="select">
      <select name={name} value={value} onChange={onChange}>
        <option value={defaultValue}>Seçiniz</option>
        {
          inputList.map((item,key)=>
            <option value={item[itemKeyValue]} key={key}>{item[itemKeyName]}</option>
          )
        }
        
      </select>
    </div>

  )
}