import React, { useState, useEffect } from 'react';
import { Link, useLocation} from 'react-router-dom';
import { Menu, Button, Input } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 

import Home from './Home/Home';
import Ingredientes from './Ingredientes/Ingredientes';
import Platos from './Platos/Platos';
import RegistroVenta from './RegistroVenta/RegistroVenta';
import PrecioMercado from  './PrecioMercado/PrecioMercado';
import PropTypes from 'prop-types';

/**
 * Funcion que almacena las páginas de contenido de la aplicación.
 * Alterna los componentes que tendrá la página cuando el usuario inicie sesión.
 * Lo único que se mantiene de la 'página', es el menú superior, el cual será común para cambiar de página.
 */
const Logged: React.FC<{}> = () => {

    const location = useLocation();
    const [open, setOpen] = useState(false);  
    const [pagina, setPagina] = useState('Home');

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
                    <Input placeholder='NIT'/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Eliminar
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
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