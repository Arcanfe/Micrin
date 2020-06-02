import React from 'react';
import { Container } from 'semantic-ui-react'; 
import Predicciones from './Predicciones/Predicciones';

/**
 * Objeto que establece las propiedades o variables que recibira el componente
 * pase: Token de acceso para realizar las peticiones
 */
type formProps = {
    pase: any
}

/**
 * Funcion que contiene la página Home una vez el usuario inicia sesión.
 * Contiene el componente de las predicciones.
 * Recibe como parámetro el token obtenido en 'Logged'
 */
const Home: React.FC<formProps> = (props: formProps) => {

    return(
        <div>
            <Container raised >
                <h1>
                    Bienvenidos a Micrin.
                </h1>
                <br />
            </Container>
            <Predicciones tok={props.pase} />
        </div>
    );
}

export default Home;
