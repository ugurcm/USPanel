import React, {useState, useContext, useEffect} from 'react';

export default function doAjax (ajaxUrl, ajaxType, gonderData) {
  let data = null;
  let loading = true;
  const fetchData = async () => {
    let response;
    response = await $.ajax({
      type: ajaxType,
      data: gonderData,
      url: ajaxUrl
    })
    .done((res)=>{})
    .fail((res) => {
      console.log('error');
      console.log(res);
    });
    return response;
  };
  data = fetchData();
  loading = false;
  
  return data;
}

