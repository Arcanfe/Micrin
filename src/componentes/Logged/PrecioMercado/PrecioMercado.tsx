import React, { useState, useEffect } from 'react';
import { Table, Container } from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Funcion que almacena el componente de 'Precio de mercado' de la aplicación.
 * En esta función se hace el llamado al API para obtener los valores de los precios de corabastos.
 */
const PrecioMercado: React.FC<{}> = () => {

    const[stock, setStock] = useState<any[]>([]);

    useEffect(() => {
        axios.get('https://corabastosapp.herokuapp.com/data')
        .then(result => {
            setStock(result.data);
        }).catch(console.log);
    },[]);

    return(
        <div>
            <Container raised >
                <h1>
                    Precio del mercado
                </h1>
            </Container>
            <h5>
                De acuerdo a un mercado local, Corabastos, los precios diarios de los productos son:
            </h5>
            <Table fixed >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Nombre</Table.HeaderCell>
                        <Table.HeaderCell>Presentación </Table.HeaderCell>
                        <Table.HeaderCell>Cantidad </Table.HeaderCell>
                        <Table.HeaderCell>Unidad de medida </Table.HeaderCell>
                        <Table.HeaderCell>Precio por unidad</Table.HeaderCell>
                        <Table.HeaderCell>Precio por presentación </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                {stock.map(st => (
                    <Table.Row>
                        <Table.Cell>{st.nombre}</Table.Cell>
                        <Table.Cell>{st.presentacion}</Table.Cell>
                        <Table.Cell>{st.cantidad}</Table.Cell>
                        <Table.Cell>{st.unidad}</Table.Cell>
                        <Table.Cell>{st.valorxunidad}</Table.Cell>
                        <Table.Cell>{st.cal_extra}</Table.Cell>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table>
        </div>
    );
}

export default PrecioMercado;

PrecioMercado.propTypes = {
    /**
     * Arreglo que recibe cada uno de los objetos a presentar.
     * Almacena los productos que se ofertan en corabastos para posteriormente mostrarlos.
     */
    stock: PropTypes.array,
    /**
     * Función clásica de react hooks que permite realizar lo que contenga desde el moomento en que se renderiza por primera vez el componente.
     * Para el caso particular, se realiza el llamado al API en esta función.
     */
    useEffect: PropTypes.func
}