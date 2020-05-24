import PropTypes from 'prop-types';

/**
 * Funcion de validacion que asegura valor sea un dato numerico.
 */
function validadorNumero(info: any){
    let numericPattern =  new RegExp("[0-9]+");

    if(numericPattern.test(info)){
        return true;
    }
    return false;
}

export default validadorNumero;

validadorNumero.propTypes = {
    /**
     * Parametro de entrada. Cadena de caracteres obligatorio para luego ser evaluado.
     */
    info: PropTypes.string.isRequired,
    /**
     * Variable que almacena el patrón numerico para luego compararlo con el parámetro.
     */
    numericPattern: PropTypes.element
}