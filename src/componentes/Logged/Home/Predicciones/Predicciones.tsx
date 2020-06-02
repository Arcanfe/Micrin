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

    const [predicciones, setPredicciones] = useState<any[]>([]);
    const [plato, setPlato] = useState('');

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

    const mostrarDetalles = () => {
        
    }

    return(
        <Container>
            <Segment textAlign='left'>
                <h4>
                    Las predicciones para el día de hoy son:
                </h4>
                <p>Recuerda que a medida que se van realizando los registros de venta, nuestro algoritmo va afinando y creando predicciones para ti.</p>
                <List bulleted>
                    {predicciones.map(pr => (
                        <a onClick={mostrarDetalles}> + {pr.cantidad} -> {pr.nombre_plato}</a>
                    ))}
             
                </List>
                <p>*Recuerda que la lista mostrada anteriormente es una predicción basada en el resultado de ventas realizadas con anterioridad. No se tiene la certeza del 100% que van a ocurrir. Por favor maneje con cautela los platos a preparar.</p>
            </Segment>
            <br />
            <Segment textAlign='left'>
                <h4>Detalles para preparar {plato}</h4>
                <p color='red'>Mensaje en rojo</p>
                <p color='green'>Mensaje en verde</p>
                <p>*Recuerda que aquellos productos de color rojo, indica que no existen suficientes ingredientes para realizar todos los platos previstos.</p>
            </Segment>
        </Container>
    );
}

export default Predicciones;
