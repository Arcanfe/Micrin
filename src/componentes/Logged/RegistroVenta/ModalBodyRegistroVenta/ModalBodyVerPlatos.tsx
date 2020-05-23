import React, { useState, useEffect} from 'react';
import { Container, Button, Icon, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { objectValues } from 'react-toastify/dist/utils';

type modalBodyFormProps = {
    objectS: any,
    llave: any
}

const ModalBodyVerPlatos: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const config = {
        headers: props.llave
    }

    const[stockPlatos, setStockPlatos] = useState<any[]>([]);

    useEffect(() => {
        getPlatos();
    },[stockPlatos.length]);

    const getPlatos = async () => {
        try {
            const result = await axios.get('https://inventario-services.herokuapp.com/invservice/registro_venta/getone?codigo=' + props.objectS, config);
            console.log(result);
            let data = result.data.rv_plato
            for(let i = 0 ; i< data.length ; i++ ) {
                data[i].nombreIng = await getNombre(data[i].cod_plato); 
            }
            setStockPlatos(data);
        } catch(err) {
            console.log(err); 
        }
    }

    const getNombre = async (e:any) => {
        const result= await axios.get('https://inventario-services.herokuapp.com/invservice/plato/getone/?codigo=' + e, config)
        return result.data.nombre;
    }

    return(
        <div>
            <Container>
                <br></br>
                <Grid columns={3} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <label>Nombre del plato:</label>
                        </Grid.Column>
                        <Grid.Column>
                            <label>Cantidad:</label>
                        </Grid.Column>
                    </Grid.Row>
                    {
                        stockPlatos.map(st => (
                            <Grid.Row key={st.id}>
                                <Grid.Column>
                                    <Input size='small' placeholder='Nombre plato' value={st.nombreIng} disabled  />
                                </Grid.Column>
                                <Grid.Column>
                                    <Input size='small' placeholder='Cantidad*'  value={st.cantidad} disabled/>
                                </Grid.Column>
                                <Grid.Column>
                                </Grid.Column>
                            </Grid.Row>
                        ))
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default ModalBodyVerPlatos;