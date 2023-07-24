import React  from 'react';
import { Alert, ListGroup, Spinner, Button } from 'react-bootstrap';
import {DisplayItem} from './Folder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faFolder, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

const FileSystem = (props) =>{
  
  if(props.error!=null)
  {
    return(<Alert variant='danger'>{props.error}</Alert>);
  }

  if(props.data==null)
  {
    return(<Spinner/>)
  }
  return(
      <ListGroup className="mx-0 px-0">
        <div>Tiedostojärjestelmä
          <Button className="mx-1 btn-sm p-0 px-2 text-right" onClick={()=>{props.Update();}}><FontAwesomeIcon icon={faArrowsRotate}/></Button>
        </div>
        <ListGroup.Item className="py-1 border-0">
                {props.selectedItem===null?<FontAwesomeIcon icon={faFolderOpen} className="py-0"/>:<FontAwesomeIcon icon={faFolder} className="py-0"/>}
                <Button variant="link" className="my-0 py-0 mx-2" onClick={()=>{props.setSelectedItem(null);props.setAction("View");}}>(root)/</Button>
                {props.data.map(item => (
                <DisplayItem item={item} key={item.id} selectedItem={props.selectedItem} setSelectedItem={props.setSelectedItem} setAction={props.setAction}/>
                ))}
        </ListGroup.Item>
        
      </ListGroup>
  );
}

export default FileSystem;