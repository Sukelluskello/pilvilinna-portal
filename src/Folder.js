import React from 'react';
import { ListGroup, Badge, Button } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFolder, faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import File from './File';

export const DisplayItem = (props) =>{
    const item = props.item;
    if(item.type === "folder")
    {
      return(<Folder {...props}/>);
    }
    else
    {
      return(<File {...props}/>)
    }
  }

const Folder = (props) =>{
    const item = props.item;
    var selected = false;
    if(props.selectedItem){
        if(props.selectedItem.id === item.id)
        {
            selected=true;
        }
    }
    return(
        <div>
            <ListGroup.Item className="py-1 border-0">
                {selected?<FontAwesomeIcon icon={faFolderOpen} className="py-0"/>:<FontAwesomeIcon icon={faFolder} className="py-0"/>}
                <Button variant="link" className="my-0 py-0 mx-2" onClick={()=>{props.setSelectedItem(item);props.setAction("View");}}>{item.name}</Button>
                {/*<Badge className="mx-2 float-right badge-light " pill>{item.children?item.children.length:0}</Badge>*/}
                {item.isNew?<Badge className="float-right">uusi</Badge>:null}
            </ListGroup.Item>
            <ListGroup className="ms-4 border-0">
                {item.children?item.children.map(children => (
                    <DisplayItem item={children} key={children.id} selectedItem={props.selectedItem} setSelectedItem={props.setSelectedItem} setAction={props.setAction}/>
                )
                ):null}
            </ListGroup>
        </div>
    );
}

export default Folder;