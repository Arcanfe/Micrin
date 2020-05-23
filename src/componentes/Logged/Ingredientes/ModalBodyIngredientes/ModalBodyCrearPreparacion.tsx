import React, { useState, useEffect} from 'react';
import { Container, Button, Icon, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';

type modalBodyFormProps = {
    handleSubmit: any,
    objectS: any,
    tok: any
}

const ModalBodyCrearPreparacion: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const config = {
        headers: props.tok
    }

    const [prepIngrediente, setPrepIngrediente] = useState('');
    const [prepCantidad, setPrepCantidad] = useState('');

    const [ingredienteCodigo, setIngredienteCodigo] = useState();
    const [ingEncontrado, setIngEncontrado] = useState(false);

    useEffect(() => {
        console.log(ingredienteCodigo);
    },[ingredienteCodigo]);

    const actualizarPrepIngrediente = (e:any) => {
        setPrepIngrediente(e.target.value);
    }

    const actualizarPrepCantidad = (e:any) => {
        setPrepCantidad(e.target.value);
    }

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

    const obtenerInfoIngrediente = async () => {
        await axios.get('https://inventario-services.herokuapp.com/invservice/stock/getname?nombre=' + prepIngrediente, config)
        .then(result => {
            console.log(result);
            //Error al cargar el valor
            setIngredienteCodigo(result.data.codigo);
            setIngEncontrado(true);
            console.log(ingredienteCodigo);
        }).catch(result => {
            console.log('error');
            toast.error('No se reconoce el ingrediente. Por favor intente de nuevo.');
            console.log(result);
        });
    }

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