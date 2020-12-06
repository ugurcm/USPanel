import React, {useState, useContext, useEffect} from 'react';

import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';


const DragHandle = SortableHandle(()=> <span>::</span>);

export const SortableList = SortableContainer(({items})=>{
  return (
    <tbody></tbody>
  )
})