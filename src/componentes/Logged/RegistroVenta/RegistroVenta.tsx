import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Icon } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import ModalBodyRegistroVenta from './ModalBodyRegistroVenta/ModalBodyRegistroVenta';
import axios from 'axios';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Objeto que establece las propiedades o variables que recibira el componente
 * pase: Token de acceso para realizar las peticiones
 */
type formProps = {
    pase: any
}

/**
 * Funcion que almacena la 'página' de Registro de ventas de la aplicación, una vez el usuario se ha logueado.
 * Este componente recibe como parámetro el token de permiso para realizar las distintas peticiones.
 */
const RegistroVenta: React.FC<formProps> = (props: formProps) => {
    /**
     * Variable que arma el formato del 'header' con el token para realizar las peticiones
     */
    const config = {
        headers: props.pase
    }
    /**
     * Variable que almacena el codigo del registrio seleccionado para mandarlos a los componentes que tiene como parametro
     */
    const [selectObj, setSelectObj] = useState('');
    /**
     * Variable booleana que define la apertura del modal para crear o ver un registro de venta
     */
    const [openIngredient, setOpenIngredient] = useState(false); 
    /**
     * Variable string que define la operacion que se realizara
     */
    const [operacion, setOperacion] = useState('');
    /**
     * Variable string que define el titulo del modal
     */
    const [titleRegister, setTitleRegister] = useState('');
    /**
     * Array que establece la lista de registros del sistema
     */
    const[register, setRegister] = useState<any[]>([]);

    /**
     * Funcion inicial que carga todos los registros de venta para mostrarlos.
     * Los registro se almacenaran en la variable register
     */
    useEffect(() => {
        axios.get('https://inventario-services.herokuapp.com/invservice/registro_venta/all', config)
        .then(result => {
            console.log('salida de ingr');
            console.log(result);
            console.log(result.data);
            setRegister(result.data);
        }).catch(console.log);
    },[]);
    /**
     * Funcion que modifica la variable 'openIngredient' a true
     */
    const handleOpen = () => {
        setOpenIngredient(true);
    }
    /**
     * Funcion que modifica la variable 'openIngredient' a false
     */
    const handleClose = () => {
        setOpenIngredient(false);
    }
    /**
     * Funcion que inicializa la operacion para crear un nuevo registro de venta
     * Establece la variable 'operacion' como crear.
     * Modifica el titulo del modal
     * Ejecuta la funcion 'handleOpen'
     */
    const handleCreateOpen = () => {
        setOperacion('Crear');
        setTitleRegister('Crear registro de venta');
        handleOpen();
    }
    /**
     * Funcion que inicializa la operacion para ver un registro de venta
     * Establece la variable 'operacion' como ver.
     * Modifica el titulo del modal
     * Ejecuta la funcion 'handleOpen'
     */
    const handleViewOpen = (e:any) => {
        setSelectObj(e);
        setOperacion('Ver');
        setTitleRegister('Ver detalles de registro de venta');
        handleOpen();
    }

    return(
        <div>
            <ToastContainer draggable={false} transition={Zoom} autoClose={8000}/>
            <Container raised >
                <h1>
                    Registros de ventas
                </h1>
            </Container>
            <h5>
                Tus ventas realizadas son:
            </h5>
            <Table fixed >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Fecha</Table.HeaderCell>
                        <Table.HeaderCell>Mesa</Table.HeaderCell>
                        <Table.HeaderCell>Valor total</Table.HeaderCell>
                        <Table.HeaderCell>Acciones</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                {register.map(rv => (
                    <Table.Row key={rv.codigo}>
                        <Table.Cell>{rv.fecha}</Table.Cell>
                        <Table.Cell>{rv.numero_mesa}</Table.Cell>
                        <Table.Cell>{rv.precio_total}</Table.Cell>
                        <Table.Cell>
                            <Button icon onClick={() => {handleViewOpen(rv.codigo)}}>
                                <Icon name='eye' />
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
                
                </Table.Body>
            </Table>
            <Container>
                <Button onClick={handleCreateOpen}>
                    Agregar registro de venta
                </Button>
            </Container>

            <Modal show={openIngredient} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                    {titleRegister}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalBodyRegistroVenta typeOperation={operacion} handleSubmit={handleClose} objectS={selectObj} tok={props.pase}></ModalBodyRegistroVenta>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default RegistroVenta;