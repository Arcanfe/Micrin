import validadorNumero from './ValidadorNumero';
import PropTypes from 'prop-types';

/**
 * Funcion de validacion que asegura el dato ingresado sea numerico y este dentro del formato de un telefono, sea local o celular.
 */
function validadorTelefono(info: any){
    if(validadorNumero(info) && (info.length === 7 || info.length === 10)){
        return true;
    }
    return false;
}

export default validadorTelefono;

validadorTelefono.propTypes = {
    /**
     * Parametro de entrada. Cadena de caracteres obligatorio para luego ser evaluado.
     */
    info: PropTypes.string.isRequired,
    /**
     * Funcion que lleva al archivo 'ValidadorNumero'
     */
    validadorNumero: PropTypes.func
}