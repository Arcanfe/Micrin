import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Funcion que permite encontrar el codigo de una unidad de medida a partir del nombre y cantidad
 */
async function buscarCodigoUnidadMedida(e:any, f:any, g:any){
    try{
        const existe = await axios.get('https://inventario-services.herokuapp.com/invservice/unidadmedida/getcode?nombre=' + f + '&cantidad=' + g, e);
        return existe.data.codigo;
    }
    catch(error){
        console.log(error);
    }
    
}

export default buscarCodigoUnidadMedida;

buscarCodigoUnidadMedida.propTypes = {
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
     * Variable booleana que almacena la respuesta de la peticion
     */
    existe: PropTypes.bool
}