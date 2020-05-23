import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap'; 
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InicioSesion: React.FC<{}> = () => {

    const [Authorization, setAuthorizarion] = useState('');
    const [success, setSucess] = useState(false);
    const [userLogin, setUserLogin] = useState({
        'nombre' : '',
        'password' : ''
    });
    const [log, setLog] = useState(true);
 
    useEffect(() => {
        console.log(Authorization);
    }, [Authorization]);

    const actualizarUser = (e: any)  => {
        setUserLogin({
            ...userLogin,
            [e.target.name]: e.target.value
        });
    }

    const sendInfo = () => {
        axios.post('https://micrin-login-service.herokuapp.com/login',  JSON.parse('{"nombre":"' + userLogin.nombre + '", "password":"' + userLogin.password + '"}') )
        .then(res => {
            console.log(res);
            console.log(res.data.Authorization);

            setAuthorizarion(res.data.Authorization);
            setLog(false);        
            handleOpen();
        }).catch(error => {
            cleanFields();
            toast.error('Usuario o contraseña erróneos por favor intentar de nuevo.');
            console.log(error.response)
        });
    }

    const handleOpen = () => {
        setSucess(true);
    }
    
    const handleClose = () => {
        setSucess(false);
    }
    
    const cleanFields = () => {
        setUserLogin({
            'nombre' : '',
            'password' : ''
        });
    }

    return(
        <div>
            <ToastContainer draggable={false} transition={Zoom} autoClose={8000}/>
            <h1>Iniciar sesión</h1>
            <Container placeholder>
                <Segment>
                <Form id='login'>
                    <Form.Field>
                        <label>Nombre local:</label>
                        <input placeholder='Ingresa tu local' name='nombre' onChange={actualizarUser} required value={userLogin.nombre}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Contraseña:</label>
                        <input placeholder='Ingresa tu contraseña' type='password' name='password' onChange={actualizarUser} required value={userLogin.password}/>
                    </Form.Field>

                    <Link to={{ pathname:'/init', state:{ Authorization } }}>
                        <Button type='submit' disabled={log}>Continuar</Button>
                    </Link>
                    <Button type='submit' onClick={sendInfo}>Comprobar ingreso</Button>
                </Form>
                </Segment>
            </Container>

            <Modal show={success} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Registro exitoso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Su local se ha creado exitosamente. Ahora puede iniciar sesión.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default InicioSesion;