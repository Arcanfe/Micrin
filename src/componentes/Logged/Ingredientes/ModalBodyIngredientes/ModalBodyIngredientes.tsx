import React, { useEffect, useState } from 'react';
import { Button, Container, Input, Grid, Radio } from 'semantic-ui-react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';

type modalBodyFormProps = {
    typeOperation: any,
    handleSubmit: any,
    objectS: any,
    tok: any
}

const ModalBodyIngredientes: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const config = {
        headers: props.tok
    }

    const[ingredienteNombre, setIngredienteNombre] = useState('');
    const[ingredienteCant, setIngredienteCant] = useState('');
    const[ingredienteMax, setIngredienteMax] = useState('');
    const[ingredienteMin, setIngredienteMin] = useState('');
    const[ingredientePrep, setIngredientePrep] = useState(false);
    const[ingredienteUn, setIngredienteUn] = useState('');

    const[unidadMedida, setUnidadMedida] = useState('');
    const[unidadMedidaCant, setUnidadMedidaCant] = useState('');

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

    const actualizarIngredienteCant = (e: any) => {
        setIngredienteCant(e.target.value);
    }

    const actualizarIngredienteMax = (e: any) => {
        setIngredienteMax(e.target.value);
    }

    const actualizarIngredienteMin = (e: any) => {
        setIngredienteMin(e.target.value);
    }

    const actualizarIngredienteNombre = (e: any) => {
        setIngredienteNombre(e.target.value);
    }

    const actualizarUnidadMedida = (e: any) => {
        setUnidadMedida(e.target.value);
    }

    const actualizarUnidadCantidad = (e: any) => {
        setUnidadMedidaCant(e.target.value);
    }

    const addIngredient = () => {

    }

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

    const addUnMedida = () => {
        axios.post('https://inventario-services.herokuapp.com/invservice/unidadmedida/registro', JSON.parse('{"unidad_medida":"' + unidadMedida + '", "cantidad":"' + unidadMedidaCant + '"}'), config);
    }

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

    const createIngredient = async () => {
        await findUnMedida();
        if(validarCampos() === true){
            console.log('entrada creacion ing');
            console.log('{"nombre":"' + ingredienteNombre + '", "cantidad_total":"' + ingredienteCant + '", "existencia_maxima":"' + ingredienteMax + '", "existencia_minima":"' + ingredienteMin + '", "preparacion":' + ingredientePrep + ', "cod_local":"' + '"161"' + '", "cod_umedida":"' + '2' + '"}');
            axios.post('https://inventario-services.herokuapp.com/invservice/stock/registro',  JSON.parse('{"nombre":"' + ingredienteNombre + '", "cantidad_total":"' + ingredienteCant + '", "existencia_maxima":"' + ingredienteMax + '", "existencia_minima":"' + ingredienteMin + '", "preparacion":' + ingredientePrep + ', "cod_local":"' + '161' + '", "cod_umedida":"' + ingredienteUn + '"}'), config )
            .then(res => {
                console.log('creacion ingrediente');
                console.log(res);
                toast.success('El ingrediente se ha creado satisfactoriamente');
                //window.location.reload();
            }).catch(error => {
                console.log(error.response)
            });
            
            props.handleSubmit();
        }
    }

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