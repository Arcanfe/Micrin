import axios from 'axios';
import obtenerIdLocal from './ObtenerIdLocal';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * Funcion que permite crear un nuevo registro de venta
 */
async function modificarRegistroVenta(e:any, valorTot:any, codR:any){
    try{
        const regVent = axios.post('https://inventario-services.herokuapp.com/invservice/registro_venta/update_total?valor_total=' + valorTot + '&codigo=' + codR, '', e )
        toast.success('El valor se ha guardado dentro del registro.');
        return (await regVent).data;
    }
    catch(error){
        console.log(error);
    }
    
}

export default modificarRegistroVenta;

modificarRegistroVenta.propTypes = {
    /**
     * Parametro de entrada. Formato del header de la peticion con el token incluido
     */
    e: PropTypes.object.isRequired,
    /**
     * Variable que contiene el valor final del registro
     */
    valorTot: PropTypes.string.isRequired
}