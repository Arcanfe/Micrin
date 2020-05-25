import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Funcion que permite realizar determinar si existe una unidad de medida
 */
async function existeUnidadMedida(e:any, f:any, g:any){
    try{
        const existe = await axios.get('https://inventario-services.herokuapp.com/invservice/unidadmedida/getcode?nombre=' + f + '&cantidad=' + g, e);
        return true;
    }
    catch(error){
        return false;
    }
    
}

export default existeUnidadMedida;

existeUnidadMedida.propTypes = {
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