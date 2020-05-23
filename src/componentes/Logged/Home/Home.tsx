import React, { useState, useEffect } from 'react';
import { useLocation} from 'react-router-dom';
import { Container, Segment, List } from 'semantic-ui-react'; 
import Predicciones from './Predicciones/Predicciones';

type formProps = {
    pase: any
}

const Home: React.FC<formProps> = (props: formProps) => {

    return(
        <div>
            <Container raised >
                <h1>
                    Bienvenidos a Mincrin.
                </h1>
            </Container>
            <Predicciones tok={props.pase} />
        </div>
    );
}

export default Home;