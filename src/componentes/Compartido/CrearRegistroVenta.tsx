import axios from 'axios';
import obtenerIdLocal from './ObtenerIdLocal';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * Funcion que permite crear un nuevo registro de venta
 */
async function crearRegistroVenta(e:any, valorRV:any, fechaRV:any, mesaRV:any){
    try{
        const varId = await obtenerIdLocal(e);
        const regVent = axios.post('https://inventario-services.herokuapp.com/invservice/registro_venta/registro',  JSON.parse('{"precio_total":' + valorRV + ', "numero_mesa":' + mesaRV + ', "fecha":"' + fechaRV + '", "cod_local":"' + varId + '"}'), e )
        toast.success('El registro se ha creado satisfactoriamente');
        return (await regVent).data;
    }
    catch(error){
        console.log(error);
    }
    
}

export default crearRegistroVenta;

crearRegistroVenta.propTypes = {
    /**
     * Parametro de entrada. Formato del header de la peticion con el token incluido
     */
    e: PropTypes.object.isRequired,
    /**
     * Variable que contiene fecha del registro de venta para hacer la creacion del registro
     */
    fechaRV: PropTypes.string.isRequired,
    /**
     * Variable que contiene el numero de la mesa para hacer la peticion
     */
    mesaRV: PropTypes.string.isRequired,
    /**
     * Variable que contiene el valor/costo total del registro para hacer la peticion
     */
    valorRV: PropTypes.string.isRequired,
    /**
     * Variable booleana que almacena la respuesta de la peticion
     */
    regVent: PropTypes.bool
}