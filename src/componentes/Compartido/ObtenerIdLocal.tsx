import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Funcion que permite realizar la búsqueda del id de un local a partir del token.
 */
async function obtenerIdLocal(e:any){
    const idValor = await axios.get('https://micrin-login-service.herokuapp.com/getIdLocal', e);
    return idValor.data.local_id;
}

export default obtenerIdLocal;

obtenerIdLocal.propTypes = {
    /**
     * Parametro de entrada. Formato del header de la peticion con el token incluido
     */
    e: PropTypes.object.isRequired,
    /**
     * Variable que contendra el codigo del local
     */
    idValor: PropTypes.object
}