import PropTypes from 'prop-types';
/**
 * Funcion de validacion que asegura le formato del correo a partir de una expresion regular..
 */
function validadorCorreo(info: any){

    let emailPattern = new RegExp("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");

    if(emailPattern.test(info)){
        return true;
    }
    return false;


}

export default validadorCorreo;

validadorCorreo.propTypes = {
    /**
     * Parametro de entrada. Cadena de caracteres obligatorio para luego ser evaluado.
     */
    info: PropTypes.string.isRequired,
    /**
     * Variable que contendra la expresion regular para comparar con el parametro.
     */
    emailPattern: PropTypes.element
}