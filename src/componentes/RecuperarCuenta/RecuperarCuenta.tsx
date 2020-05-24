import React from 'react';
import { Button, Form, Container, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

/**
 * Funcion que almacena la página donde el usuario podrá recuperar su cuenta.
 */
const RecuperarCuenta: React.FC<{}> = () => {

    return(
        <div>
            <h1>Recuperar Cuenta</h1>
            <Container placeholder>
                <Segment>
                <Form>
                    <Form.Field>
                        <label>Correo</label>
                        <input placeholder='Ingresa tu correo' />
                        <Button type='submit'>Enviar</Button>
                    </Form.Field>
                    <Form.Field>
                        <Segment>
                            <p>
                                En caso de tener una cuenta cerrada durante al menos 60 días, Micrin permitirá
                                volver a recuperar la cuenta existente, de manera que al correo ingresado
                                (el correo relacionado al restaurante), se le mandará un mensaje con los pasos
                                a seguir.    
                            </p>
                        </Segment>
                    </Form.Field>
                    <Link to='/'>
                        <Button type='submit'>Volver</Button>
                    </Link>
                </Form>
                </Segment>
            </Container>
        </div>
    );
}

export default RecuperarCuenta;