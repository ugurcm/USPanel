import React, {useState, useContext, useEffect} from 'react';


export default function Radio (props) {
  const {name, onChange, value, label, checkedValue} = props;
  
  return(
    /*<div className="checkbox" >
      <input type="checkbox" name={name} onChange={onChange} checked={value} />
      <span className="us-checkbox">
        <i className="fa fa-check"></i>
      </span>
      <span className="us-checkbox-label">
        {label}
      </span>
    </div> */
    <label className="radio">
      <input type="radio" name={name} onChange={onChange} value={value} checked={checkedValue == value} />
      <span className="us-radio">
        <span className="us-radio-border"></span>
        <span className="us-radio-icon"></span>
      </span>
      <span className="us-radio-label">
        {label}
      </span>
    </label> 
  )
}
