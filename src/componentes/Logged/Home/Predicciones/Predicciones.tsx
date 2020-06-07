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

    const config = {
        headers: props.tok
    }

    const [predicciones, setPredicciones] = useState<any[]>([]);
    const [plato, setPlato] = useState('');
    const [impresion, setImpresion] = useState('');
    const [stockRecetas, setStockRecetas] = useState<any[]>([]);

    useEffect(() => {
        getPredicciones();
       
    }, [predicciones]);

    const getPredicciones = async () => {
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

    const mostrarDetalles = async (e:any, f:any) => {
        try {
            const result = await axios.get('https://inventario-services.herokuapp.com/invservice/plato/getone/?codigo=' + f, config);
            let data = result.data.receta
            for(let i = 0 ; i< data.length ; i++ ) {
                data[i].nombreIng = await getNombre(data[i].codigo_spro);
                data[i].cantIng = await getCantidad(data[i].codigo_spro);
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

    const getCantidad = async (e:any) => {
        const result= await axios.get('https://inventario-services.herokuapp.com/invservice/stock/getone/?codigo=' + e, config)
        return result.data.cantidad_total;
    }

    return(
        <Container>
            <Segment textAlign='left'>
                <h4>
                    Las predicciones para el día de hoy son:
                </h4>
                <p>Recuerda que a medida que se van realizando los registros de venta, nuestro algoritmo va afinando y creando predicciones para ti.</p>
                <p>Selecciona un plato en la lista para ver si tienes los ingredientes necesarios.</p>
                <List>
                    {predicciones.map(pr => (
                        <List.Item onClick={() => mostrarDetalles(pr.cantidad, pr.nombre_plato)} > + {pr.cantidad} -> {pr.nombre_plato}</List.Item>
                    ))}
             
                </List>
                <p>*Recuerda que la lista mostrada anteriormente es una predicción basada en el resultado de ventas realizadas con anterioridad. No se tiene la certeza del 100% que van a ocurrir. Por favor maneje con cautela los platos a preparar.</p>
            </Segment>
            <br />
            <Segment textAlign='left'>
                <h4>Detalles para preparar {plato}</h4>
                <p color='red'>Mensaje en rojo</p>
                <p color='green'>Mensaje en verde</p>
                {stockRecetas.map(st => (
                    <div>
                        Nombre del ingrediente {st.nombreIng} - Cantidad actual {st.cantIng}
                    </div>
                    
                ))}
                <p>*Recuerda que aquellos productos de color rojo, indica que no existen suficientes ingredientes para realizar todos los platos previstos.</p>
            </Segment>
        </Container>
    );
}

export default Predicciones;
