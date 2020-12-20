import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../libraries/doAjax';

import Select from './Select';

import update from 'immutability-helper';

export default function CokluSelectAltKategorili (props) {
  //name={item.slug} value={values[item.slug] || ''}
  //console.log(props);
  const {item, values, onChange, state, setState, appContext, id} = props;
  const name = item.slug; //siniflar_id
  const value = values[item.slug] || '';

  const idCikar = 'hayir';
  
  useEffect(()=>{
    //console.log(state);
    //console.log(item);
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getCokluSelectListAltKategorili',
      'GET',
      {
        id: id,
        table: state.panel.slug,
        target_table: item.target_table,
        target_table_title: item.target_table_title,
        target_table_secilen_kolon: item.target_table_secilen_kolon,
        value: value,
        idCikar: 'hayir'
      }
    );
    data.then((res)=>{
      //console.log(res);
      let gelen = JSON.parse(res);
      //console.log(gelen);
      /*if(gelen['tableList']){
        setState((state)=>({...state, 
          stateComp: {...state.stateComp, 
            ['state_'+item.id]: {
            selectListe:gelen['tableList'],
            selectedId: 0,
            selectedText: '',
            eklenenListe: gelen.itemList
          }}
        }))
      }*/
      //console.log(gelen.parentList);
      //Liste kontrol ediliyor. Modül listesinde select box seçilecek.
      if(gelen.parentList.length){
        if(idCikar == 'hayir'){

          setState((state)=>({...state, 
            stateComp: {...state.stateComp, 
              ['state_'+item.id]: {
                liste:gelen.parentList,
                selectedId: 0,
                selectedText: '',
                eklenenListe: gelen.itemList
              }
            },
          }))
          
          
          
        }
      }





    });

    

  },[])
  
  const onChangeSelect = ({key, e}) => {
    
    var index = e.nativeEvent.target.selectedIndex;
    //const secilenValue = e.target.value;
    const selectedText = e.nativeEvent.target[index].text;

    /*const newArr = update(state, {
      stateComp: {
        ['state_'+item.id]: {
          selectedId: {$set: secilenValue  }, 
          selectedText: {$set:secilenText}
        }
      } 
    });*/
    //console.log(newArr);
    //console.log(state.stateComp['state_'+item.id]);
    /*setState((state)=> (state = newArr));*/

    let selectedId = parseInt(e.target.value);
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getAltKategori',
      'GET',
      {
        table: item.target_table,
        name: item.target_table_secilen_kolon,
        target_table_title: item.target_table_title,
        id: selectedId,
        key:key
      }
    );
    data.then((res)=>{
      //console.log(res);
      let gelen = JSON.parse(res);
      //console.log(gelen);
      let myo = {};
      myo.selected = 0;
      myo.liste = gelen.liste;
      //myo.selectedId = selectedId;
      //myo.selectedText = selectedText;
      //console.log(myo);

      let stateValue = 0;
      //let myarr = [...state.altKategori];
      let myarr = [...state['stateComp']['state_'+item.id]['liste']];
      //console.log(myarr);
      if(key in state['stateComp']['state_'+item.id]['liste']){
        //console.log("key var "+key);
        myarr[key].selected = selectedId; 
        myarr.length = key+1;
        
        stateValue = selectedId; 
        if(gelen.liste.length && key == 0 && selectedId == 0){
          myarr.push(myo);
          myarr.length = key+1;
          //console.log("key 0 selectedId 0");
        }
        //Eger gelen listede eleman varsa, secilen id 0 degilse ve yeni listedeki elemanlar 0dan büyük ise ekle.
        if(gelen.liste.length && selectedId > 0 && myo.liste.length > 0){
          myarr.push(myo);
          //console.log("selectedId 0 dan büyük");
        }
        if(stateValue == 0){  //eger alt kategoride 0 seçilirse selectedId olarak bir öncekini seçsin.
          if((key-1) in state['stateComp']['state_'+item.id]['liste']){
            //stateValue = state[item.target_table]['comp'+item.id][key-1].selected;
            stateValue = state['stateComp']['state_'+item.id]['liste'][key-1].selected;
          }
        }

        

      }else{
        //console.log("key yok "+key);
        myarr.push(myo);
      }

      //console.log(myarr);

      /*setState((state)=>({...state, 
        stateComp: {
          ...state.stateComp, 
          ['state_'+item.id]: {
            liste:myarr,
            selectedId: stateValue, 
            selectedText: selectedText
          }
        }
      }))*/
      //console.log(myarr);
      const newState = update(state, {
        stateComp: {
          ['state_'+item.id]: {
            liste: {$set:myarr},
            selectedId: {$set: stateValue  }, 
            selectedText: {$set: selectedText}
          }
        } 
      });
      setState((state)=>(state = newState));
      //console.log(newState);


    });

  }
  const onAddBtn = ({e}) => {
    e.preventDefault();
    //console.log(state.stateComp['state_'+item.id]);
    const cState = state.stateComp['state_'+item.id];


    const itemVarmi = cState.eklenenListe.filter((item)=>{
      return item.id == cState.selectedId
    })

    if(itemVarmi.length){
      alert("Daha önce eklenmiş.");
      const guncellenenState = update(state, {stateComp: 
        {['state_'+item.id]: 
          {
            selectedId: {$set: ''}, 
            selectedText: {$set: ''}
          } 
        }
      });
      setState((state)=>(state = guncellenenState));
    }

    if(cState.selectedId > 0 && !itemVarmi.length){
      //console.log("şimdi eklendi");
      const eklenecekItem = {id: cState.selectedId, text: cState.selectedText}
      const guncellenenState = update(state, {stateComp: 
        {['state_'+item.id]: 
          {
            eklenenListe: {$push: [eklenecekItem]},
            selectedId: {$set: ''}, 
            selectedText: {$set: ''}
          } 
        }
      });
      setState((state)=>(state = guncellenenState));
      //console.log(guncellenenState);
    }
    
  }
  
  const itemSil = (e,index) =>{
    e.preventDefault();
    const myIndex = parseInt(index);
    //console.log("item sil " +index);

    const liste = [...state.stateComp['state_'+item.id].eklenenListe];
    //console.log(liste);
    liste.splice(myIndex,1);
    

    const stateGuncelle = update(state, {
      stateComp: {
        ['state_'+item.id]: {
          eklenenListe: {$set: liste}
        }
      }
    })

    setState((state) => (state = stateGuncelle));
  
  }
  return(
    <>
    <div className="coklu-select">
      <div className="ust">
        <div className="select-item">
        
          {(['state_'+item.id] in state.stateComp ? 
            state.stateComp['state_'+item.id].liste.map((val, key)=>
              <Select key={key} name={name} value={val.selected} inputList={val.liste} itemKeyValue="id" itemKeyName={item.target_table_title} defaultValue={0} hasDefault={1} onChange={(e)=>onChangeSelect({key,e})} />
            )
          :null)} 
        </div>
        <div className="select-btn">
          <button onClick={(e)=>onAddBtn({e})}>Ekle</button>
        </div>
      </div>
      <div className="liste">
        {state.stateComp['state_'+item.id]?
          ('eklenenListe' in state.stateComp['state_'+item.id] ? 
            state.stateComp['state_'+item.id].eklenenListe.map((val,key)=> 

              <div key={key} className="item">
                <div className="title">{val.text}</div>
                <div className="ctrl"><button onClick={(e)=>itemSil(e,key)}><i className="fa fa-times"></i></button></div>
              </div>
            
            )
          :'')
        :'yok'}
       
      </div>
    </div>
    </>
  )
}

