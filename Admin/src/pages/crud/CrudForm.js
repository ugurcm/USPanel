import React, {useState, useContext, useEffect} from 'react';
import {useParams,useRouteMatch, Switch, Route} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from './TableRows';
import TableControls from './TableControls'

import Text from '../../components/form/Text'
import Checkbox from '../../components/form/Checkbox';
import CheckboxGroup from '../../components/form/CheckboxGroup';
import Radio from '../../components/form/Radio';
import Select from '../../components/form/Select';
import UploadComp from '../../components/form/UploadComp'
//import Dropzone from 'react-dropzone-uploader'
import Modal from '../../components/form/Modal'

import CrudFormEdit from './CrudFormEdit'


export default function CrudForm (props) {
  const appContext = useContext(AppContext);
  //let { slug } = useParams(); 
  //console.log(slug);
  let {url,path} = useRouteMatch();
  
  return(
    <Switch>
      <Route exact path={path}>
        <div>Form Slug Girilmedi.</div>
      </Route>
      <Route path={'/CrudForm/:slug'}>
        <CrudFormEdit {...props} />
      </Route>
    </Switch>
  )

  
 
}
