import React, { useState, useEffect } from 'react';
import { Button, Container, Input, Grid } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';
import validadorFecha from '../../../Compartido/ValidadorFecha';
import ModalBodyVerPlatos from './ModalBodyVerPlatos';
import obtenerIdLocal from '../../../Compartido/ObtenerIdLocal';

/**
 * Objeto que contiene los parámetros/props del contenedor
 * typeOperation: Define la accion que se esta realizando en el componente: Ver o Crear
 * handleSumbit: función que cierra el modal en el que se ubica este componente.
 * ObjectS: Código del ingrediente seleccionado
 * tok: Valor del token
 */
type modalBodyFormProps = {
    typeOperation: any,
    handleSubmit: any,
    objectS: any,
    tok: any
}

/**
 * Funcion que contiene el modal que se muestra para crear o ver un registro de venta
 */
const ModalBodyRegistroVenta: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {
    /**
     * Variable que establece el formato del objeto que se ha de pasar como 'header' en las peticiones.
     * Emplea el token recibido en las propiedades.
     */
    const config = {
        headers: props.tok
    }
    /**
     * Variable que almacena el valor de la fecha de un registro de venta
     */
    const[regVentFecha, setRegVentFecha] = useState('');
    /**
     * Variable que almacena la mesa de donde se esta realizando un registro de venta
     */
    const[regVentMesa, setRegVentMesa] = useState('');
    /**
     * Variable que almacena el valor total de un registro de venta
     */
    const[regVentValor, setRegVentValor] = useState('');
    /**
     * Variable que define el nombre del plato vendido en un registro de venta
     */
    const[rvPlato, setRvPlato] = useState('');
    /**
     * Variable que define el numero de platos del plato seleccionado
     */
    const[rvCantidad, setRvCantidad] = useState('');
    /**
     * Variable booleana que define la apertura del modal para añadir un plato a un registro de venta
     */
    const[openCrearPlato, setOpenCrearPlato] = useState(false);
    /**
     * Variable booleana que establece si se ha agregado el numero minimo de platos a un registro de venta para terminar un registro
     */    
    const[agregadoMin, setAgregadoMin] = useState(false);
    /**
     * Variable booleana que define si el plato escrito por el usuario existe en el sistema
     */
    const[platoEncontrado, setPlatoEncontrado] = useState(false);
    /**
     * Variable que almacena el codigo del plato a partir del nombre escrito por el usuario
     */
    const[platoCodigo, setPlatoCodigo] = useState('');
    /**
     * Variable que almacena el codigo del registro de venta creado
     */
    const[rvCodigo, setRvCodigo] = useState('');

    /**
     * Funcion que inicializa el componente.
     * En caso que la operacion sea ver un registro de venta, se carga la informacion del registro
     */
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
    /**
     * Función que modifica la variable regVentFecha
     * @param e Cadena string que usuario ingresa como fecha de un registro de venta
     */
    const actualizarRegistroVentaFecha = (e: any) => {
        setRegVentFecha(e.target.value);
    }
    /**
     * Función que modifica la variable regVentMesa
     * @param e Cadena string que usuario ingresa como mesa de donde se realiza un registro de venta
     */
    const actualizarRegistroVentaMesa = (e: any) => {
        setRegVentMesa(e.target.value);
    }
    /**
     * Función que modifica la variable regVentValor
     * @param e Cadena string que usuario ingresa como valor de un registro de venta
     */
    const actualizarRegistroVentaValor = (e: any) => {
        setRegVentValor(e.target.value);
    }
    /**
     * Función que modifica la variable regVentPlato
     * @param e Cadena string que usuario ingresa como plato de un registro de venta
     */
    const actualizarRvPlato = (e: any) => {
        setRvPlato(e.target.value);
    }
    /**
     * Función que modifica la variable regVentCantidad
     * @param e Cadena string que usuario ingresa como cantidad de un plato de un registro de venta
     */
    const actualizarRvCantidad = (e: any) => {
        setRvCantidad(e.target.value);
    }
    /**
     * Función inicializa la operacion para añadir un nuevo primer plato a un registro de venta
     */
    const nuevoPlato = () => {
        if(validarCampos() === true){
            handleOpenCrearPlato();
        }
        
    }
    /**
     * Función que inicializa la operacion para añadir un plato a los ya existente de un registro de venta
     */
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
    /**
     * Funcion que inicia la operacion para finalizar la creacion de un registro de venta
     */
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
    /**
     * Funcion que realiza la accion de registrar un plato, asociado con un registro de venta
     */
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
    /**
     * Funcion que realiza la peticion para determinar la existencia de un nuevo plato a partir del nombre ingresado por el usuario
     */
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
    /**
     * Funcion que realiza la peticion al API para crear un registro de venta
     */
    const createRegVent = async () => {
        const varId = await obtenerIdLocal(config);
        axios.post('https://inventario-services.herokuapp.com/invservice/registro_venta/registro',  JSON.parse('{"precio_total":' + regVentValor + ', "numero_mesa":' + regVentMesa + ', "fecha":"' + regVentFecha + '", "cod_local":"' + varId + '"}'), config )
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
    /**
     * Funcion que valida el formato numerico de los campos 'mesa' y 'valor' del registro de venta
     * Valida ademas el formato de la fecha del registro de venta a crear.
     */
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
    /**
     * Funcion que valida el formato del campo cantidad, al momento de anexar un plato a un registro de venta
     */
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
    /**
     * Funcion que modifica la variable 'openCrearPlato' a true
     */
    const handleOpenCrearPlato = () => {
        setOpenCrearPlato(true);
    }
    /**
     * Funcion que modifica la variable 'openCrearPlato' a false
     */
    const handleCloseCrearPlato = () => {
        setOpenCrearPlato(false);
    }
    /**
     * Funcion que valida que los campos para crear un registro de venta no esten vacios
     */
    function camposLlenos(){
        if(regVentFecha !== '' && regVentMesa !== '' && regVentValor !== ''){
            return true;
        }
        return false;
    }
    /**
     * Funcion que valida que los campos para anexar un plato a un registro de venta no esten vacios
     */
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