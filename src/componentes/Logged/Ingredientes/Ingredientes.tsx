import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Icon } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import ModalBodyIngredientes from './ModalBodyIngredientes/ModalBodyIngredientes';
import ModalBodyCrearPreparacion from './ModalBodyIngredientes/ModalBodyCrearPreparacion';
import ModalBodyUpdatePreparacion from './ModalBodyIngredientes/ModalBodyUpdatePreparacion';
import ModalBodyProducto from './ModalBodyIngredientes/ModalBodyProducto';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

/**
 * Objeto que establece las propiedades o variables que recibira el componente
 * pase: Token de acceso para realizar las peticiones
 */
type formProps = {
    pase: any
}

/**
 * Funcion que almacena la 'página' de ingredientes de la aplicación, una vez el usuario se ha logueado.
 * Este componente recibe como parámetro el token de permiso para realizar las distintas peticiones.
 */
const Ingredientes: React.FC<formProps> = (props: formProps) => {

    /**
     * Variable que arma el formato del 'header' con el token para realizar las peticiones
     */
    const config = {
        headers: props.pase
    }
    /**
     * Variable que guarda el código del ingrediente seleccionado para mandarlo a los subcomponentes de esta página (ModalBody...).
     */
    const [selectObj, setSelectObj] = useState('');
    /**
     * Variable que establece por medio de una palabra la accion que se desea hacer con un ingrediente al oprimir un botón.
     * Las acciones posibles son: 'Ver', 'Crear', 'Modificar'
     */
    const [operacion, setOperacion] = useState('');
    /**
     * Variable que establece por medio de una palabra la accion que se desea hacer con una preparación al oprimir un botón.
     * Las acciones posibles son: 'Crear', 'Modificar'
     */
    const [operacionPreparacion, setOperacionPreparacion] = useState('');
    /**
     * Variable booleana que define el momento en el que se abra el modal para Crear, ver o modificar un ingrediente.
     */
    const [openIngredient, setOpenIngredient] = useState(false);
    /**
     * Variable booleana que define el momento en el que se abra el modal para añadir o modificar la preparación a un ingrediente.
     */  
    const [openPreparacion, setOpenPreparacion] = useState(false);
    /**
     * Variable string que define el título del modal de ingredientes.
     */
    const [titleIngredient, setTitleIngredient] = useState('');
    /**
     * Variable string que define el título del modal de preparaciones.
     */
    const [titlePreparacion, setTitlePreparacion] = useState('');
    /**
     * Variable booleana que define el momento en el que se abra el modal para eliminar un ingrediente.
     */  
    const [openDelete, setOpenDelete] = useState(false);
    /**
     * Variable booleana que define el momento en el que se abra el modal para añadir un producto a un ingrediente.
     */  
    const [openProduct, setOpenProduct] = useState(false);
    /**
     * Arreglo que almacena la información de los ingredientes
     */  
    const[stock, setStock] = useState<any[]>([]);

    /**
     * Función que carga al iniciar el componente, todos los ingredientes de un usuario.
     */
    useEffect(() => {   
        console.log(props.pase);
        axios.get('https://inventario-services.herokuapp.com/invservice/stock/all', config)
        .then(result => {
            console.log('salida de ingr');
            console.log(result);
            console.log(result.data);
            setStock(result.data);
        }).catch(console.log);
    },[]);
    /**
     * Función que modifica el valor de 'openIngredient' a true. 
     */  
    const handleOpen = () => {
        setOpenIngredient(true);
    }
    /**
     * Función que modifica el valor de 'openIngredient' a false. 
     */  
    const handleClose = () => {
        setOpenIngredient(false);
    }
    /**
     * Función que inicia la operación de crear un nuevo ingrediente.
     * Modifica el título del modal y establece la operación en 'Crear'.
     * Además, acciona la función handleOpen
     */  
    const handleCreateOpen = () => {
        setOperacion('Crear');
        setTitleIngredient('Crear ingrediente');
        handleOpen();
    }
    /**
     * Función que inicia la operación de modificar un ingrediente.
     * Modifica el título del modal y establece la operación en 'Modificar'.
     * Se guarda el código del ingrediente seleccionado (valor que recibe de parámetro), y acciona la función handleOpen
     */  
    const handleUpdateOpen = (e:any) => {
        setSelectObj(e);
        setOperacion('Modificar');
        setTitleIngredient('Modificar ingrediente');
        handleOpen();
    }
    /**
     * Función que inicia la operación para ver un ingrediente.
     * Modifica el título del modal y establece la operación en 'Ver'.
     * Se guarda el código del ingrediente seleccionado (valor que recibe de parámetro), y acciona la función handleOpen
     */ 
    const handleViewOpen = (e:any) => {
        setSelectObj(e);
        setOperacion('Ver');
        setTitleIngredient('Ver detalles del ingrediente');
        handleOpen();
    }
    /**
     * Función que inicial la acción para eliminar un ingrediente.
     * @param e Código del ingrediente seleccionado
     */
    const handleOpenDelete = (e:any) => {
        setSelectObj(e);
        setOpenDelete(true);
    }
    /**
     * Funcion que modifica la variable 'openDelete' a falso
     */
    const handleCloseDelete = () => {
        setOpenDelete(false);
    }
    /**
     * Función que ejecuta el borrar un ingrediente. Además acciona la función handleCloseDelete
     * @param e Código del ingrediente seleccionado
     */
    const handleDeleteFinally = async (e:any) => {
        // Operacion de delete
        console.log(config);
        await axios.post('https://inventario-services.herokuapp.com/invservice/stock/delet?codigo=' + selectObj, '', config)
        .then(res => {
            toast.info('Se ha eliminado el ingrediente. Por favor, recargue la página para ver los cambios.');
        }).catch(error => {
            console.log(error);
            toast.error('Hay un error desconocido. Por favor intentar mas tarde.');
        });
        
        handleCloseDelete();
    }
    /**
     * Función que inicializa el proceso para añadir un nuevo producto de un ingrediente. 
     * Guarda el código del ingrediente con el que se trabajará, y modifica la variable 'openProduct' a true.
     * @param e Código del ingrediente seleccionado
     */
    const handleOpenProduct = (e:any) => {
        setSelectObj(e);
        setOpenProduct(true);
    }
    /**
     * Función que modifica el valor de la variable 'openProduct' a false
     */
    const handleCloseProduct = () => {
        setOpenProduct(false);
    }
    /**
     * Función que inicializa el proceso para añadir un ingrediente a una preparación.
     * Se guarda el código del ingrediente con el que se trabajará. 
     * Se modifica el título del modal con el que se trabajará.
     * Se indica el tipo de accion a realizar con 'preparaciones'. 
     * Se modifica la variable 'openPreparación' a true.
     * @param e Código del ingrediente seleccionado
     */
    const handleCreateOpenPreparacion = (e:any) => {
        setSelectObj(e);
        setTitlePreparacion('Añadir ingrediente a preparación');
        setOperacionPreparacion('Crear');
        setOpenPreparacion(true);
    }
    /**
     * Función que inicializa el proceso para modificar un ingrediente de una preparación.
     * Se guarda el código del ingrediente con el que se trabajará. 
     * Se modifica el título del modal con el que se trabajará.
     * Se indica el tipo de accion a realizar con 'preparaciones'. 
     * Se modifica la variable 'openPreparación' a true.
     * @param e Código del ingrediente seleccionado
     */
    const handleUpdateOpenPreparacion = (e:any) => {
        setSelectObj(e);
        setTitlePreparacion('Eliminar ingredientes de la preparación');
        setOperacionPreparacion('Modificar');
        setOpenPreparacion(true);
    }
    /**
     * Función que modifica la variable 'openPreparacion' a falso
     */
    const handleClosePreparacion = () => {
        setOpenPreparacion(false);
    }

    return(
        <div>
            <ToastContainer draggable={false} transition={Zoom} autoClose={8000}/>
            <Container raised >
                <h1>
                    Ingredientes
                </h1>
            </Container>
            <h5>
                Tus ingredientes dentro del sistema son:
            </h5>
            <Table fixed>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                    <Table.HeaderCell>Cantidad actual</Table.HeaderCell>
                    <Table.HeaderCell>Preparación</Table.HeaderCell>
                    <Table.HeaderCell>Acciones generales</Table.HeaderCell>
                    <Table.HeaderCell>Acciones preparaciones</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                {stock.map(st => (
                    <Table.Row key={st.codigo}>
                        <Table.Cell>
                            {st.nombre}
                        </Table.Cell>
                        <Table.Cell>
                            {st.cantidad_total}
                        </Table.Cell>
                        <Table.Cell>
                            {st.preparacion === false ? 'No' : 'Si'}
                        </Table.Cell>
                        <Table.Cell>
                            <Button icon onClick={() => {handleViewOpen(st.codigo)}}>
                                <Icon name='eye' />
                            </Button>
                            <Button icon>
                                <Icon name='plus square' onClick={() => {handleOpenProduct(st.codigo)}} />
                            </Button>
                            <Button icon onClick={() => {handleUpdateOpen(st.codigo)}}>
                                <Icon name='refresh' />
                            </Button>
                            <Button icon onClick={() => {handleOpenDelete(st.codigo)}}>
                                <Icon name='trash' />
                            </Button>
                        </Table.Cell>
                        <Table.Cell>
                        {
                            st.preparacion === true ?
                                <div>
                                    <Button icon onClick={() => {handleCreateOpenPreparacion(st.codigo)}}>
                                        <Icon name='plus' />
                                    </Button>
                                    <Button icon onClick={() => {handleUpdateOpenPreparacion(st.codigo)}}>
                                        <Icon name='refresh' />
                                    </Button>
                                </div>
                                :
                                <div></div>

                        }
                        </Table.Cell>
                    </Table.Row>   
                ))}
                </Table.Body>
            </Table>
            <Container>
                <Button onClick={handleCreateOpen}>
                    Agregar ingrediente
                </Button>
            </Container>

            <Modal show={openIngredient} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {titleIngredient}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalBodyIngredientes typeOperation={operacion} handleSubmit={handleClose} objectS={selectObj} tok={props.pase}></ModalBodyIngredientes>
                </Modal.Body>
            </Modal>

            <Modal show={openDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                <Modal.Title>Eliminar ingrediente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea eliminar el ingrediente?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteFinally}>
                        Eliminar
                    </Button>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openProduct} onHide={handleCloseProduct}>
                <Modal.Header closeButton>
                <Modal.Title>Ingresar producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalBodyProducto handleSubmit={handleCloseProduct} objectS={selectObj} tok={props.pase} />
                </Modal.Body>
            </Modal>

            <Modal show={openPreparacion} onHide={handleClosePreparacion}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {titlePreparacion}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        operacionPreparacion === 'Crear'?
                            <ModalBodyCrearPreparacion handleSubmit={handleClosePreparacion} objectS={selectObj} tok={props.pase}></ModalBodyCrearPreparacion>
                        :
                            <ModalBodyUpdatePreparacion handleSubmit={handleClosePreparacion} objectS={selectObj} tok={props.pase}></ModalBodyUpdatePreparacion>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Ingredientes;

Ingredientes.propTypes = {
    /**
     * Variable obligatoria para el desarrollo de las peticiones.
     * Se recibe por parámetro
     */
    pase: PropTypes.number.isRequired
}