import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../libraries/doAjax';

import Select from './Select';

export default function TekliSelectAltKategori (props) {
  //name={item.slug} value={values[item.slug] || ''}
  //console.log(props);
  const {item, values, state, setState, appContext, id} = props;
  const name = item.slug; //siniflar_id
  const value = values[item.slug] || '';
  //console.log(item);
  //console.log(state);

  useEffect(()=>{
    //const myobj = {};
    //myobj[[item.target_table + "ListArr"]] = {isim:"ugur", soyisim:"yilmaz"};
    //console.log(myobj['siniflarListArr'])
    


    //console.log(item.target_table);
    /*setState((state)=>(
      {...state, 
        [item.target_table]: {isim:"ugur", soyisim:"yilmaz"}})
    );*/
    //console.log({...state, yeniArr:['aa','bb']});
    
    //console.log(value);
    
    parentListesiGetir({id: value, idCikar:'hayir'})
    //console.log(item.target_table);
  },[])

  const parentListesiGetir = ({id,idCikar}) => {
    //console.log(id);
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getKategoriBread',
      'GET',
      {
        table: item.target_table,
        name: item.target_table_secilen_kolon,
        target_table_title: item.target_table_title,
        id: id,
        idCikar: idCikar
      }
    );
    data.then((res)=>{
      //console.log(res);
      const gelen = JSON.parse(res);
      //console.log(gelen);
      //Liste kontrol ediliyor. Modül listesinde select box seçilecek.
      if(gelen.parentList.length){
        gelen.parentList.map((value, key)=>{
          //console.log(value);
          //console.log(state.values[item.slug]);
        
          //console.log(idCikar);
          if(idCikar == 'evet'){  // eger formdan geliyorsa listeden kendisini çıkarıyoruz
            // gelen listeden mevcut idyi cikartalim kendisini eklemesin.
            let newList = value.liste.filter(item => (item.id !== id));
            //console.log(newList);
            //gelen.parentList[key].selected = 0;
            gelen.parentList[key].liste = newList;
            //console.log(gelen.parentList);
            if(newList.length == 0){
              let newParentList = gelen.parentList.filter((item, itemkey) => (itemkey !== key));
              //console.log(newParentList);
              gelen.parentList = newParentList;
            }
            
            //console.log("id evet");
          }

          if(idCikar == 'hayir'){ // eğer crud listeden ekle dediysek listeden çıkartmamıza gerek yok çünkü seçilen yok.
            //console.log("id hayir");
            
          }


          

          
          //console.log(gelen);

        })
        //console.log(gelen.parentList);

        //console.log(gelen.parentList);

        let mynewObj = {};
        mynewObj[['comp'+item.id]] = gelen.parentList;
        //console.log(mynewObj);
        if(idCikar == 'evet'){
          setState((state) => ({...state, 
            [item.target_table]: mynewObj
          }));
        }
        if(idCikar == 'hayir'){
          setState((state) => ({...state, 
            [item.target_table]: mynewObj, 
            values: {...state.values, [name]:id}
          }));
        }
        

      }

      


    })
  }


  /*const parentListesiGetir = ({id}) => {
    //console.log(id);
    //console.log(item);
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getAltKategori',
      'GET',
      {
        table: item.target_table,
        name: item.target_table_secilen_kolon,
        target_table_title: item.target_table_title,
        id: id,
      }
    );
    data.then((res)=>{
      //console.log(res);
      let gelen = JSON.parse(res);
      //console.log(gelen);
      let list = {};      
      list['comp'+item.id] = [gelen];
      //console.log(list);
      setState((state)=>(
        {...state, [item.target_table]: list}
      ))
    })
  }*/
  
  const onChange = ({key,e})=> {

    let myVal = parseInt(e.target.value);
    //console.log(myVal);
    secimYap({key, value:myVal})
    
  }

  const secimYap = ({key,value}) => {
    //console.log("secim yapildi");
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getAltKategori',
      'GET',
      {
        table: item.target_table,
        name: item.target_table_secilen_kolon,
        target_table_title: item.target_table_title,
        id: value,
        key:key
      }
    );
    data.then((res)=>{
      let gelen = JSON.parse(res);
      //console.log(gelen);
      let myo = {};
      myo.selected = 0;
      myo.liste = gelen.liste;
      //console.log(id);
      //console.log(myo)
      //eger id var ise gelen listeden kendisini cikartalim kendisini seçemesin.
      if(id){
        let newList = myo.liste.filter(item => (item.id !== id));
        myo.liste = newList;
      }
      //console.log(myo);
      //console.log(myo.liste.length);
      
      
      let stateValue = 0;
      //let myarr = [...state.altKategori];
      let myarr = [...state[item.target_table]['comp'+item.id]];
      //console.log(key);
      if(key in state[item.target_table]['comp'+item.id]){
        //console.log("key var "+key);
        myarr[key].selected = value; 
        myarr.length = key+1;
        
        stateValue = value; 
        if(gelen.liste.length && key == 0 && value == 0){
          myarr.push(myo);
          myarr.length = key+1;
          //console.log("key 0 value 0");
        }
        //Eger gelen listede eleman varsa, secilen id 0 degilse ve yeni listedeki elemanlar 0dan büyük ise ekle.
        if(gelen.liste.length && value > 0 && myo.liste.length > 0){
          myarr.push(myo);
          //console.log("value 0 dan büyük");
        }
        if(stateValue == 0){  //eger alt kategoride 0 seçilirse value olarak bir öncekini seçsin.
          if((key-1) in state[item.target_table]['comp'+item.id]){
            stateValue = state[item.target_table]['comp'+item.id][key-1].selected;
          }
        }

        

      }else{
        //console.log("key yok "+key);
        myarr.push(myo);
      }
      
      //console.log(myarr);
      //console.log(stateValue);
      let mynewObj = {};
      mynewObj[['comp'+item.id]] = myarr;
      //console.log(mynewObj);
      setState((state) => ({...state, 
        [item.target_table]: mynewObj, 
        values: {...state.values, [name]: stateValue}
      }));

    })
  }


  return(
    <>
      {([item.target_table] in state ? 
          state[item.target_table]['comp'+item.id].map((val, key)=>
          <Select key={key} name={name} value={val.selected} inputList={val.liste} itemKeyValue="id" itemKeyName={item.target_table_title} defaultValue={0} hasDefault={1} onChange={(e)=>onChange({key,e})} />

          )
        :null)}
    </>
  )
}




