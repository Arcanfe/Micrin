import React, { useState } from 'react';
import { Button, Form, Container, Segment } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import validadorCorreo from '../Compartido/ValidadorCorreo';
import { toast } from 'react-toastify';


/**
 * Funcion que almacena la página donde el usuario podrá recuperar su cuenta.
 */
const RecuperarCuenta: React.FC<{}> = () => {

    const [correo, setCorreo] = useState('');
    const [confirm, setConfirm] = useState(false);

    const actualizarCorreo = (e:any) => {
        setCorreo(e.target.value);
    }

    const recuperarCuenta = () => {
        try{
            if(validadorCorreo(correo) === true){
                axios.post('https://micrin-login-service.herokuapp.com/recuperar?email=' + correo);
                setConfirm(true);
            }
            else{
                toast.error('Por favor ingresa un correo válido.');
            }
        }
        catch(error){
            console.log(error);
            toast.error('Ha ocurrido un error inesperado. Por favor intenta mas tarde.');
        }
        

    }

    return(
        <div>
            <h1>Recuperar Cuenta</h1>
            <Container placeholder>
                <Segment>
                <Form>
                    <Form.Field>
                        <label>Correo</label>
                        <input placeholder='Ingresa tu correo' onChange={actualizarCorreo} />
                        <Button type='submit' onClick={recuperarCuenta}>Enviar</Button>
                    </Form.Field>
                    <Form.Field>
                        <Segment>
                            <p>
                                En caso de tener una cuenta cerrada durante al menos 60 días, Micrin permitirá
                                volver a recuperar la cuenta existente, de manera que al correo ingresado
                                (el correo relacionado al restaurante), se le mandará un mensaje con los pasos
                                a seguir.    
                            </p>
                        </Segment>
                    </Form.Field>
                    <Link to='/'>
                        <Button type='submit'>Volver</Button>
                    </Link>
                </Form>
                </Segment>
            </Container>

            <Modal show={confirm}>
                <Modal.Header closeButton>
                <Modal.Title>Estás a unos pasos de recuperar tu cuenta!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Al correo ingresado, hemos enviado un mensaje con los pasos a seguir.
                </Modal.Body>
                <Modal.Footer>
                    <Link to="/">
                        <Button variant="secondary" onClick={() => setConfirm(false)}>
                            Volver
                        </Button>
                    </Link>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RecuperarCuenta;