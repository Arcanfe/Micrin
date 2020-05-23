import React, { useState, useEffect } from 'react';
import { Container, Segment, List } from 'semantic-ui-react'; 
import axios from 'axios';

type modalBodyFormProps = {
    tok: any
}

const Home: React.FC<modalBodyFormProps> = (props: modalBodyFormProps) => {

    const[predicciones, setPredicciones] = useState<any[]>([]);

    useEffect(() => {
        getPredicciones();
       
    }, [predicciones]);

    const getPredicciones = async () => {
        const config = {
            headers: props.tok
        }

        try{
            const resultado = await axios.get('https://analiticaapp.herokuapp.com/analitica', config);
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
                <List bulleted>
                    {predicciones.map(pr => (
                        <List.Item > {pr.cantidad} - {pr.nombre_plato}</List.Item>
                    ))}
             
                </List>
                <p>*Recuerde que la lista mostrada anteriormente es una predicción basada en el resultado de ventas realizadas con anterioridad. No se tiene la certeza del 100% que van a ocurrir. Por favor maneje con cautela los platos a preparar.</p>
            </Segment>
        </Container>
    );
}

export default Home;