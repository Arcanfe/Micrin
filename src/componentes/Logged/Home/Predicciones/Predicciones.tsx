import React, { useState, useEffect } from 'react';
import { Container, Segment, List } from 'semantic-ui-react'; 
import axios from 'axios';
import PropTypes from 'prop-types';

type modalBodyFormProps = {
    tok: any
}

/**
 * Funcion que almacena el componente de predicciones/analítica de datos de la aplicación.
 * Recibe como parámetro el token para realizar las peticiones al servidor.
 */
const Predicciones: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const[predicciones, setPredicciones] = useState<any[]>([]);

    useEffect(() => {
        getPredicciones();
       
    }, [predicciones]);

    const getPredicciones = async () => {
        const config = {
            headers: props.tok
        }

        try{
            const resultado = await axios.get('https://inventario-services.herokuapp.com/invservice/analitica', config);
            console.log(resultado);
            setPredicciones(resultado.data);
            console.log(predicciones);
       }
       catch(err){
           console.log(err);
       }
    }

    return(
        <Container>
            <Segment textAlign='left'>
                <h5>
                    Las predicciones para el día de hoy son:
                </h5>
                <p>Recuerda que a medida que se van realizando los registros de venta, nuestro algoritmo va afinando y creando predicciones para ti.</p>
                <List bulleted>
                    {predicciones.map(pr => (
                        <List.Item > {pr.cantidad} - {pr.nombre_plato}</List.Item>
                    ))}
             
                </List>
                <p>*Recuerda que la lista mostrada anteriormente es una predicción basada en el resultado de ventas realizadas con anterioridad. No se tiene la certeza del 100% que van a ocurrir. Por favor maneje con cautela los platos a preparar.</p>
            </Segment>
        </Container>
    );
}

export default Predicciones;
