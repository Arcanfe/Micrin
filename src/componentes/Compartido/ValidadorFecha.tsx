import moment from 'moment';
import PropTypes from 'prop-types';

/**
 * Funcion de validacion que asegura el formato de la fecha a partir de una expresion regular.
 */
function validadorFecha(info: any){

    const date = info;
    const dateToValidate = moment(date,"YYYY-MM-DD", true);
    
    if(dateToValidate.isValid()){
        return true; 
    }   
    return false;
}

export default validadorFecha;

validadorFecha.propTypes = {
  /**
   * Parametro de entrada. Cadena de caracteres obligatorio para luego ser evaluado.
   */
  info: PropTypes.string.isRequired,
  /**
   * Variable que contendra el 'template' de la fecha para comparar con el parametro.
   */
  dateToValidate: PropTypes.element
}