import React, { useState, useEffect } from 'react';
import { Button, Container, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validadorNumero from '../../../Compartido/ValidadorNumero';
import obtenerIdLocal from '../../../Compartido/ObtenerIdLocal';

type modalBodyFormProps = {
    typeOperation: any,
    handleSubmit: any,
    objectS: any,
    tok: any
}

const ModalBodyPlatos: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const config = {
        headers: props.tok
    }

    const [platoNombre, setPlatoNombre] = useState('');
    const [platoValor, setPlatoValor] = useState('');

    useEffect(() => {
        if(props.typeOperation !== 'Crear'){
            axios.get('https://inventario-services.herokuapp.com/invservice/plato/getone/?codigo=' + props.objectS, config)
            .then(result => {
                //console.log(result);
                setPlatoNombre(result.data.nombre);
                setPlatoValor(result.data.costo);
            }).catch(

            );            
        };
    },[]);

    const actualizarPlatoNombre = (e: any) => {
        setPlatoNombre(e.target.value);
    }

    const actualizarPlatoValor = (e: any) => {
        setPlatoValor(e.target.value);
    }

    const createPlato = async () => {
        const varId = await obtenerIdLocal(config);
        if(validarCampos() === true){
            axios.post('https://inventario-services.herokuapp.com/invservice/plato/registro',  JSON.parse('{"nombre":"' + platoNombre + '", "costo":"' + platoValor + '", "cod_local":"' + varId + '"}'), config )
            .then(res => {
                console.log('creacion plato');
                console.log(res);
                toast.success('El plato se ha creado satisfactoriamente. Por favor recarga la página para ver los cambios.');
                props.handleSubmit();
            }).catch(error => {
                console.log(error.response);
                toast.error('Ya existe un plato con este nombre.');
                setPlatoNombre('');
            }); 
        }
    }

    const updatePlato = async () => {
        const varId = await obtenerIdLocal(config);
        if(validarCampos() === true){
            axios.put('https://inventario-services.herokuapp.com/invservice/plato/update',  JSON.parse('{"nombre":"' + platoNombre + '", "costo":"' + platoValor + '", "cod_local":"' + varId + '"}'), config )
            .then(res => {
                console.log('creacion plato');
                console.log(res);
                toast.success('El plato se ha modificado satisfactoriamente. Por favor recarga la página para ver los cambios.');
                //window.location.reload();
            }).catch(error => {
                console.log(error.response)
            });
            
            props.handleSubmit();
        }
    }

    function validarCampos(){
        if(camposLlenos()){
            if(validadorNumero(platoValor)){
                return true;
            }
            setPlatoValor('');
            toast.error('El campo "valor" debe ser numérico');
            return false;
        }
        toast.error('Por favor llenar todos los campos');
        return false;
    }

    function camposLlenos(){
        if(platoNombre !== '' && platoValor !== '' ){
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
                            <label>Nombre plato:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Nombre plato' : platoNombre} disabled={props.typeOperation !== 'Crear'} onChange={actualizarPlatoNombre} value={platoNombre}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Valor:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder={props.typeOperation === 'Crear'? 'Valor' : platoValor} disabled={props.typeOperation === 'Ver'} onChange={actualizarPlatoValor} value={platoValor}/>
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
                <Button variant="secondary" onClick={createPlato}>
                    Crear
                </Button>
                :
                (props.typeOperation === 'Modificar'?
                <Button variant="secondary" onClick={updatePlato}>
                    Modificar
                </Button>
                :
                <div></div>)
            }
        </div>
    );
}

export default ModalBodyPlatos;