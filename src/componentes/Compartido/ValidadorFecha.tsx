  import moment from 'moment';

function validadorFecha(info: any){

    const date = info;
    const dateToValidate = moment(date,"YYYY-MM-DD", true);
    
    if(dateToValidate.isValid()){
        return true; 
    }   
    return false;
}

export default validadorFecha;