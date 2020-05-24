import React from 'react';
import amigable from '../../adicionales/amigable.jpg';
import { Container, Segment, Button } from 'semantic-ui-react'; 
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Componente que almacena la pagina de éxito cuando el usuario confirma su correo.
 */
const Confirmacion: React.FC<{}> = () => {

    return(
        <div>
            <img src={amigable} alt="Cuenta confirmada"/>

            <Container>
            <Segment textAlign='left'>
                <h5>
                    Felicidades, has confirmado tu cuenta.
                </h5>
                <br /> 
                <p>
                    A partir de este momento, podrás iniciar sesión y acceder a todas nuestras funcionalidades.
                    Esperamos sea de tu agrado y te aporte a tu negocio.
                </p>
                <p>Gracias por confiar en nosotros.</p>
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

export default Confirmacion;