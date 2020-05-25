import React, { useState, useEffect} from 'react';
import { Container, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Objeto que contiene los parámetros/props del contenedor
 * ObjectS: Código del registro seleccionado
 * llave: token para ejecutar las peticiones al API
 */
type modalBodyFormProps = {
    objectS: any,
    llave: any
}

/**
 * Función que contiene el modal que se muestra para ver un registro de venta
 */
const ModalBodyVerPlatos: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {
    /**
     * Variable que establece el formato del objeto que se ha de pasar como 'header' en las peticiones.
     * Emplea el token recibido en las propiedades.
     */
    const config = {
        headers: props.llave
    }
    /**
     * Variable array que almacena los platos de un registro de venta particular
     */
    const[stockPlatos, setStockPlatos] = useState<any[]>([]);

    /**
     * Funcion que inicializa el componente. Se carga la informacion de un registro de venta
     */
    useEffect(() => {
        getPlatos();
    },[stockPlatos.length]);
    /**
     * Funcion que realiza la peticion al API para obtener la informacion de un registro de venta particular
     */
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
    /**
     * Funcion que realiza un llamado al API para obtener el nombre de un plato a partir del codigo recibido por el parametro.
     */
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