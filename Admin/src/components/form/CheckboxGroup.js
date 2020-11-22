import React, {useState, useContext, useEffect} from 'react';


export default function CheckboxGroup (props) {
  const {checkBoxes, onChange, value} = props;
  //checked={values.konumCheck[item.name]}
  return(
    <div className="checkboxGroup">
      {checkBoxes.map((item,key)=>(
        <div className="checkbox" key={key}>
          <input type="checkbox" name={item.name} onChange={onChange} checked={value[item.name]} />
          <span className="us-checkbox">
            <i className="fa fa-check"></i>
          </span>
          <span className="us-checkbox-label">
            {item.label}
          </span>
        </div> 
      ))}
    </div>
  )
}