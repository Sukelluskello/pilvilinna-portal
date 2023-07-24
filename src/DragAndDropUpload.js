import React, { useCallback } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';

const API=process.env.REACT_APP_API_URL;

const DragAndDropUpload = (props) => {
  const onDrop = useCallback((event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    const data = new FormData();
    for(let i = 0; i < files.length; i++) {
      data.append('file' + i, files[i]);
    }

    const metadata = {
        folder: props.folder,
        note: ''
      };

    const token = localStorage.getItem("token");
    const headers = {'X-Token': token};
    data.append('metadata', JSON.stringify(metadata));
    // Upload files
    axios.post(API+'/files.php', data,{headers: headers,})
      .then(response => {
        console.log(response);
        props.Update();
      })
      .catch(error => {
        console.log(error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const fileInputRef = React.createRef();

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFilesAdded = (event) => {
    const files = event.target.files;
    const data = new FormData();
    for(let i = 0; i < files.length; i++) {
      data.append('file' + i, files[i]);
    }
    const metadata = {
        folder: props.folder,
        note: ''
      };
      data.append('metadata', JSON.stringify(metadata));
    // Upload files
    const token = localStorage.getItem("token");
    const headers = {'X-Token': token};
    axios.post(API+'/files.php', data,{headers: headers,})
      .then(response => {
        console.log(response);
        props.Update();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Card variant="secondary" className="my-2"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={openFileDialog}
      style={{ height: '200px', cursor: 'pointer' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={onFilesAdded}
      />
      <Card.Header>Tiedostojen lähetys:</Card.Header>
      <Card.Body>
        
        <Card.Text>Paina tästä tai raahaa tiedosto tähän.</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DragAndDropUpload;
