import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login'; // assuming you have a Login component
import { Container,Row,Col, Navbar, Button, Alert } from 'react-bootstrap';
import './App.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCloudSun} from '@fortawesome/free-solid-svg-icons';
import FileSystem from './FileSystem';
import Action from './Action';

const API=process.env.REACT_APP_API_URL;



const App = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [username, setUsername] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [action, setAction] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(1);

  const Logout = () =>{
    setUsername(null);
    setSelectedItem(null);
    setAction(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  }

  const UpdateData = () =>{
    setUpdate(update+1);
  }

  useEffect(() => {
    // Check API status
    axios.get(API+'/status.php')
      .then(response => {
        setApiStatus(response.data.message);
      })
      .catch(error => {
        console.error('Error checking API status', error);
        setApiStatus('Error checking API status');
      });

    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (username) {
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token==null)
    {
      return (<Alert variant="danger">Missing API token</Alert>);
    }
    const headers = {'X-Token': token};
    axios.get(API+`/files.php`,{headers}).then(response =>{
      setData(response.data);
      setError(undefined);
    }).catch(error => {
      console.log("files fetch error", error);
      setError(error.message);
    });
  },[update]);

  if(!apiStatus)
  {
    return (<div>Checking API...</div>);
  }
  if(username)
  {
    return (
    <Container fluid className="bg-dark" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar expand="lg" className="bg-dark text-light" style={{width: '100%'}}>
        <Container fluid className="">
          <Navbar.Brand href="#" className="text-light" onClick={(event)=>{event.preventDefault();setAction(null);setSelectedItem(null);}}><FontAwesomeIcon icon={faCloudSun} />Pilvilinna</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Navbar.Text className="text-light">Kirjautunut käyttäjä: {username}</Navbar.Text>
            <Button className='mx-4' onClick={()=>{Logout();}}>Kirjaudu ulos</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Row className="bg-lighttext-dark" style={{ flex: 1 }} >
        <Col md="2" className="bg-dark text-light" style={{overflowY: 'scroll'}}>
          <FileSystem setSelectedItem={setSelectedItem} selectedItem={selectedItem} data={data} error={error} action={action} setAction={setAction} Update={UpdateData}/>
        </Col>
        <Col md="10" className="bg-light text-dark">
          <Action selectedItem={selectedItem} setSelectedItem={setSelectedItem} action={action} setAction={setAction} data={data} Update={UpdateData}/>
        </Col>
      </Row>
    </Container>);
  }
  else
    return(
      <Login onLogin={setUsername} Text="Kirjaudu"/>
    );
};

export default App;
