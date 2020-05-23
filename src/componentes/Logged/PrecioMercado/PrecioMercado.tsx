import React, { useState, useEffect } from 'react';
import { Table, Container } from 'semantic-ui-react';
import axios from 'axios';

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