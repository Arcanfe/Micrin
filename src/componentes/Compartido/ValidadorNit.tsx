import validadorNumero from './ValidadorNumero';

function validadorNit(info: any){
    if(validadorNumero(info) && info.length === 10 ){
        return true;
    }
    return false;

}

export default validadorNit;