import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Icon, Input, Grid } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import ModalBodyIngredientes from './ModalBodyIngredientes/ModalBodyIngredientes';
import ModalBodyCrearPreparacion from './ModalBodyIngredientes/ModalBodyCrearPreparacion';
import ModalBodyUpdatePreparacion from './ModalBodyIngredientes/ModalBodyUpdatePreparacion';
import ModalBodyProducto from './ModalBodyIngredientes/ModalBodyProducto';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation} from 'react-router-dom';

type formProps = {
    pase: any
}

const Ingredientes: React.FC<formProps> = (props: formProps) => {

    const config = {
        headers: props.pase
    }

    const [selectObj, setSelectObj] = useState('');
    const [operacion, setOperacion] = useState('');
    const [operacionPreparacion, setOperacionPreparacion] = useState('');
    const [openIngredient, setOpenIngredient] = useState(false);  
    const [openPreparacion, setOpenPreparacion] = useState(false);  
    const [titleIngredient, setTitleIngredient] = useState('');
    const [titlePreparacion, setTitlePreparacion] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);
    
    const[stock, setStock] = useState<any[]>([]);

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

    const handleOpen = () => {
        setOpenIngredient(true);
    }
    
    const handleClose = () => {
        setOpenIngredient(false);
    }

    const handleCreateOpen = () => {
        setOperacion('Crear');
        setTitleIngredient('Crear ingrediente');
        handleOpen();
    }

    const handleUpdateOpen = (e:any) => {
        setSelectObj(e);
        setOperacion('Modificar');
        setTitleIngredient('Modificar ingrediente');
        handleOpen();
    }

    const handleViewOpen = (e:any) => {
        console.log('propied');
        console.log(e);
        setSelectObj(e);
        setOperacion('Ver');
        setTitleIngredient('Ver detalles del ingrediente');
        handleOpen();
    }

    const handleOpenDelete = (e:any) => {
        setSelectObj(e);
        setOpenDelete(true);
    }

    const handleCloseDelete = () => {
        setOpenDelete(false);
    }

    const handleDeleteFinally = (e:any) => {
        // Operacion de delete
        axios.delete('https://inventario-services.herokuapp.com/invservice/stock/delet?codigo=' + selectObj, config)
        .then(res => {
            console.log(res);
            window.location.reload();
            toast.info('se ha eliminado el ingrediente');
        }).catch(error => {
            console.log(error.response);
        });
        
        setOpenDelete(false);
    }

    const handleOpenProduct = (e:any) => {
        setSelectObj(e);
        setOpenProduct(true);
    }

    const handleCloseProduct = () => {
        setOpenProduct(false);
    }

    const handleCreateOpenPreparacion = (e:any) => {
        setSelectObj(e);
        setTitlePreparacion('Añadir ingrediente a preparación');
        setOperacionPreparacion('Crear');
        setOpenPreparacion(true);
    }

    const handleUpdateOpenPreparacion = (e:any) => {
        console.log(e);
        setSelectObj(e);
        setTitlePreparacion('Eliminar ingredientes de la preparación');
        setOperacionPreparacion('Modificar');
        setOpenPreparacion(true);
    }

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