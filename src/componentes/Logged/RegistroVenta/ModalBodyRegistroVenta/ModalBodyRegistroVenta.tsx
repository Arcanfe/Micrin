import React, { useState, useEffect } from 'react';
import { Button, Container, Input, Grid } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';
import validadorFecha from '../../../Compartido/ValidadorFecha';
import ModalBodyVerPlatos from './ModalBodyVerPlatos';
import crearRegistroVenta from '../../../Compartido/CrearRegistroVenta';
import obtenerCodigoPlato from '../../../Compartido/ObtenerCodigoPlato';
import encontrarPlato from '../../../Compartido/EncontrarPlato';
import crearRegVentPlato from '../../../Compartido/CrearRegVentPlato';
import obtenerValorPlato from '../../../Compartido/ObtenerValorPlato';
import modificarRegistroVenta from '../../../Compartido/ModificarRegistroVenta';

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
        credentials: 'include',
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
     * Variable booleana que establece si se ha agregado el numero minimo de platos a un registro de venta para terminar un registro
     */    
    const [agregadoMin, setAgregadoMin] = useState(false);
    /**
     * Variable booleana que define si el plato escrito por el usuario existe en el sistema
     */
    const[platoEncontrado, setPlatoEncontrado] = useState(false);
    /**
    * Modal que abre el mensaje del valor final
     */
    const [valorFinal, setValorFinal] = useState(false);
    /**
     * Variable booleana que define la apertura del modal para añadir un plato a un registro de venta
     */
    const[openCrearPlato, setOpenCrearPlato] = useState(false);

    const [codigoRegistro, setCodigoRegistro] = useState('0');
    /**
     * Variable que almacena el codigo del plato a partir del nombre escrito por el usuario
     */
    let platoCodigo = '';
    /**
     * Variable que almacena el codigo del registro de venta creado
     */
    let rvCodigo = '';

    const [valorTotal, setValorTotal] = useState(0);

    let platosRegVent:any = [];

    let fecha = new Date();

    const fechaActual = (fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate());

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

    useEffect(() => {
        console.log(agregadoMin);
    }, [agregadoMin]);

    useEffect(() => {
        console.log(codigoRegistro)
        modificarRegistroVenta(config, valorTotal, codigoRegistro);
    }, [valorTotal]);
    
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

    const confirmar = () => {
        setValorFinal(true);
    }

    const nuevoPlato = () => {
        if(validarCampos() === true){
            handleOpenCrearPlato();
        }
        
    }
    /**
     * Función que inicializa la operacion para añadir un plato a los ya existente de un registro de venta
     */
    const agregarPlato = async () => {
        if(validarCamposPlato() === true){
            try{
                let platoEncontrado = await encontrarPlato(config, rvPlato);
                if(platoEncontrado === true){    
                    if(agregadoMin === false){
                        rvCodigo = await crearRegistroVenta(config, fechaActual, regVentMesa);
                        setAgregadoMin(true);
                    }
                    platoCodigo = await obtenerCodigoPlato(config, rvPlato);
                    let valorPlat = await obtenerValorPlato(config, rvPlato);
                    let valorParcial = valorTotal
                    setValorTotal(valorParcial + (valorPlat * parseInt(rvCantidad)));
                    crearRegVentPlato(config, rvCodigo, platoCodigo, rvCantidad);
                    setRvPlato('');
                    setRvCantidad('');
                }
                else{
                    toast.error('El plato ingresado no se ha encontrado.');
                    setRvPlato('');
                }
            }
            catch(error){
                toast.error('Un error inesperado ha ocurrido, por favor intente mas tarde.');
                props.handleSubmit();
            }
        }   
    }
    /**
     * Funcion que inicia la operacion para finalizar la creacion de un registro de venta
     */
    const finalizarRegVent = async () => {
        if(validarCamposPlato() === true){
            try{
                let platoEncontrado = await encontrarPlato(config, rvPlato);
                if(platoEncontrado === true){  
                    if(agregadoMin === false){
                        rvCodigo = await crearRegistroVenta(config, fechaActual, regVentMesa);
                        console.log(rvCodigo);
                        setCodigoRegistro(rvCodigo);
                        setAgregadoMin(true);
                    }
                    platoCodigo = await obtenerCodigoPlato(config, rvPlato);
                    let valorPlat = await obtenerValorPlato(config, rvPlato);
                    let valorParcial = valorTotal
                    setValorTotal(valorParcial + (valorPlat * parseInt(rvCantidad)));
                    crearRegVentPlato(config, rvCodigo, platoCodigo, rvCantidad);
                    confirmar();
                }
                else{
                    toast.error('El plato ingresado no se ha encontrado.');
                    setRvPlato('');
                }
            }
            catch(error){
                toast.error('Un error inesperado ha ocurrido, por favor intente mas tarde.');
                props.handleSubmit();
            }
        }
    }
     /**
     * Funcion que valida el formato numerico de los campos 'mesa' y 'valor' del registro de venta
     * Valida ademas el formato de la fecha del registro de venta a crear.
     */
    function validarCampos(){
        if(camposLlenos()){
                if(validadorNumero(regVentMesa)){
                    return true;
                }
                setRegVentMesa('');
                toast.error('El campo "mesa" debe ser numérico');
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
     * Funcion que valida que los campos para crear un registro de venta no esten vacios
     */
    function camposLlenos(){
        if(regVentMesa !== ''){
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

    const finalizar = () => {
        setValorFinal(false);
        props.handleSubmit();
    }

    return(
        <div>
            <Container>
                <Grid columns={2} divided>
                    <p> </p>
                    <h5>Detalles del registro</h5>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Fecha:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Fecha' : regVentFecha} disabled onChange={actualizarRegistroVentaFecha} value={props.typeOperation === 'Ver'? regVentFecha:fechaActual}/>
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

            <Modal show={valorFinal} onHide={finalizar}>
                <Modal.Header closeButton>
                <Modal.Title>Registro de venta completado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    El registro se ha completado. El valor total a cobrar es de {valorTotal}.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={finalizar}>
                        Finalizar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModalBodyRegistroVenta;