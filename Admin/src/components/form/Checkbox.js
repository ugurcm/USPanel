import React, {useState, useContext, useEffect} from 'react';


export default function Checkbox (props) {
  const {name, onChange, value, label} = props;
  
  return(
    <div className="checkbox" >
      <input type="checkbox" name={name} onChange={onChange} checked={value} />
      <span className="us-checkbox">
        <i className="fa fa-check"></i>
      </span>
      <span className="us-checkbox-label">
        {label}
      </span>
    </div> 

  )
}