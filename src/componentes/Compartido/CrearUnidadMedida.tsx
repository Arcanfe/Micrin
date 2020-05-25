import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Funcion que permite crear una nueva unidad de medida
 */
async function crearUnidadMedida(e:any, f:any, g:any){
    try{
        const existe = await axios.post('https://inventario-services.herokuapp.com/invservice/unidadmedida/registro', JSON.parse('{"unidad_medida":"' + f + '", "cantidad":' + g + '}'), e);
        return true;
    }
    catch(error){
        return false;
    }
    
}

export default crearUnidadMedida;

crearUnidadMedida.propTypes = {
    /**
     * Parametro de entrada. Formato del header de la peticion con el token incluido
     */
    e: PropTypes.object.isRequired,
    /**
     * Variable que contiene la unidad de medida
     */
    f: PropTypes.string.isRequired,
    /**
     * Variable que contiene la cantidad de la unidad de medida
     */
    g: PropTypes.string.isRequired,
    /**
     * Variable booleana que indicara si existe o no la unidad de medida
     */
    existe: PropTypes.bool
}