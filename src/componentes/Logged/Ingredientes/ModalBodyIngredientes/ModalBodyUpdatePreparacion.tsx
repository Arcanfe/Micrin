import React, { useState, useEffect} from 'react';
import { Container, Button, Icon, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
 * Funcion que contiene el componente que se muestra en el modal para modificar una preparacion
 */
const ModalBodyUpdatePreparacion: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {
    /**
     * Arreglo que contiene la lista de preparaciones relacionadas con el ingrediente seleccionado
     */
    const[stockPreparaciones, setStockPreparaciones] = useState<any[]>([]);
    /**
     * Variable que establece el formato del objeto que se ha de pasar como 'header' en las peticiones.
     * Emplea el token recibido en las propiedades.
     */
    const config = {
        headers: props.tok
    }

    /**
     * Funcion inicial del componente. Inicializa la carga de la lista de las preparaciones
     */
    useEffect(() => {
        getPreparaciones();
    },[stockPreparaciones.length]);
    /**
     * Funcion que realiza el llamado al API para obtener la lista de preparaciones
     * Se modifica el JSON resultante para ingresar el nombre de los ingredientes (inicialmente se encuentra solo el codigo)
     */
    const getPreparaciones = async () => {
        try {
            const result = await axios.get('https://inventario-services.herokuapp.com/invservice/stock/getone/?codigo=' + props.objectS, config);
            let data = result.data.preparaciones
            for(let i = 0 ; i< data.length ; i++ ) {
                data[i].nombreIng = await getNombre(data[i].codigo_ingrediente); // <--- WE'LL STORE IT INSIDE MAIN DATA
            }
            setStockPreparaciones(data);
        } catch(err) {
            console.log(err); 
        }
    }
    /**
     * Funcion que obtiene el nombre de un ingrediente a partir del codigo pasado por parametro.
     * Se realiza para mostrar el nombre del ingrediente en las listas a mostrar
     */
    const getNombre = async (e:any) => {
        const result= await axios.get('https://inventario-services.herokuapp.com/invservice/stock/getone/?codigo=' + e, config)
        return result.data.nombre;
    }
    /**
     * Funcion que elimina la preparacion recibida por parametro
     */
    const handleEliminatePrep = (e:any) => {
        //Falta poner la url correcta
        axios.post('https://inventario-services.herokuapp.com/invservice/preparacion/delet?codigo=' + e, '', config)
        .then(res => {
            console.log(res);
            toast.success('Se ha eliminado el ingrediente de la preparación.');
            props.handleSubmit();
        }).catch(error => {
            console.log(error.response);
        });
    }

    return(
        <div>
            <Container>
                <br></br>
                <Grid columns={3} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Nombre del ingrediente:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <label>Cantidad:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <label>Acciones:</label>
                        </Grid.Column>
                    </Grid.Row>
                    {
                        stockPreparaciones.map(st => (
                            <Grid.Row key={st.id}>
                                <Grid.Column>
                                    <Input size='small' placeholder='Nombre ingrediente' value={st.nombreIng} disabled  />
                                </Grid.Column>
                                <Grid.Column>
                                    <Input size='small' placeholder='Cantidad*'  value={st.cantidadxpreparacion} disabled/>
                                </Grid.Column>
                                <Grid.Column>
                                <Button icon onClick={() => {handleEliminatePrep(st.id)}}>
                                    <Icon name='minus' />
                                </Button>
                                </Grid.Column>
                            </Grid.Row>
                        ))
                    }
                </Grid>
            </Container>
            <br></br>
            <Button variant="secondary" onClick={props.handleSubmit}>
                Cancelar
            </Button>
        </div>
    );
}

export default ModalBodyUpdatePreparacion;