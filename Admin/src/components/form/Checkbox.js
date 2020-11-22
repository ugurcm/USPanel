import React, {useState, useContext, useEffect} from 'react';


export default function Checkbox (props) {
  const {name, onChange, value, label} = props;
  
  const [inputValue, setInputValue] = useState(value);
  useEffect(()=>{
    //console.log(value);
    //console.log(inputValue);
 
    setInputValue(Boolean(Number(value)));
    
  })
  
  return(
    <div className="checkbox" >
      <input type="checkbox" name={name} onChange={onChange} checked={inputValue} />
      <span className="us-checkbox">
        <i className="fa fa-check"></i>
      </span>
      <span className="us-checkbox-label">
        {label}
      </span>
    </div> 

  )
}