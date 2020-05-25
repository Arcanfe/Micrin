import React, { useState, useEffect } from 'react';
import { Button, Container, Input, Grid, Radio } from 'semantic-ui-react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';
import validadorFecha from '../../../Compartido/ValidadorFecha';

/**
 * Objeto que contiene los parámetros/props del contenedor
 * handleSumbit: función que cierra el modal en el que se ubica este componente.
 * ObjectS: Código del ingrediente seleccionado
 * tok: Valor del token
 */
type modalBodyFormProps = {
    handleSubmit: any,
    objectS: any,
    tok: any
}

/**
 * Funcion que contiene el componente del modal que se muestra para añadir productos de un ingrediente existente
 */
const ModalBodyIngredientes: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {
    /**
     * Variable que establece el formato del objeto que se ha de pasar como 'header' en las peticiones.
     * Emplea el token recibido en las propiedades.
     */
    const config = {
        headers: props.tok
    }
    /**
     * Variable que almacena el nombre del producto
     */
    const [nombreProd, setNombreProd] = useState('');
    /**
     * Variable que almacena la cantidad del producto a ingresar.
     */
    const [cantidad, setCantidad] = useState('');
    /**
     * Variable que almacena el precio de adquisicion de un producto
     */
    const [precio, setPrecio] = useState('');
    /**
     * Variable que almacena la fecha de vencimiento del producto a ingresar
     */
    const [fechaV, setFechaV] = useState('');
    /**
     * Variable que almacena la fecha de adquisicion del producto a ingresar.
     */
    const [fechaA, setFechaA] = useState('');

    /**
     * Funcion que carga los datos del ingrediente seleccionado para obtener el nombre
     */
    useEffect(() => {
        axios.get('https://inventario-services.herokuapp.com/invservice/stock/getone/?codigo=' + props.objectS, config)
        .then(result => {
            setNombreProd(result.data.nombre);
        }).catch(

        ); 
    });
    /**
     * Funcion que realiza la peticion para añadir un producto
     */
    const addProduct = () => {
        if(validarCampos() === true){
            console.log('{"cantidad":' + cantidad + ', "precioxunidad":' + precio + ', "fecha_vencimiento":"' + fechaV + '", "fecha_adquisicion":"' + fechaA + '", "cod_stock":' + props.objectS + '}');
            axios.post('https://inventario-services.herokuapp.com/invservice/producto/registro',  JSON.parse('{"cantidad":' + cantidad + ', "precioxunidad":' + precio + ', "fecha_vencimiento":"' + fechaV + '", "fecha_adquisicion":"' + fechaA + '", "cod_stock":' + props.objectS + '}'), config )
            .then(res => {
                toast.success('El producto se ha añadido satisfactoriamente');
                //window.location.reload();
            }).catch(error => {
                console.log(error.response);
                toast.error('Un error ha ocurrido. Por favor intentar mas tarde.');
            });
            
            props.handleSubmit();
        }
    }
    /**
     * Funcion que modifica la variable 'cantidad' a partir de lo recibido en el parametro
     */
    const actualizarCantidad = (e: any) => {
        setCantidad(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'precio' a partir de lo recibido en el parametro
     */
    const actualizarPrecio = (e: any) => {
        setPrecio(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'fechaV' a partir de lo recibido en el parametro
     */
    const actualizarFechaV = (e: any) => {
        setFechaV(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'fechaA' a partir de lo recibido en el parametro
     */
    const actualizarFechaA = (e: any) => {
        setFechaA(e.target.value);
    }
    /**
     * Funcion que valida el formato numerico de los campos cantidad y precio; valida el formato de fecha para ls campos fechaV y fechaA
     */
    function validarCampos() {
        if(camposLlenos()){
            if(validadorNumero(cantidad)){
                if(validadorNumero(precio)){
                    if(validadorFecha(fechaV)){
                        if(validadorFecha(fechaA)){
                            return true;
                        }
                        setFechaA('');                        
                        toast.error('Ingrese una fecha válida en el campo "Fecha de adquisición". Por favor ingresar la fecha en formato "YYYY-MM-DD"');
                        return false;
                    }
                    setFechaV('');
                    toast.error('Ingrese una fecha válida en el campo "Fecha de vencimiento". Por favor ingresar la fecha en formato "YYYY-MM-DD"');
                    return false;
                }
                setPrecio('');
                toast.error('El campo de "Precio" debe ser numérico');
                return false;
            }
            setCantidad('');
            toast.error('El campo de "Cantidad" debe ser numérico');
            return false;
        }
        toast.error('Por favor llenar todos los campos');
        return false;
    }
    /**
     * Funcion que valida que los campos ingresados por el usuario no se encuentren llenos
     */
    function camposLlenos(){
        if(cantidad !== '' && precio !== '' && fechaV !== '' && fechaA !== '' ){
            return true;
        }
        return false;
    }

    return(
        <Container>
            <p>*Recuerde que las unidades estan dadas segun la unidad de medida asignada para el ingrediente.</p>
            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column>
                        <label>Nombre ingrediente:</label>
                    </Grid.Column>
                    <Grid.Column>
                        <Input placeholder='Nombre ingrediente' disabled value={nombreProd}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <label>*Cantidad:</label>
                    </Grid.Column>
                    <Grid.Column>
                        <Input placeholder='Cantidad' onChange={actualizarCantidad}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <label>Precio por unidad de adquisición:</label>
                    </Grid.Column>
                    <Grid.Column>
                        <Input placeholder='Precio por unidad' onChange={actualizarPrecio}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <label>Fecha de vencimiento:</label>
                    </Grid.Column>
                    <Grid.Column>
                        <Input placeholder='Fecha de vencimiento' onChange={actualizarFechaV}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <label>Fecha de adquisición:</label>
                    </Grid.Column>
                    <Grid.Column>
                        <Input placeholder='Fecha de adquisición' onChange={actualizarFechaA}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Button variant="secondary" onClick={addProduct}>
                Crear
            </Button>
            <Button variant="secondary" onClick={props.handleSubmit}>
                Cancelar
            </Button>
        </Container>
    );
}

export default ModalBodyIngredientes;