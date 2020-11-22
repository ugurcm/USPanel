import React, {useState, useContext, useEffect} from 'react';

export default function menuTreeSelector (props) {
  const {tree, suankiUrl, suankiUrlMenuSec} = props;
  
  //console.log(tree);
  if(tree){

    /*tree.map((item,key)=>{
      if(item.slug == suankiUrl){
        suankiUrlMenuSec([key])
      }
      if(item.children){
        menuTreeSelector({tree:item.children, suankiUrl:suankiUrl, suankiUrlMenuSec: suankiUrlMenuSec});
      }
    })*/
    
    const realTree = {children: tree}
    //console.log(realTree)
    function findParents(node, searchForName) {
      //console.log(node);
      // If current node name matches the search name, return
      // empty array which is the beginning of our parent result
      if(node.slug === searchForName) {
        return []
      }
      
      // Otherwise, if this node has a tree field/value, recursively
      // process the nodes in this tree array
      if(Array.isArray(node.children)) {
        
        var i = 0;
        for(var treeNode of node.children) {
          
          // Recursively process treeNode. If an array result is
          // returned, then add the treeNode.name to that result
          // and return recursively
          const childResult = findParents(treeNode, searchForName)
    
          if(Array.isArray(childResult)) {
            //return [ treeNode.slug ].concat( childResult );
            return [ i ].concat( childResult );
          }
          i ++;
        }

      }
    }
    

    //const liste = findParents(realTree, 'alt-slider');
    const liste = findParents(realTree, suankiUrl);
    if(liste){
      suankiUrlMenuSec(liste)
    }
  }

  
}