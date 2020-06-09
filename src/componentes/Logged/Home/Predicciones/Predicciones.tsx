import React, { useState, useEffect } from 'react';
import { Container, Segment, Button, Label } from 'semantic-ui-react'; 
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
        console.log(f);
        console.log(e);
        try {
            setPlato(f);
            const result = await axios.get('https://inventario-services.herokuapp.com/invservice/plato/getPlato/?nombre=' + f, config);
            let data = result.data.receta
            for(let i = 0 ; i< data.length ; i++ ) {
                data[i].nombreIng = await getNombre(data[i].codigo_spro);
                data[i].cantIng = await getCantidad(data[i].codigo_spro);
                console.log(data[i].cantidadxplato);
                console.log(e);
                console.log(data[i].cantIng);
                if(data[i].cantIng >= (data[i].cantidadxplato * e)){
                    
                    data[i].posible = true;
                    data[i].neces = 0;
                }
                else{
                    data[i].posible = false;
                    data[i].neces = ((data[i].cantidadxplato * e) - data[i].cantIng);
                }
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
                    {predicciones.map(pr => (
                        <div>
                            <p>+ {pr.cantidad_plato} -> {pr.plato} - {pr.precision}</p>
                            <Button onClick={() => {mostrarDetalles(pr.cantidad_plato, pr.plato)}} >Ver disponibilidad</Button>
                        </div>
                    ))}
                <p>*Recuerda el ultimo valor presentado, es una predicción basada en el resultado de ventas realizadas con anterioridad. La probabilidad de certeza se indica junto al nombre.</p>
            </Segment>
            <br />
            <Segment textAlign='left'>
                <h4>Detalles para preparar {plato}</h4>
                {stockRecetas.map(st => (
                    <div>
                   
                        <Label color={st.posible === true ? 'green' : 'red'}>
                            Nombre del ingrediente {st.nombreIng} - Cantidad actual {st.cantIng} - {st.posible === true ? 'Es posible suplir la demanda.':'No es posible suplir la demanda. Necesita comprar ' + st.neces + ' productos más.'}
                        </Label>
                    </div>
                ))}
                <p>*Recuerda que aquellos productos de color rojo, indica que no existen suficientes ingredientes para realizar todos los platos previstos.</p>
            </Segment>
            <br />
            <p> </p>
        </Container>
    );
}

export default Predicciones;
