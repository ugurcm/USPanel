
import React, {useState, useContext, useEffect} from 'react';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import update from 'immutability-helper';
import {isEqual,clone} from 'lodash';

export default function SortableTest(props){  
  const [state,setState] = useState({
    items:[
      {id:1,title:"araba"},
      {id:2,title:"ev"},
      {id:3,title:"tarla"},
      {id:4,title:"yazlik"}
    ],
    okul:"beykent"
  })
  
  useEffect(()=>{
    console.log(state);
  },[state])

  const onSortEnd = ({oldIndex,newIndex}) =>{
    const newArr = arrayMove(state.items, oldIndex, newIndex);
    if(!isEqual(state.items,newArr)){   //eger yeni sıralama eskisi ile aynı değilse state güncelle.   
      setState((state)=>({...state, items: newArr }))
    }
   
  }
  const DragHandle = SortableHandle(()=> <span>::</span>);

  const SortableItem = SortableElement(({value})=>
    <tr className="sortableTr"><td><DragHandle /></td><td>{value.id}</td><td>{value.title}</td></tr>
  )
  const SortableList = SortableContainer(({items})=>{
    return (      
     
        <tbody>
        {items.map((value,key)=>
          <SortableItem key={key} index={key} value={value} />
        )}
        </tbody>
    
    )
  })
  
  return <div>    
    <table className="dragTable">
    <SortableList items={state.items} onSortEnd={onSortEnd} useDragHandle />     
    </table>
  </div>
}
