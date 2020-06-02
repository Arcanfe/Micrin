import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Icon } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import ModalBodyPlatos from './ModalBodyPlatos/ModalBodyPlatos';
import ModalBodyCrearReceta from './ModalBodyPlatos/ModalBodyCrearReceta';
import ModalBodyUpdateReceta from './ModalBodyPlatos/ModalBodyUpdateReceta';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type formProps = {
    pase: any
}

const Platos: React.FC<formProps> = (props: formProps) => {

    const config = {
        headers: props.pase
    }

    const [selectObj, setSelectObj] = useState('');
    const [operacion, setOperacion] = useState('');
    const [operacionReceta, setOperacionReceta] = useState('');
    const [titleDish, setTitleDish] = useState('');
    const [titleReceta, setTitleReceta] = useState('');
    const [openIngredient, setOpenIngredient] = useState(false);  
    const [openDelete, setOpenDelete] = useState(false);
    const [openReceta, setOpenReceta] = useState(false);



    const[menu, setMenu] = useState<any[]>([]);

    useEffect(() => {
        axios.get('https://inventario-services.herokuapp.com/invservice/plato/all', config)
        .then(result => {
            console.log('salida de ingr');
            console.log(result);
            console.log(result.data);
            setMenu(result.data);
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
        setTitleDish('Crear plato');
        handleOpen();
    }

    const handleUpdateOpen = (e:any) => {
        setSelectObj(e);
        setOperacion('Modificar');
        setTitleDish('Modificar plato');
        handleOpen();
    }

    const handleViewOpen = (e:any) => {
        setSelectObj(e);
        setOperacion('Ver');
        setTitleDish('Ver detalles del plato');
        handleOpen();
    }

    const handleOpenDelete = (e:any) => {
        setSelectObj(e);
        setOpenDelete(true)
    }

    const handleCloseDelete = () => {
        setOpenDelete(false);
    }

    const handleDeleteFinally = (e:any) => {
        // Operacion de delete
        axios.post('https://inventario-services.herokuapp.com/invservice/plato/delet?codigo=' + selectObj, '', config)
        .then(res => {
            console.log(res);
            window.location.reload();
            toast.info('Se ha eliminado el plato exitosamente. Por favor recarga la página para ver los cambios.');
        }).catch(error => {
            console.log(error.response);
        });
        
        setOpenDelete(false);
    }

    const handleCreateOpenReceta = (e:any) => {
        setSelectObj(e);
        setTitleReceta('Añadir ingrediente a plato');
        setOperacionReceta('Crear');
        setOpenReceta(true);
    }

    const handleUpdateOpenReceta = (e:any) => {
        setSelectObj(e);
        setTitleReceta('Modificar ingredientes de receta');
        setOperacionReceta('Modificar');
        setOpenReceta(true);
    }

    const handleCloseReceta = () => {
        setOpenReceta(false);
    }

    return(
        <div>
            <ToastContainer draggable={false} transition={Zoom} autoClose={8000}/>
            <Container raised >
                <h1>
                    Menu
                </h1>
            </Container>
            <h5>
                Tus platos dentro del sistema son:
            </h5>
            <Table fixed >
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                    <Table.HeaderCell>Valor</Table.HeaderCell>
                    <Table.HeaderCell>Acciones generales</Table.HeaderCell>
                    <Table.HeaderCell>Acciones receta</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                {menu.map(mn => 
                    <Table.Row key={mn.codigo}>
                    <Table.Cell>{mn.nombre}</Table.Cell>
                    <Table.Cell>{mn.costo}</Table.Cell>
                    <Table.Cell>
                        <Button icon onClick={() => {handleViewOpen(mn.codigo)}}>
                            <Icon name='eye' />
                        </Button>
                        <Button icon onClick={() => {handleUpdateOpen(mn.codigo)}}>
                            <Icon name='refresh' />
                        </Button>
                        <Button icon onClick={() => {handleOpenDelete(mn.codigo)}}>
                            <Icon name='trash' />
                        </Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button icon onClick={() => {handleCreateOpenReceta(mn.codigo)}}>
                            <Icon name='plus' />
                        </Button>
                        <Button icon onClick={() => {handleUpdateOpenReceta(mn.codigo)}}>
                            <Icon name='refresh' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
                )}
                </Table.Body>
            </Table>
            <Container>
                <Button onClick={handleCreateOpen}>
                    Agregar plato
                </Button>
            </Container>

            <Modal show={openIngredient} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                    {titleDish}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalBodyPlatos typeOperation={operacion} handleSubmit={handleClose} objectS={selectObj} tok={props.pase}></ModalBodyPlatos>
                </Modal.Body>
            </Modal>

            <Modal show={openDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                <Modal.Title>Eliminar plato</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea eliminar este plato?
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

            <Modal show={openReceta} onHide={handleCloseReceta}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {titleReceta}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        operacionReceta === 'Crear'?
                            <ModalBodyCrearReceta handleSubmit={handleCloseReceta} objectS={selectObj} tok={props.pase}></ModalBodyCrearReceta>
                        :
                            <ModalBodyUpdateReceta handleSubmit={handleCloseReceta} objectS={selectObj} tok={props.pase}></ModalBodyUpdateReceta>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Platos;