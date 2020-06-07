import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Funcion que permite obtener el codigo de un plato a partir del nombre
 */
async function obtenerInformacionPlato(e:any, nombreP:any){
    try{
        const existe = await axios.get('https://inventario-services.herokuapp.com/invservice/plato/getPlato/?nombre=' + nombreP, e)
        return existe.data;
    }
    catch(error){
        console.log(error);
    }
    
}

export default obtenerInformacionPlato;

obtenerInformacionPlato.propTypes = {
    /**
     * Parametro de entrada. Formato del header de la peticion con el token incluido
     */
    e: PropTypes.object.isRequired,
    /**
     * Variable que contiene el nombre del plato
     */
    nombreP: PropTypes.string.isRequired,
    /**
     * Variable que almacena la respuesta de la peticion
     */
    existe: PropTypes.bool
}