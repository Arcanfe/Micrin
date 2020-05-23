import React from 'react';
import tesoro from '../../adicionales/tesoro.jpg';
import { Container, Segment, Button } from 'semantic-ui-react'; 
import { Link } from 'react-router-dom';

const Recuperado: React.FC<{}> = () => {

    return(
        <div>
            <img src={tesoro} alt="Cuenta recuperada"/>

            <Container>
            <Segment textAlign='left'>
                <h5>
                    Hemos logrado recuperar tu cuenta
                </h5>
                <p>
                    Tu cuenta ha sido recuperada por Micrin y puedes volver a usar todos tus datos almacenados.
                    A la próxima ten cuidado estar completamente seguro antes de eliminarla.
                </p>
                <p>Disfruta nuestro contenido.</p>
                <Link to='/'>
                    <Button>
                        Volver a la página principal
                    </Button>
                </Link>
            </Segment>
        </Container>
        

        </div>
    );
}

export default Recuperado;