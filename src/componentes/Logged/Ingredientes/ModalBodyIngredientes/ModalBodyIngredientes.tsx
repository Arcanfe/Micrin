import React, { useEffect, useState } from 'react';
import { Button, Container, Input, Grid, Radio } from 'semantic-ui-react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';
import obtenerIdLocal from '../../../Compartido/ObtenerIdLocal';
import existeUnidadMedida from '../../../Compartido/ExisteUnidadMedida';
import crearUnidadMedida from '../../../Compartido/CrearUnidadMedida';
import buscarCodigoUnidadMedida from '../../../Compartido/BuscarCodigoUnidadMedida';

/**
 * Objeto que contiene los parámetros/props del contenedor
 * typeOperation: string que define si se pretende crear, modificar o ve un ingrediente, y que habilita o deshabilita parte del componente de ser necesario
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
 * Funcion que contiene el componente que se mostrara en el modal para crear, modificar o eliminar un ingrediente
 * @param props Objeto con valores importantes que definen el tipo de accion a realizar.
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
     * Variable que almacena el nombre del ingrediente
     */
    const[ingredienteNombre, setIngredienteNombre] = useState('');
    /**
     * Variable que almacena la cantidad del ingrediente
     */
    const[ingredienteCant, setIngredienteCant] = useState('');
    /**
     * Variable que almacena la cantidad maxima del ingrediente
     */
    const[ingredienteMax, setIngredienteMax] = useState('');
    /**
     * Variable que almacena la cantidad minima del ingrediente
     */
    const[ingredienteMin, setIngredienteMin] = useState('');
    /**
     * Variable que indica si el ingrediente es o no una preparacion
     */
    const[ingredientePrep, setIngredientePrep] = useState(false);
    /**
     * Variable que almacena el codigo del ingrediente
     */
    const[ingredienteUn, setIngredienteUn] = useState('');
    /**
     * Variable que almacena el nombre de de la unidad de medida con que trabaja el ingrediente
     */
    const[unidadMedida, setUnidadMedida] = useState('');
    /**
     * Variable que almacena la cantidad de la unidad de medida con que trabaja el ingrediente
     */
    const[unidadMedidaCant, setUnidadMedidaCant] = useState('');

    /**
     * Funcion que, en caso que la funcion sea ver o modificar un ingrediente, carga la informacion del ingrediente para ponerla en los campos del modal
     */
    useEffect(() => {
        if(props.typeOperation !== 'Crear'){
            axios.get('https://inventario-services.herokuapp.com/invservice/stock/getone/?codigo=' + props.objectS, config)
            .then(result => {
                //console.log(result);
                setIngredienteCant(result.data.cantidad_total);
                setIngredienteMax(result.data.existencia_maxima);
                setIngredienteMin(result.data.existencia_minima);
                setIngredienteNombre(result.data.nombre);
                setIngredientePrep(result.data.preparacion);
                setIngredienteUn(result.data.cod_umedida);
                fijarUnidad(result.data.cod_umedida);
            }).catch(

            );            
        };
    },[]);

    useEffect(() => {
        console.log(ingredienteUn)
    }, [ingredienteUn]);
    /**
     * Funcion que modifica la variable 'ingredienteCant' segun lo que reciba de parametro
     */
    const actualizarIngredienteCant = (e: any) => {
        setIngredienteCant(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'ingredienteMax' segun lo que reciba de parametro
     */
    const actualizarIngredienteMax = (e: any) => {
        setIngredienteMax(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'ingredienteMin' segun lo que reciba de parametro
     */
    const actualizarIngredienteMin = (e: any) => {
        setIngredienteMin(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'ingredienteNombre' segun lo que reciba de parametro
     */
    const actualizarIngredienteNombre = (e: any) => {
        setIngredienteNombre(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'unidadMedida' segun lo que reciba de parametro
     */
    const actualizarUnidadMedida = (e: any) => {
        setUnidadMedida(e.target.value);
    }
    /**
     * Funcion que modifica la variable 'unidadCantidad' segun lo que reciba de parametro
     */
    const actualizarUnidadCantidad = (e: any) => {
        setUnidadMedidaCant(e.target.value);
    }
    /**
     * Funcion que encuentra un registro en la tabla unidadMedida a partir del codigo
     */
    const fijarUnidad = (un:string) => {
        console.log(un)
        axios.get('https://inventario-services.herokuapp.com/invservice/unidadmedida/getone?codigo=' + un, config)
            .then(result => {
                console.log('unidad de medida');
                console.log(result);
                setUnidadMedida(result.data.unidad_medida);
                setUnidadMedidaCant(result.data.cantidad);
            }).catch(

            ); 
    }
    /**
     * Funcion que crea una nueva unidad de medida
     */
    const addUnMedida = () => {
        axios.post('https://inventario-services.herokuapp.com/invservice/unidadmedida/registro', JSON.parse('{"unidad_medida":"' + unidadMedida + '", "cantidad":"' + unidadMedidaCant + '"}'), config);
    }
    /**
     * Funcion que encuentra una unidad de medida a partir del nombre y cantidad. En caso de no encontrarlo, redirige a la funcion de crear la unidad
     */
    const findUnMedida = async () => {
        toast.info('creando unidad de medida');
        await axios.get('https://inventario-services.herokuapp.com/invservice/unidadmedida/getcode?nombre=' + unidadMedida + '&cantidad=' + unidadMedidaCant, config)
        .then(res => {
            console.log(res);
            setIngredienteUn(res.data);
            console.log(ingredienteUn);
            toast.success('unidad de medida añadido');
        }).catch(error => {
            addUnMedida();
            findUnMedida();
            console.log(error.response);
        });
    }
    /**
     * Funcino para crear un nuevo ingrediente
     */
    const createIngredient = async () => {
        let codigoUm = '';
        const varId = await obtenerIdLocal(config);
        try{
            const ext = await existeUnidadMedida(config, unidadMedida, unidadMedidaCant);
            if(ext === true){
                codigoUm = await buscarCodigoUnidadMedida(config, unidadMedida, unidadMedidaCant);
            }
            else{
                const creadoUM = await crearUnidadMedida(config, unidadMedida, unidadMedidaCant);
                codigoUm = await buscarCodigoUnidadMedida(config, unidadMedida, unidadMedidaCant);
            }
            if(validarCampos() === true){
                axios.post('https://inventario-services.herokuapp.com/invservice/stock/registro',  JSON.parse('{"nombre":"' + ingredienteNombre + '", "cantidad_total":"' + ingredienteCant + '", "existencia_maxima":"' + ingredienteMax + '", "existencia_minima":"' + ingredienteMin + '", "preparacion":' + ingredientePrep + ', "cod_local":"' + varId + '", "cod_umedida":"' + codigoUm + '"}'), config )
                .then(res => {
                    toast.success('El ingrediente se ha creado satisfactoriamente');
                }).catch(error => {
                    console.log(error.response)
                });              
                props.handleSubmit();
            }
        }
        catch(error){
            toast.error('Un error inesperado ha ocurrido, por favor intente mas tarde.');
            props.handleSubmit();
        }      
    }
    /**
     * Funcion para actualizar un ingrediente
     */
    const updateIngredient = async () => {
        await findUnMedida();
        if(validarCampos() === true){
            console.log('entrada modificacion ing');
            console.log('{"nombre":"' + ingredienteNombre + '", "cantidad_total":"' + ingredienteCant + '", "existencia_maxima":"' + ingredienteMax + '", "existencia_minima":"' + ingredienteMin + '", "preparacion":' + ingredientePrep + ', "cod_local":"' + '"161"' + '", "cod_umedida":"' + '2' + '"}');
            axios.put('https://inventario-services.herokuapp.com/invservice/stock/update',  JSON.parse('{"nombre":"' + ingredienteNombre + '", "cantidad_total":"' + ingredienteCant + '", "existencia_maxima":"' + ingredienteMax + '", "existencia_minima":"' + ingredienteMin + '", "preparacion":' + ingredientePrep + ', "cod_local":"' + '161' + '", "cod_umedida":"' + '2' + '"}'), config )
            .then(res => {
                console.log('update ingrediente');
                console.log(res);
                toast.success('El ingrediente se ha actualizados satisfactoriamente');
                //window.location.reload();
            }).catch(error => {
                console.log(error.response)
            });
            
            props.handleSubmit();
        }
    }
    /**
     * Funcion que valida el formato de las variables que deben ser numericas
     */
    function validarCampos() {
        if(camposLlenos()){
            if(validadorNumero(ingredienteCant)){
                if(validadorNumero(ingredienteMax)){
                    if(validadorNumero(ingredienteMin)){
                        if(validadorNumero(unidadMedidaCant)){
                            return true;
                        }
                        setUnidadMedidaCant('');                        
                        toast.error('El campo "Cantidad" de la unidad de medida debe ser numérico');
                        return false;
                    }
                    setIngredienteMin('');
                    toast.error('El campo de "Existencia mínima" debe ser numérico');
                    return false;
                }
                setIngredienteMax('');
                toast.error('El campo de "Existencia máxima" debe ser numérico');
                return false;
            }
            setIngredienteCant('');
            toast.error('El campo de "Cantidad total" debe ser numérico');
            return false;
        }
        toast.error('Por favor llenar todos los campos');
        return false;
    }
    /**
     * Funcion que valida que los campos del registro estén llenos.
     */
    function camposLlenos(){
        if(ingredienteNombre !== '' && ingredienteCant !== '' && ingredienteMax !== '' && ingredienteMin !== '' && unidadMedida !== '' && unidadMedidaCant !== '' ){
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
                            <label>Nombre ingrediente:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Nombre ingrediente' : ingredienteNombre} disabled={props.typeOperation !== 'Crear'} onChange={actualizarIngredienteNombre} value={ingredienteNombre}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Cantidad total:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Cantidad actual' : ingredienteCant} disabled={props.typeOperation === 'Ver'} onChange={actualizarIngredienteCant} value={ingredienteCant}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Existencia mínima:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Existencia mínima' : ingredienteMin} disabled={props.typeOperation === 'Ver'} onChange={actualizarIngredienteMin} value={ingredienteMin}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Existencia máxima:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Existencia máxima' : ingredienteMax} disabled={props.typeOperation === 'Ver'} onChange={actualizarIngredienteMax} value={ingredienteMax}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Unidad de medida:</label>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Unidad de medida' : unidadMedida} disabled={props.typeOperation === 'Ver'} onChange={actualizarUnidadMedida} value={unidadMedida}/>
                        </Grid.Column>
                        <Grid.Column>
                            <label>Cantidad:</label>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Cantidad' : unidadMedidaCant} disabled={props.typeOperation === 'Ver'} onChange={actualizarUnidadCantidad} value={unidadMedidaCant}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Preparación:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Container>
                                <Grid columns={2} divided>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Radio label='Si' disabled={props.typeOperation === 'Ver'} value='true' checked={ingredientePrep===true} onChange={() => {setIngredientePrep(true)}}/>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Radio label='No' disabled={props.typeOperation === 'Ver'} value='false' checked={ingredientePrep===false} onChange={() => {setIngredientePrep(false)}}/>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            <br></br>
            <Button variant="secondary" onClick={props.handleSubmit}>
                Volver
            </Button>
            {
                props.typeOperation === 'Crear'?
                <Button variant="secondary" onClick={createIngredient}>
                    Crear
                </Button>
                :
                (props.typeOperation === 'Modificar'?
                <Button variant="secondary" onClick={updateIngredient}>
                    Modificar
                </Button>
                :
                <div></div>)
            }
        </div>
    );
}

export default ModalBodyIngredientes;