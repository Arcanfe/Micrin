import React, { useState, useEffect} from 'react';
import { Container, Button, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';

type modalBodyFormProps = {
    handleSubmit: any,
    objectS: any,
    tok: any
}

const ModalBodyCrearReceta: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const config = {
        headers: props.tok
    }

    const [recIngrediente, setRecIngrediente] = useState('');
    const [recCantidad, setRecCantidad] = useState('');

    const [ingredienteCodigo, setIngredienteCodigo] = useState();
    const [ingEncontrado, setIngEncontrado] = useState(false);

    useEffect(() => {
        console.log(ingredienteCodigo);
    },[ingredienteCodigo]);

    const actualizarRecIngrediente = (e:any) => {
        setRecIngrediente(e.target.value);
    }

    const actualizarRecCantidad = (e:any) => {
        setRecCantidad(e.target.value);
    }

    const agregarIngrediente = async () => {
        if(validarCampos() === true){
            await obtenerInfoIngrediente();
            if(ingEncontrado === true){
                console.log('{"codigo_spro":"' + ingredienteCodigo + '", "codigo_plato":"' + props.objectS + '", "cantidadxplato":"' + recCantidad + '"}');
                axios.post('https://inventario-services.herokuapp.com/invservice/receta/registro', JSON.parse('{"codigo_spro":"' + ingredienteCodigo + '", "codigo_plato":"' + props.objectS + '", "cantidadxplato":"' + recCantidad + '"}'), config)
                .then(result => {
                    console.log(result);
                    toast.success('El ingrediente "' + recIngrediente + '" se ha añadido a la preparacion');
                }).catch(result => {
                    console.log('error');

                    console.log(result);
                });
                props.handleSubmit();
            }
        }
    }

    const obtenerInfoIngrediente = async () => {
        await axios.get('https://inventario-services.herokuapp.com/invservice/stock/getname?nombre=' + recIngrediente, config)
        .then(result => {
            console.log(result);
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
            if(validadorNumero(recCantidad)){
                return true;
            }
            setRecCantidad('');
            toast.error('El campo "cantidad" debe ser numérico');
            return false;
        }
        toast.error('Por favor llenar todos los campos');
        return false;
    }

    function camposLlenos(){
        if(recIngrediente !== '' && recCantidad !== '' ){
            return true;
        }
        return false;
    }

    return(
        <div>
            <Container>
                <p>*Recuerde que las cantidades de referencia se establecen según se registraron al crear el ingrediente</p>
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
                            <Input placeholder='Nombre ingrediente' onChange={actualizarRecIngrediente} />
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder='Cantidad*' onChange={actualizarRecCantidad} />
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

export default ModalBodyCrearReceta;