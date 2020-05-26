import axios from 'axios';
import obtenerIdLocal from './ObtenerIdLocal';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * Funcion que permite crear un nuevo registro de venta
 */
async function crearRegVentPlato(e:any, rvCodigo:any, platoCodigo:any, cantidad:any){
    try{
        const regVentPlato = await axios.post('https://inventario-services.herokuapp.com/invservice/rv_plato/registro', JSON.parse('{"cod_rv":"' + rvCodigo + '", "cod_plato":"' + platoCodigo + '", "cantidad":"' + cantidad + '"}'), e)
        toast.success('El plato se ha añadido a la preparacion');
        return true;
    }
    catch(error){
        console.log(error);
        return false;
    }
    
}

export default crearRegVentPlato;

crearRegVentPlato.propTypes = {
    /**
     * Parametro de entrada. Formato del header de la peticion con el token incluido
     */
    e: PropTypes.object.isRequired,
    /**
     * Variable que contiene el codigo del registro de venta
     */
    rvCodigo: PropTypes.string.isRequired,
    /**
     * Variable que contiene el codigo del plato
     */
    platoCodigo: PropTypes.string.isRequired,
    /**
     * Variable que contiene la cantidad de platos realizados
     */
    cantidad: PropTypes.string.isRequired,
}