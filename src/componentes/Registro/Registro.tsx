import React, { useState } from 'react';
import { Button, Checkbox, Form, Container, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap'; 
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorTelefono from '../Compartido/ValidadorTelefono';
import validadorNit from '../Compartido/ValidadorNit';
import validadorCorreo from '../Compartido/ValidadorCorreo';
import PropTypes from 'prop-types';

/**
 * Funcion de validacion que almacena la página de registro para nuevos usuarios/restaurantes
 */
const Registro: React.FC<{}> = () => {

    const [user, setUser] = useState({
        'nombre' : '',
        'direccion' : '',
        'telefono': '',
        'nit' : '',
        'email' : '',
        'password' : '',
        'passwordConf' : ''
    });

    const [success, setSucess] = useState(false);

    const actualizarUser = (e: any)  => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const sendInfo = () => {

        if(validarCampos() === true){
            axios.post('https://micrin-login-service.herokuapp.com/registro',  JSON.parse('{"nit":"' + user.nit + '", "nombre":"' + user.nombre + '", "email":"' + user.email + '", "direccion":"' + user.direccion + '", "telefono":"' + user.telefono + '", "password":"' + user.password + '"}') )
            .then(res => {
                console.log(res);
                console.log(res.data);
                handleOpen();
                toast.success('Se ha registrado tu local');
            }).catch(error => {
                console.log(error.response)
                toast.error('El NIT o el nombre del local ya existen dentro del sistema, por favor intentar con otro.');
            });
        }

        
    }

    function validarCampos() {
        if(camposLlenos()){
            if(validadorTelefono(user.telefono)){
                if(validadorNit(user.nit)){
                    if(validadorCorreo(user.email)){
                        if(user.password === user.passwordConf){
                            return true;
                        }
                        setUser({
                            ...user,
                            'password' : '',
                            'passwordConf' : ''
                        });
                        toast.error('Las contraseñas no coinciden. Por favor intente de nuevo');
                        return false;
                    }
                    setUser({
                        ...user,
                        'email' : ''
                    });
                    toast.error('Por favor ingresar un correo válido.');
                    return false;
                }
                setUser({
                    ...user,
                    'nit' : ''
                });
                toast.error('Por favor ingresar un NIT valido. Ingrese los numeros sin espacios, puntos o caracteres especiales.');
                return false;
            }
            setUser({
                ...user,
                'telefono' : ''
            });
            toast.error('Por favor ingresar un telefono valido.')
            return false;
        }
        toast.error('Por favor llenar todos los campos');
        return false;
    }

    function camposLlenos(){
        if(user.nombre !== '' && user.nit !== '' && user.email !== '' && user.direccion !== '' && user.telefono !== '' && user.password !== '' && user.passwordConf !== ''){
            return true;
        }
        return false;
    }

    const handleOpen = () => {
        setSucess(true);
    }
    
    const handleClose = () => {
        setSucess(false);
    }

    return(
        <div>
            <ToastContainer draggable={false} transition={Zoom} autoClose={8000}/>
            <h1>Registro</h1>
            <Container>
            <Segment>
            <Form>
                <Form.Field align='left'>
                    <label>Nombre del local</label>
                    <input placeholder='Nombre del local' name='nombre' onChange={actualizarUser} value={user.nombre}/>
                </Form.Field>
                <Form.Field align='left'>
                    <label>Dirección</label>
                    <input placeholder='Dirección' name='direccion' onChange={actualizarUser} value={user.direccion}/>
                </Form.Field>
                <Form.Field align='left'>
                    <label>Teléfono</label>
                    <input placeholder='Telefono' name='telefono' onChange={actualizarUser} value={user.telefono}/>
                </Form.Field>
                <Form.Field align='left'>
                    <label>NIT</label>
                    <input placeholder='NIT' name='nit' onChange={actualizarUser} value={user.nit}/>
                </Form.Field>
                <Form.Field align='left'>
                    <label>Correo</label>
                    <input placeholder='Correo' name='email' onChange={actualizarUser} value={user.email}/>
                </Form.Field>
                <Form.Field align='left'>
                    <label>Contraseña</label>
                    <input placeholder='Contraseña' name='password' type='password' onChange={actualizarUser} value={user.password}/>
                </Form.Field>
                <Form.Field align='left'>
                    <label>Confirmar contraseña</label>
                    <input placeholder='Confirmar contraseña' name='passwordConf' type='password' onChange={actualizarUser} value={user.passwordConf}/>
                </Form.Field>
                <Form.Field align='left'>
                    <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Link to='/'>
                    <Button type='submit'>Volver</Button>
                </Link>
                <Button type='submit' onClick={sendInfo}>Prueba</Button>
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

export default Registro;

Registro.propTypes = {
    /**
     * Objeto que almacena los datos del usuario en lo referente al local y a su cuenta
     */
    user: PropTypes.object,
    /**
     * Booleano que define cuando se abre o se cierra la ventana emergente de registro exitoso.
     * Este valor será verdadero cuando en el llamado de la petición, se realiza de manera exitosa.
     */
    success: PropTypes.bool,
    /**
     * Funcion que modifica la variable 'user', una vez que el usuario ingrese valores en los campos disponibles.
     */
    actualizarUser: PropTypes.func,
    /**
     * Funcion que contiene la peticion a realizar para el registro de un nuevo usuario.
     */
    sendInfo: PropTypes.func,
    /**
     * Funcion que se encarga de validar que los campos esten llenos y los valores tengan los pertinentes formatos.
     */
    validarCampos: PropTypes.func,
    /**
     * Funcion que valida que todos los campos esten llenos o que no estén en sus valores por defecto.
     */
    camposLlenos: PropTypes.func,
    /**
     * Funcion que modificará la variable success a verdadero, habilitando el mensaje de la ventana emergente.
     */
    handleOpen: PropTypes.func,
    /**
     * Función que modificará la variable success a falso, cerrando o impidiendo que se muestre la ventana emergente.
     */
    handleClose: PropTypes.func
}