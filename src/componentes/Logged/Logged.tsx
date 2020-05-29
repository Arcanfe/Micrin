import React, { useState, useEffect } from 'react';
import { Link, useLocation} from 'react-router-dom';
import { Menu, Button, Input } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import axios from 'axios';

import Home from './Home/Home';
import Ingredientes from './Ingredientes/Ingredientes';
import Platos from './Platos/Platos';
import RegistroVenta from './RegistroVenta/RegistroVenta';
import PrecioMercado from  './PrecioMercado/PrecioMercado';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import validadorNit from '../Compartido/ValidadorNit';

/**
 * Funcion que almacena las páginas de contenido de la aplicación.
 * Alterna los componentes que tendrá la página cuando el usuario inicie sesión.
 * Lo único que se mantiene de la 'página', es el menú superior, el cual será común para cambiar de página.
 */
const Logged: React.FC<{}> = () => {

    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [eliminado, setEliminado] = useState(false);  
    const [pagina, setPagina] = useState('Home');
    const [nit, setNit] = useState('');

    const config = {
        headers: location.state
    }

    useEffect(() => {
            console.log(location.state);
    }, [location.state]);

    const handleOpen = () => {
        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false);
    }

    const paginaHome = () => {
        setPagina('Home');
    }

    const paginaStock = () => {
        setPagina('Stock');
    }

    const paginaPlatos = () => {
        setPagina('Platos');
    }
 
    const paginaRegVent = () => {
        setPagina('RegVent');
    }

    const paginaMercado = () => {
        setPagina('Market');
    }

    const actualizarNit = (e: any) => {
        setNit(e.target.value);
    }
    const eliminarCuenta = () => {
        try{
            if(validadorNit(nit) === true){
                console.log(config);
                axios.post('https://micrin-login-service.herokuapp.com/delete?nit=' + nit,'', config)
                .then(() => {
                    setOpen(false);
                    setEliminado(true);
                })
                .catch(() => {
                    toast.error('Un error inesperado ha surgido, por favor intente más tarde.');
                });
            }
            else{
                toast.error('Por favor, ingrese un NIT válido.');
                setNit('');
            }
                
        }
        catch(error){
            console.log(error);
            toast.error('Un error inesperado ha surgido, por favor intente más tarde.');
            setNit('');
        }
        
    }

    return(
        <div>
            <Menu pointing secondary >
                <Menu.Menu position='left'>
                    <Menu.Item onClick={paginaHome}
                        name='Inicio'
                    />
                    <Menu.Item onClick={paginaStock}
                        name='Ingredientes'
                    />
                    <Menu.Item onClick={paginaPlatos}
                        name='Platos'
                    />
                    <Menu.Item onClick={paginaRegVent}
                        name='Registrar venta'
                    />
                    <Menu.Item onClick={paginaMercado}
                        name='Precio del mercado'
                    />
                </Menu.Menu>
                <Menu.Menu position='right'>
                    
                    <Menu.Item 
                        name='Eliminar cuenta'
                        onClick={handleOpen}
                    />
                    <Link to='/'>
                        <Menu.Item
                            name='Cerrar sesión'
                        />
                    </Link>
                </Menu.Menu>
            </Menu>

            {pagina === 'Home' ?
                <Home pase={location.state}/>
                :
                <div />
            }
            {pagina === 'Stock' ?
                <Ingredientes pase={location.state}/>
                :
                <div />
            }
            {pagina === 'Platos' ?
                <Platos pase={location.state}/>
                :
                <div />
            }
            {pagina === 'RegVent' ?
                <RegistroVenta pase={location.state}/>
                :
                <div />
            }
            {pagina === 'Market' ?
                <PrecioMercado />
                :
                <div />
            }

            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Eliminar cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea eliminar su cuenta?
                    Para confirmar, por favor ingrese el NIT de su local en el siguiente espacio:
                    <Input placeholder='NIT' onChange={actualizarNit} value={nit}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={eliminarCuenta}>
                        Eliminar
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Eliminar cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea eliminar su cuenta?
                    Para confirmar, por favor ingrese el NIT de su local en el siguiente espacio:
                    <Input placeholder='NIT' onChange={actualizarNit} value={nit}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={eliminarCuenta}>
                        Eliminar
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={eliminado}>
                <Modal.Header closeButton>
                <Modal.Title>Eliminar cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Su cuenta ha sido eliminada con éxito.
                </Modal.Body>
                <Modal.Footer>
                    <Link to='/'>
                        <Button variant="secondary">
                            Continuar
                        </Button>
                    </Link>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Logged;

Logged.propTypes = {
    /**
     * Variable de caracteres que contine el token recibido al iniciar sesión.
     * Este token define la identidad del restaurante mientrar dura la sesión y será un parámetro obligatorio para el resto de las acciones.
     */
    location: PropTypes.string,
    /**
     * Variable booleano con el cual se define si se abre o se cierra la ventana emergente para eliminar una cuenta.
     */
    open: PropTypes.bool,
    /**
     * Variable string que contiene el nombre de la página que se mostrará.
     * Este valor varía según la opción del menú que se elija.
     */
    pagina: PropTypes.string,
    /**
     * Función que modifica el valor 'open' a verdadero.
     * Se activa cuando el usuario selecciona la opción de 'eliminar cuenta'
     */
    handleOpen: PropTypes.func,
    /**
     * Función que modifica el valor 'open' a falso.
     * Cierra/mantiene cerrada la ventana emergente.
     */
    handleClose: PropTypes.func,
    /**
     * Función que modifica el valor de 'página'. Hace que se abra el componente 'Home'
     */
    paginaHome: PropTypes.func,
    /**
     * Función que modifica el valor de 'página'. Hace que se abra el componente 'PrecioMercado'
     */
    paginaMercado: PropTypes.func,
    /**
     * Función que modifica el valor de 'página'. Hace que se abra el componente 'Platos'
     */
    paginaPlatos: PropTypes.func,
    /**
     * Función que modifica el valor de 'página'. Hace que se abra el componente 'RegistroVenta'
     */
    paginaRegVent: PropTypes.func,
    /**
     * Función que modifica el valor de 'página'. Hace que se abra el componente 'Ingredientes'
     */
    paginaStock: PropTypes.func
}