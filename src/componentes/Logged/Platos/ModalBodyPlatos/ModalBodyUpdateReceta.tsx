import React, { useState, useEffect} from 'react';
import { Container, Button, Icon, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { objectValues } from 'react-toastify/dist/utils';

type modalBodyFormProps = {
    handleSubmit: any,
    objectS: any,
    tok: any
}

const ModalBodyUpdateReceta: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const config = {
        headers: props.tok
    }

    const[stockRecetas, setStockRecetas] = useState<any[]>([]);

    useEffect(() => {
        getPreparaciones();
    },[stockRecetas.length]);

    const getPreparaciones = async () => {
        try {
            const result = await axios.get('https://inventario-services.herokuapp.com/invservice/plato/getone/?codigo=' + props.objectS, config);
            let data = result.data.receta
            for(let i = 0 ; i< data.length ; i++ ) {
                data[i].nombreIng = await getNombre(data[i].codigo_spro); 
            }
            setStockRecetas(data);
        } catch(err) {
            console.log(err); 
        }
    }

    const getNombre = async (e:any) => {
        const result= await axios.get('https://inventario-services.herokuapp.com/invservice/stock/getone/?codigo=' + e, config)
        return result.data.nombre;
    }

    const handleEliminatePrep = (e:any) => {
        //Falta poner la url correcta
        axios.post('https://inventario-services.herokuapp.com/invservice/receta/delete?codigo=' + e, '', config)
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
                        stockRecetas.map(st => (
                            <Grid.Row key={st.id}>
                                <Grid.Column>
                                    <Input size='small' placeholder='Nombre ingrediente' value={st.nombreIng} disabled  />
                                </Grid.Column>
                                <Grid.Column>
                                    <Input size='small' placeholder='Cantidad*'  value={st.cantidadxplato} disabled/>
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

export default ModalBodyUpdateReceta;