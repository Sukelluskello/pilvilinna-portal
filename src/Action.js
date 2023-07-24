import { faFile, faFileArrowUp, faFolder, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import DragAndDropUpload from './DragAndDropUpload';

const API=process.env.REACT_APP_API_URL;

function findItemById(data, id) {
    for (let item of data) {
      if (item.id === id) {
        return item;
      }
      if (item.children.length) {
        let result = findItemById(item.children, id);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }


const Action = (props) =>{

    switch(props.action)
    {
        case "NewFolder":
            return(<NewFolder {...props}/>);
        case "NewFile":
            return(<div>New File</div>);
        case "View":
            return(<View {...props}/>);
        default:
            return(<Welcome {...props}/>)
    }
}

const View = (props) =>{
    if(props.selectedItem===null)
    {
        return <ViewFolder {...props}/>
    }
    if(props.selectedItem.type==="folder")
    {
        return <ViewFolder {...props}/>
    }
    return(<ViewFile {...props}/>);
}

const DeleteItem = (item, setMessage, setError, Update) =>{
    const token = localStorage.getItem("token");
    if(token==null)
    {
        setError("Virhe: API-avain puuttuu!");
        return;
    }
    const headers = {'X-Token': token};
    var endpoint = "/files.php";
    if(item.type==="folder")
        endpoint = "/folder.php";
    axios.delete(API+endpoint,{
        headers: headers,
        data: item
        }
    ).then(response =>{
        setMessage(response.data.message);
        Update();
    }).catch(error => {
      setError("Virhe: "+error);
    });
}

const ViewFolder = (props) =>{
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    var item = null;
    if(props.selectedItem)
        item = findItemById(props.data, props.selectedItem.id);
    return(
        <Container fluid>
            {message?<Alert className="my-2" variant="primary">{message}</Alert>:null}
            {error?<Alert className="my-2" variant="danger">{error}</Alert>:null}
            <Row className="my-2">
                <Col>
                    <h4>{item?item.name:"Juurikansio"}</h4>
                    <DragAndDropUpload folder={item} {...props}/>
                    <Button className="mr-2" onClick={()=>{props.setAction("NewFolder")}}>Luo uusi kansio</Button>
                    {item?
                        <Button className="ms-2" variant="danger" onClick={()=>{DeleteItem(item, setMessage, setError, props.Update)}}>Poista kansio</Button>
                    :null}
                    <h4 className="my-4">Kansion sisältö:</h4>
                    {item?item.children.map(child => (
                        <ViewFolderContent item={child} key={child.id} {...props}/>
                    )):
                        props.data.map(child =>(
                            <ViewFolderContent item={child} key={child.id} {...props}/>
                        ))
                    }
                </Col>
            </Row>
        </Container>
    );
}

const ViewFolderContent = (props) =>{
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    return (
        <Card className="my-2">
            {message?<Alert className="my-2" variant="primary">{message}</Alert>:null}
            {error?<Alert className="my-2" variant="danger">{error}</Alert>:null}
            <Card.Header><FontAwesomeIcon className="mx-2" icon={props.item.type==="folder"?faFolder:faFile}/> {props.item.name}</Card.Header>
            <Card.Body><div dangerouslySetInnerHTML={{__html: props.item.note}}/></Card.Body>
            <Card.Footer>
                {props.item.type!=="folder"?<Button href={API+props.item.location} target="_blank" download={props.item.name} className="mr-2">Lataa tiedosto</Button>:null}
                <Button variant="danger" className="mx-2" onClick={()=>{DeleteItem(props.item, setMessage, setError, props.Update)}}>Poista</Button>
            </Card.Footer>
        </Card>
    );
}

const ViewFile = (props) => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const item = props.selectedItem;
    const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'].includes(item.type);
    const isText = ['text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json', 'application/xml', 'text/csv', 'application/text'].includes(item.type);
    const isVideo = ['video/mp4', 'video/webm', 'video/ogg'].includes(item.type);
    const isPdf = 'application/pdf' === item.type;

    return (
    <Card className="m-4">
        {message?<Alert className="my-2" variant="primary">{message}</Alert>:null}
        {error?<Alert className="my-2" variant="danger">{error}</Alert>:null}
        <Card.Header>{item.name}</Card.Header>
        <Card.Body>
        {isImage ? (
            <img src={API+"/"+item.location} alt={item.name} className="img-fluid" />
        ) : isText ? (
            <iframe src={API+"/"+item.location} title={item.name} style={{width: '100%', height: '500px'}} />
        ) : isVideo ? (
            <video controls src={API+"/"+item.location} style={{width: '100%', height: 'auto'}} />
        ) : isPdf ? (
            <iframe src={API+"/"+item.location} title={item.name} style={{width: '100%', height: '500px'}} />
        ) : (
            <p>Unsupported file type: {item.type}</p>
        )}
        <hr/>
        <div dangerouslySetInnerHTML={{__html: item.note}}/>
        </Card.Body>

        <Card.Footer>
            <Button href={API+item.location} target="_blank" download={item.name} className="mr-2">Lataa tiedosto</Button>
            <Button variant="danger" className="mx-2" onClick={()=>{DeleteItem(item, setMessage, setError, props.Update)}}>Poista tiedosto</Button></Card.Footer>
    </Card>
    );
}

const Welcome = (props) =>{
    return(<Container fluid>
        <Row>
            <Col>
                <h2>Tervetuloa Pilvilinnaan!</h2>
                <p>Pilvilinna on digitaalinen turvapaikka, joka on suunniteltu erityisesti Kyberlinnan kaupungin asukkaille. Pilvilinna tarjoaa sinulle kätevän ja helppokäyttöisen tavan tallentaa tiedostojasi ja hallita niitä. Ei enää hukassa olevia papereita tai unohtuneita tiedostoja - Pilvilinnassa kaikki tarvitsemasi on aina ulottuvillasi, turvallisesti säilytettynä.</p>

                <p>Pilvilinna on paljon enemmän kuin vain tiedostonhallintapalvelu. Se on yhteisömme digitaalinen linna, joka yhdistää meitä kaikkia ja auttaa pitämään Kyberlinnan vahvana ja yhtenäisenä. Pilvilinna on suunniteltu sinulle. Käytä sitä hyödyksesi, koe sen tarjoamat mahdollisuudet ja osallistu yhteisömme digitaaliseen elämään. Tervetuloa mukaan!</p>
                <Button className="mx-2" onClick={()=>{props.setAction("NewFile")}}><FontAwesomeIcon icon={faFileArrowUp}/> Tuo uusi tiedosto</Button><Button className="mx" onClick={()=>{props.setAction("NewFolder")}}><FontAwesomeIcon icon={faFolderPlus}/>Luo uusi kansio</Button>
            </Col>
        </Row>
    </Container>);
}

const NewFolder = (props) =>{
    const [folderName, setFolderName] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Etsitään, mikä on valittu kansio
    var folder = null;
    if(props.selectedItem)
    {
        if(props.selectedItem.type==="folder")
            folder = props.selectedItem;
        else
        {
            var parentId = props.selectedItem.parent;
            folder = findItemById(props.data, parentId);
        }
    }

    const CreateFolder = () =>{
        const token = localStorage.getItem("token");
    if(token==null)
    {
        setError("Virhe: API-avain puuttuu!");
        return;
    }
    const headers = {'X-Token': token};
    var endpoint = "/folder.php";
    var parent = folder?folder.id:null;
    axios.post(API+endpoint,{
        "parent": parent,
        "name": folderName,
        "note": ""    
    },{headers: headers,}
    ).then(response =>{
        setMessage(response.data.message);
        setFolderName('');
        setError(null);
        props.Update();
    }).catch(error => {
      setError("Virhe: "+error);
    });
    };

    return(<Container fluid >
        <Row>
            <Col>
            {error?<Alert variant="danger" dismissible>{error}</Alert>:null}
            {message?<Alert variant="primary" dismissible>{message}</Alert>:null}
            <h2>Luo uusi kansio</h2>
                <Form>
                    <Form.Label>Kansio minne uusi kansio tehdään:{folder===null?"Juurikansio":folder.name}</Form.Label>
                    <Form.Group>
                        <Form.Label>Anna kansion nimi:</Form.Label>
                        <Form.Control type="text" placeholder="Kansion nimi" maxLength="24" onChange={(event)=>{setFolderName(event.target.value)}}/>
                    </Form.Group>
                    <Button className="mt-4" onClick={()=>{CreateFolder()}}>Tee uusi kansio</Button>
                </Form>
            </Col>
        </Row>
    </Container>);
}

export default Action;