import React, { useState, useEffect } from 'react';
import { Button, Container, Input, Grid } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';
import validadorFecha from '../../../Compartido/ValidadorFecha';
import ModalBodyVerPlatos from './ModalBodyVerPlatos';


type modalBodyFormProps = {
    typeOperation: any,
    handleSubmit: any,
    objectS: any,
    tok: any
}

const ModalBodyRegistroVenta: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const config = {
        headers: props.tok
    }

    const[regVentFecha, setRegVentFecha] = useState('');
    const[regVentMesa, setRegVentMesa] = useState('');
    const[regVentValor, setRegVentValor] = useState('');

    const[rvPlato, setRvPlato] = useState('');
    const[rvCantidad, setRvCantidad] = useState('');

    const[openCrearPlato, setOpenCrearPlato] = useState(false);
    
    const[agregadoMin, setAgregadoMin] = useState(false);
    const[platoEncontrado, setPlatoEncontrado] = useState(false);
    const[platoCodigo, setPlatoCodigo] = useState('');
    const[rvCodigo, setRvCodigo] = useState('');

    useEffect(() => {
        if(props.typeOperation !== 'Crear'){
            axios.get('https://inventario-services.herokuapp.com/invservice/registro_venta/getone?codigo=' + props.objectS, config)
            .then(result => {
                //console.log(result);
                setRegVentFecha(result.data.fecha);
                setRegVentMesa(result.data.numero_mesa);
                setRegVentValor(result.data.precio_total);
            }).catch(
            );            
        };
    },[]);

    const actualizarRegistroVentaFecha = (e: any) => {
        setRegVentFecha(e.target.value);
    }

    const actualizarRegistroVentaMesa = (e: any) => {
        setRegVentMesa(e.target.value);
    }

    const actualizarRegistroVentaValor = (e: any) => {
        setRegVentValor(e.target.value);
    }

    const actualizarRvPlato = (e: any) => {
        setRvPlato(e.target.value);
    }

    const actualizarRvCantidad = (e: any) => {
        setRvCantidad(e.target.value);
    }

    const nuevoPlato = () => {
        if(validarCampos() === true){
            handleOpenCrearPlato();
        }
        
    }

    const agregarPlato = () => {
        if(validarCamposPlato() === true){
            if(agregadoMin === false){
                createRegVent();
                setAgregadoMin(true);
            }
            createRVPlato();
            setRvPlato('');
            setRvCantidad('');
        }   
    }

    const finalizarRegVent = () => {
        if(validarCamposPlato() === true){
            if(agregadoMin === false){
                createRegVent();
                setAgregadoMin(true);
            }
            createRVPlato();
            handleCloseCrearPlato();
            props.handleSubmit();
        }
    }

    const createRVPlato = async () => {
        await obtenerInfoPlato();
            if(platoEncontrado === true){
                console.log('{"cod_rv":"' + rvCodigo + '", "cod_plato":"' + platoCodigo + '", "cantidad":"' + rvCantidad + '"}');
                axios.post('https://inventario-services.herokuapp.com/invservice/rv_plato/registro', JSON.parse('{"cod_rv":"' + rvCodigo + '", "cod_plato":"' + platoCodigo + '", "cantidad":"' + rvCantidad + '"}'), config)
                .then(result => {
                    console.log(result);
                    toast.success('El plato "' + rvPlato + '" se ha añadido a la preparacion');
                }).catch(result => {
                    console.log('error');

                    console.log(result);
                });
                props.handleSubmit();
            }
    }

    const obtenerInfoPlato = async () => {
        //URL por asignar de obtener plato por el nombre
        await axios.get('https://inventario-services.herokuapp.com/invservice/plato/getPlato/?nombre=' + rvPlato, config)
        .then(result => {
            console.log(result);
            setPlatoCodigo(result.data.codigo);
            setPlatoEncontrado(true);
            console.log(platoCodigo);
        }).catch(result => {
            console.log('error');
            toast.error('No se reconoce el plato. Por favor intente de nuevo.');
            console.log(result);
        });
    }

    const createRegVent = () => {
        console.log('entrada creacion rv');
        console.log('{"precio_total":' + regVentValor + ', "numero_mesa":' + regVentMesa + ', "fecha":"' + regVentFecha + '", "cod_local":"' + '161' + '"}');
        axios.post('https://inventario-services.herokuapp.com/invservice/registro_venta/registro',  JSON.parse('{"precio_total":' + regVentValor + ', "numero_mesa":' + regVentMesa + ', "fecha":"' + regVentFecha + '", "cod_local":"' + '161' + '"}'), config )
        .then(res => {
            console.log('creacion rv');
            console.log(res);
            setRvCodigo(res.data);
            toast.success('El registro se ha creado satisfactoriamente');
            //window.location.reload();
        }).catch(error => {
            console.log(error.response)
        });
        
        //props.handleSubmit();
    }

    function validarCampos(){
        if(camposLlenos()){
            if(validadorFecha(regVentFecha)){
                if(validadorNumero(regVentMesa)){
                    if(validadorNumero(regVentValor)){
                        return true;
                    }
                    setRegVentValor('');
                    toast.error('El campo "valor" debe ser numérico');
                    return false;
                }
                setRegVentMesa('');
                toast.error('El campo "mesa" debe ser numérico');
                return false;
            }
            setRegVentFecha('');
            toast.error('Ingrese una fecha válida. Por favor ingresar la fecha en formato "YYYY-MM-DD"');
            return false;
        }
        toast.error('Todos los campos deben ser llenados');
        return false;
    }

    function validarCamposPlato(){
        if(camposLlenosPlato()){
                if(validadorNumero(rvCantidad)){
                    return true;
                }
                setRvCantidad('');
                toast.error('El campo "cantidad" debe ser numérico');
                return false;
        }
        toast.error('Todos los campos deben ser llenados');
        return false;
    }

    const handleOpenCrearPlato = () => {
        setOpenCrearPlato(true);
    }

    const handleCloseCrearPlato = () => {
        setOpenCrearPlato(false);
    }

    function camposLlenos(){
        if(regVentFecha !== '' && regVentMesa !== '' && regVentValor !== ''){
            return true;
        }
        return false;
    }

    function camposLlenosPlato(){
        if(rvPlato !== '' && rvCantidad !== ''){
            return true;
        }
        return false;
    }

    return(
        <div>
            <Container>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Fecha:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Fecha' : regVentFecha} disabled={props.typeOperation === 'Ver'} onChange={actualizarRegistroVentaFecha} value={regVentFecha}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Mesa:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Mesa' : regVentMesa} disabled={props.typeOperation === 'Ver'} onChange={actualizarRegistroVentaMesa} value={regVentMesa}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Valor a pagar:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Valor a pagar' : regVentValor} disabled={props.typeOperation === 'Ver'} onChange={actualizarRegistroVentaValor} value={regVentValor}/>
                        </Grid.Column>
                    </Grid.Row>

                    {

                        props.typeOperation !== 'Crear' ? 
                        <ModalBodyVerPlatos objectS={props.objectS} llave={props.tok}></ModalBodyVerPlatos>
                        :
                        <div></div>

                    }

                </Grid>

            </Container>
            <br></br>
            <Button variant="secondary" onClick={props.handleSubmit}>
                Volver
            </Button>
            {
                props.typeOperation === 'Crear'?
                <Button variant="secondary" onClick={nuevoPlato}>
                    Ingresar platos
                </Button>
                :
                <div></div>
            }

            <Modal show={openCrearPlato} onHide={handleCloseCrearPlato}>
                <Modal.Header closeButton>
                <Modal.Title>Agregar plato</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column>
                                <label>Nombre del plato:</label>
                            </Grid.Column>
                            <Grid.Column>
                                <label>Cantidad:</label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Input placeholder='Nombre plato' onChange={actualizarRvPlato} value={rvPlato} />
                            </Grid.Column>
                            <Grid.Column>
                                <Input placeholder='Cantidad' onChange={actualizarRvCantidad} value={rvCantidad} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCrearPlato}>
                        Cancelar
                    </Button>
                    <Button variant="secondary" onClick={agregarPlato}>
                        Agregar nuevo plato
                    </Button>
                    <Button variant="secondary" onClick={finalizarRegVent}>
                        Finalizar
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default ModalBodyRegistroVenta;