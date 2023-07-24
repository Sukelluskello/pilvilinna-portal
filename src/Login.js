import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [register, setRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth.php`, {
        "username": username,
        "password": password,
      });

      if (response.data) {
        // save username to local storage
        localStorage.setItem('username', username);
        // save token to local storage
        localStorage.setItem('token', response.data.token);
        // call onLogin function passed in from parent component
        setError(undefined);
        onLogin(username);
      } else {
        if(response.data.message)
            setError(response.data.message);
        else
            setError("Tuntematon virhe");
      }
    } catch (error) {
      setError('An error occurred: '+error);
    }
  };

  const registerSubmit = async (e) =>{
    e.preventDefault();

    try{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/register.php`,{
            "username": username,
            "password": password
        });

        if(response.data)
        {
            setRegister(false);
        }
        else
        {
            setError("Tuntematon virhe!");
        }

    }catch (error)
    {
        setError('An error occurred: '+error);
    }
    setRegister(false);
  }

  if(register===false){
  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <h1 className="text-center mb-4"><FontAwesomeIcon icon={faCloudSun} />Pilvilinna</h1>
          <h3 className="text-center">Kirjaudu</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Käyttäjätunnus:</Form.Label>
              <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Salasana:</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit" className="mr-2 my-2">
              Kirjaudu
            </Button>
            <Button variant="secondary" className="m-2" onClick={()=>{setRegister(true)}}>
                Rekisteröidy
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Col>
      </Row>
    </Container>
  );
    }
    else
    {
        return(
        <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <h1 className="text-center mb-4"><FontAwesomeIcon icon={faCloudSun} />Pilvilinna</h1>
          <h3 className="text-center">Rekisteröidy</h3>
          <Form onSubmit={registerSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Valitse käyttäjätunnus:</Form.Label>
              <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Salasana:</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <Form.Label>Salasana (toisen kerran):</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit" className="mr-2 my-2">
              Rekisteröidy
            </Button>
            <Button variant="secondary" className="m-2" onClick={()=>{setRegister(false)}}>
                Peruuta
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Col>
      </Row>
    </Container>);
    }
};

export default Login;
