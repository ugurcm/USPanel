import React, {useState, useContext, useEffect} from 'react';
import {SortableHandle} from 'react-sortable-hoc';

const DragHandle = SortableHandle(()=> <span><i className="fas fa-arrows-alt"></i></span>);

export default function DragRow (props){
  return (
    <div><DragHandle /></div>
  )
}