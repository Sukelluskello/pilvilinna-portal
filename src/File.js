import React from 'react';
import { ListGroup, Badge, Button } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFile} from '@fortawesome/free-solid-svg-icons';
import {faFile as faFileOpened} from '@fortawesome/free-regular-svg-icons';


const File = (props) =>{
    const item = props.item;
    var selected = false;
    if(props.selectedItem)
    {
        if(props.selectedItem.id === item.id)
        {
            selected = true;
        }
    }

    return (
    <ListGroup.Item className="py-1 border-0"> 
        {selected?<FontAwesomeIcon icon={faFileOpened} />:<FontAwesomeIcon icon={faFile} />}
        <Button variant="link" className="my-0 py-0" onClick={()=>{props.setSelectedItem(item);props.setAction("View");}}>
        {item.name}
        </Button>
        {item.isNew?<Badge className="mx-2">uusi</Badge>:null}
    </ListGroup.Item>);
}

export default File;