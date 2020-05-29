import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap'; 
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

/**
 * Funcion que almacena la página de inicio de sesión a la aplicación.
 */
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

    const sendInfo = async () => {
        try{
            const logPoss = await axios.get('https://micrin-login-service.herokuapp.com/validate_user?nombre=' + userLogin.nombre);
            console.log(logPoss);
            if(logPoss.status === 200){
                axios.post('https://micrin-login-service.herokuapp.com/login',  JSON.parse('{"nombre":"' + userLogin.nombre + '", "password":"' + userLogin.password + '"}') )
                .then(res => {
                    //console.log(res);
                    setAuthorizarion(res.data.Authorization);
                    setLog(false);        
                    handleOpen();
                }).catch(error => {
                    cleanFields();
                    toast.error('Usuario o contraseña erróneos por favor intentar de nuevo.');
                    console.log(error.response)
                });
            }
            else{
                toast.error(logPoss.data);
                cleanFields();
            }
        }
        catch(error){
            console.log(error);
            toast.error('Su cuenta no se encuentra en el sistema. En caso de tener una, por favor asegurarse que ha verificado su correo antes de ingresar.');
        }
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

InicioSesion.propTypes = {
    /**
     * Variable que almacena el token a usar para realizar las acciones una vez iniciado sesión.
     * Este valor inicia vacío, pero se llena en la línea 39, cuando se hace la petición de iniciar sesión.
     */
    Authorization: PropTypes.string,
    /**
     * Variable booleana que va a definir si se abre la ventana emergente de inicio de sesión.
     */
    success: PropTypes.bool,
    /**
     * Objeto que almacena las credenciales del usuario cuando se loguea (nombre y contraseña).
     * Se usa estos valores en la petición de inicio de sesión.
     */
    userLogin: PropTypes.object,
    /**
     * Variable booleana que indica si se han reconocido las credenciales o no para habilitar el botón de continuar.
     */
    log: PropTypes.bool,
    /**
     * Función que modificará la variable userLogin cuando el usuario haga cambios en los inputs de la página.
     */
    actualizarUser: PropTypes.func,
    /**
     * Funcion que contiene la petición de la solicitud de inicio de sesión.
     * Se emplea la librería axios para el manejo de las peticiones a APIs externas.
     */
    sendInfo: PropTypes.func,
    /**
     * Funcion modifica el valor de la variable 'success' a verdadero
     */
    handleOpen: PropTypes.func,
    /**
     * Funcion modifica el valor de la variable 'success' a falso
     */
    handleClose: PropTypes.func,
    /**
     * Función que limpia los campos de inicio de sesión.
     */
    cleanFields: PropTypes.func
}