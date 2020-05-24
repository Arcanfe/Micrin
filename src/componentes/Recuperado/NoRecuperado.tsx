import React from 'react';
import fallido from '../../adicionales/fallido.jpg';
import { Container, Segment, Button } from 'semantic-ui-react'; 
import { Link } from 'react-router-dom';

/**
 * Funcion que almacena la página de que notifica al usuario que no se ha podido recuperar su cuenta.
 */
const Recuperado: React.FC<{}> = () => {

    return(
        <div>
            <img src={fallido} alt="Cuenta no recuperada"/>

            <Container>
            <Segment textAlign='left'>
                <h5>
                    Lastimosamente, no hemos logrado recuperar tu cuenta
                </h5>
                <p>
                    Tu cuenta ha sobrepasado el tiempo posible de recuperación, por lo que tenemos almacenados tus datos dentro del sistema.
                    Te invitamos a crear otra cuenta para poder acceder a nuestras funcionalidades.
                </p>
                <p>Gracias por tu comprensión.</p>
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