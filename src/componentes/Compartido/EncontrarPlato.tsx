import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Funcion que permite encontrar si existe un plato por el nombre en los registros
 */
async function encontrarPlato(e:any, nombreP:any){
    try{
        const existe = await axios.get('https://inventario-services.herokuapp.com/invservice/plato/getPlato/?nombre=' + nombreP, e)
        return true;
    }
    catch(error){
        console.log(error);
        return false
    }
    
}

export default encontrarPlato;

encontrarPlato.propTypes = {
    /**
     * Parametro de entrada. Formato del header de la peticion con el token incluido
     */
    e: PropTypes.object.isRequired,
    /**
     * Variable que contiene el nombre del plato
     */
    nombreP: PropTypes.string.isRequired,
    /**
     * Variable booleana que almacena la respuesta de la peticion
     */
    existe: PropTypes.bool
}