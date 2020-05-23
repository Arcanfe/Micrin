import validadorNumero from './ValidadorNumero';

function validadorTelefono(info: any){
    if(validadorNumero(info) && (info.length === 7 || info.length === 10)){
        return true;
    }
    return false;
}

export default validadorTelefono;