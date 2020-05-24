import validadorNumero from './ValidadorNumero';
import PropTypes from 'prop-types';

/**
 * Funcion de validacion que asegura el formato del NIT a partir de una expresion regular.
 */
function validadorNit(info: any){
    if(validadorNumero(info) && info.length === 10 ){
        return true;
    }
    return false;

}

export default validadorNit;

validadorNit.propTypes = {
    /**
     * Parametro de entrada. Cadena de caracteres obligatorio para luego ser evaluado.
     */
    info: PropTypes.string.isRequired,
    /**
     * Funcion que lleva al archivo 'ValidadorNumero'
     */
    validadorNumero: PropTypes.func
}