import React from 'react';
import empresaPrincipal from '../../adicionales/empresaPrincipal.png';
import costos from '../../adicionales/costos.jpg';
import facturacion from '../../adicionales/facturacion.jpg';
import inventario from '../../adicionales/inventario.jpg';
import { Button, Divider, Grid, Segment, Image, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

/**
 * Funcion que almacena la página principal de la aplicación.
 * Esta página enrutará a las páginas de inicio de sesión, registro y recuperación de cuenta.
 * Los enrutamientos se desarrollan gracias al componente 'Link' de la página 'react-router-dom'
 */
const MainPage: React.FC<{}> = () => {
    return(
        <div>
            <p> </p>
            <br/>
            <Image src={empresaPrincipal} alt="Mincrin- Aplicación para microempresas" centered size='massive'/>    
            <br />
            <Container>
            <Segment raised >
                <h1>
                    Bienvenidos a Micrin.
                </h1>
                <p>
                    Micrin es una aplicación que te ayudará como dueño de una microempresa a la gestión de tu inventario y facturación.
                    Si necesitas de una ayudita adicional en estos temas, Micrin es para ti.
                </p>
                <p>
                    Que lo disfrutes!!
                </p>
            </Segment>
            </Container>
            <br />
            <Container>
            <div className="ui items">
                <div className="item">
                    <div className="image">
                        <Image src={inventario} alt='Controla tu inventario'/>
                    </div>
                    <div className="content">
                        <h4 className="header">Controla tu inventario </h4>
                        <br />
                        <div className="meta">
                            <span>Por medio de esta aplicación podrás llevar más fácilmente lo que tienes y lo que no dentro de tu stock.</span>
                        </div>
                        <div className="description">
                            <p></p>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="image">
                        <Image src={costos} alt='Controla tus gastos'/>
                    </div>
                    <div className="content">
                        <h4 className="header">Controla tus gastos</h4>
                        <br />
                        <div className="meta">
                            <span>Prepara con antelación lo que gastarás en la compra de tus productos, consultando cuánto cuestan los productos que necesitas.</span>
                        </div>
                        <div className="description">
                            <p></p>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="image">
                        <Image src={facturacion} alt='Facilita tu facturacion' />
                    </div>
                    <div className="content">
                        <h4 className="header">Facilita tu facturación</h4>
                        <br />
                        <div className="meta">
                            <span>Ya no hace falta que lleves tus cuentas a mano! Aprovecha la posibilidad de llevar registro de tus ventas por medio de esta aplicación.</span>
                        </div>
                        <div className="description">
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
            </Container>
            <br/>
            <Container>
            <Segment placeholder >
                <Grid columns={2} relaxed='very' stackable>
                <Grid.Column textAlign='center'>
                    <p>¿No te has registrado?</p>
                    <Link to='/register'>
                        <Button>
                            Registrarme
                        </Button>
                    </Link>
                </Grid.Column>

                <Grid.Column verticalAlign='middle' textAlign='center'>
                    <p>¿Ya tienes una cuenta?</p>
                    <Link to='/login'>
                        <Button>
                            Iniciar sesión
                        </Button>
                    </Link>
                </Grid.Column>
                </Grid>
                <Divider vertical>Micrin</Divider>
            </Segment>
            </Container>
            <br />
            <p>
                Para recuperar tu cuenta, hacer click <Link to='/recover'>aquí</Link>
            </p>
            <br />
            <p> </p>
        </div>
    );
}

export default MainPage;