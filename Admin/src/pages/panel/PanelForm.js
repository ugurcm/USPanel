import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

export default function PanelForm (props ) {
  const appContext = useContext(AppContext);

  //console.log(appContext);
  
  return (
    <div>
      PanelForm sayfası
    </div>
  )
}


