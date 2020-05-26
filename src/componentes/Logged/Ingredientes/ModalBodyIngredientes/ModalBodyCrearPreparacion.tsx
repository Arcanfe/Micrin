import React, { useState, useEffect} from 'react';
import { Container, Button, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';

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
 * Función que contiene el modal que se muestra cuando un usuario quiere agregar un ingrediente a la preparación de otro.
 * @param props Objeto que contiene la información necesaria para completar el proceso: función de cierre, token y código del ingrediente seleccionado.
 */
const ModalBodyCrearPreparacion: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {
    /**
     * Variable que establece el formato del objeto que se ha de pasar como 'header' en las peticiones.
     * Emplea el token recibido en las propiedades.
     */
    const config = {
        headers: props.tok
    }
    /**
     * Variable que guarda el nombre del ingrediente que se quiere usar como preparación
     */
    const [prepIngrediente, setPrepIngrediente] = useState('');
    /**
     * Variable que guarda la cantidad del ingrediente que se quiere usar en la preparación
     */
    const [prepCantidad, setPrepCantidad] = useState('');
    /**
     * Variable que guarda el código del ingrediente que se quiere usar en la preparación
     */
    const [ingredienteCodigo, setIngredienteCodigo] = useState();
    /**
     * Variable booleana que establece si el ingrediente escrito por el usuario existe o no dentro de los ingredientes del usuario
     */
    const [ingEncontrado, setIngEncontrado] = useState(false);

    /**
     * Funcion que inicializa con el componente, en este caso se usa como manera de controlar la cantidad de veces que se renderiza la peticion de buscar el ingrediente al sistema.
     */
    useEffect(() => {
        console.log(ingredienteCodigo);
    },[ingredienteCodigo]);
    /**
     * Función que modifica la variable prepIngrediente
     * @param e Cadena string que usuario ingresa como nombre de un ingrediente
     */
    const actualizarPrepIngrediente = (e:any) => {
        setPrepIngrediente(e.target.value);
    }
    /**
     * Funcion que modifica la variable prepCantidad
     * @param e Cadena string que el usuario ingresa como la cantidad de un ingrediente
     */
    const actualizarPrepCantidad = (e:any) => {
        setPrepCantidad(e.target.value);
    }
    /**
     * Función que realiza la acción de registrar la nueva preparación una vez el usuario ha seleccionado el botón 'agregar'
     */
    const agregarIngrediente = async () => {
        if(validarCampos() === true){
            await obtenerInfoIngrediente();
            if(ingEncontrado === true){
                console.log('{"codigo_ingrediente":"' + ingredienteCodigo + '", "codigo_preparacion":"' + props.objectS + '", "cantidadxpreparacion":"' + prepCantidad + '"}');
                axios.post('https://inventario-services.herokuapp.com/invservice/preparacion/registro', JSON.parse('{"codigo_ingrediente":"' + ingredienteCodigo + '", "codigo_preparacion":"' + props.objectS + '", "cantidadxpreparacion":"' + prepCantidad + '"}'), config)
                .then(result => {
                    console.log(result);
                    toast.success('El ingrediente "' + prepIngrediente + '" se ha añadido a la preparacion');
                }).catch(result => {
                    console.log('error');

                    console.log(result);
                });
                props.handleSubmit();
            }
        }
    }
    /**
     * Funcion que obtiene código de un ingrediente a partir del nombre.
     * Esta funcion se utiliza para realizar el registro de una nueva preparacion
     */
    const obtenerInfoIngrediente = async () => {
        await axios.get('https://inventario-services.herokuapp.com/invservice/stock/getname?nombre=' + prepIngrediente, config)
        .then(result => {
            setIngredienteCodigo(result.data.codigo);
            setIngEncontrado(true);
        }).catch(result => {
            console.log('error');
            toast.error('No se reconoce el ingrediente. Por favor intente de nuevo.');
            console.log(result);
        });
    }
    /**
     * Funcion que valida el formato del campo cantidad- que sea numérico
     * Se asegura tambien que los campos no ingresen vacios
     */
    function validarCampos(){
        if(camposLlenos()){
            if(validadorNumero(prepCantidad)){
                return true;
            }
            setPrepCantidad('');
            toast.error('El campo "cantidad" debe ser numérico');
            return false;
        }
        toast.error('Por favor llenar todos los campos');
        return false;
    }
    /**
     * Funcion que valida que los campos no se encuentren vacios cuando el usuario desea agregar una nueva preparacion
     */
    function camposLlenos(){
        if(prepIngrediente !== '' && prepCantidad !== '' ){
            return true;
        }
        return false;
    }

    return(
        <div>
            <Container>
                <p>*Recuerde que las cantidades han de referenciar según se registraron en el sistema</p>
                <br></br>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Nombre del ingrediente:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <label>*Cantidad:</label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Input placeholder='Nombre ingrediente' onChange={actualizarPrepIngrediente} />
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder='Cantidad*' onChange={actualizarPrepCantidad} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            <br></br>
            <Button variant="secondary" onClick={props.handleSubmit}>
                Cancelar
            </Button>
            <Button variant="secondary" onClick={agregarIngrediente}>
                Agregar preparacion
            </Button>
        </div>
    );
}

export default ModalBodyCrearPreparacion;