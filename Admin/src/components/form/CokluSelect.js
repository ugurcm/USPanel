import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../libraries/doAjax';

import Select from './Select';

import update from 'immutability-helper';

export default function CokluSelect (props) {
  //name={item.slug} value={values[item.slug] || ''}
  //console.log(props);
  const {item, values, onChange, state, setState, appContext, id} = props;
  const name = item.slug; //siniflar_id
  const value = values[item.slug] || '';

  
  useEffect(()=>{
    //console.log(state);
    //console.log(item);
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getCokluSelectList',
      'GET',
      {
        id: id,
        table: state.panel.slug,
        target_table: item.target_table,
        target_table_title: item.target_table_title,
      }
    );
    data.then((res)=>{
     // console.log(res);
      let gelen = JSON.parse(res);
      //console.log(gelen);
      if(gelen['tableList']){
        //setStateComp((state)=>({...stateComp, liste: gelen['tableList']}))
        
        setState((state)=>({...state, 
          stateComp: {...state.stateComp, 
            ['state_'+item.id]: {
            selectListe:gelen['tableList'],
            selectedId: 0,
            selectedText: '',
            eklenenListe: gelen.itemList
          }}
        }))
        
        





      }

    });



  },[])
  
  const onChangeSelect = (e) => {
    //console.log(e.target.value);
    var index = e.nativeEvent.target.selectedIndex;
    
    
    const secilenValue = e.target.value;
    const secilenText = e.nativeEvent.target[index].text;

    const newArr = update(state, {stateComp: {['state_'+item.id]: 
      {selectedId: {$set: secilenValue  }, selectedText: {$set:secilenText}}
    } });
    //console.log(newArr);
    //console.log(state.stateComp['state_'+item.id]);
    setState((state)=> (state = newArr));
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
          {(['state_'+item.id] in state.stateComp?
          <Select name={name} value={state.stateComp['state_'+item.id].selectedId} onChange={onChangeSelect} 
            hasDefault={1} defaultValue={0} inputList={state.stateComp['state_'+item.id].selectListe} 
            itemKeyValue={'id'} itemKeyName={item.target_table_title}
            />
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

