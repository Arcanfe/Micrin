import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Icon } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import ModalBodyRegistroVenta from './ModalBodyRegistroVenta/ModalBodyRegistroVenta';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation} from 'react-router-dom';

type formProps = {
    pase: any
}

const PrecioVenta: React.FC<formProps> = (props: formProps) => {

    const config = {
        headers: props.pase
    }

    const [selectObj, setSelectObj] = useState('');

    const [openIngredient, setOpenIngredient] = useState(false); 
    const [operacion, setOperacion] = useState('');
    const [titleRegister, setTitleRegister] = useState('');

    const[register, setRegister] = useState<any[]>([]);

    useEffect(() => {
        axios.get('https://inventario-services.herokuapp.com/invservice/registro_venta/all', config)
        .then(result => {
            console.log('salida de ingr');
            console.log(result);
            console.log(result.data);
            setRegister(result.data);
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
        setTitleRegister('Crear registro de venta');
        handleOpen();
    }

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

export default PrecioVenta;