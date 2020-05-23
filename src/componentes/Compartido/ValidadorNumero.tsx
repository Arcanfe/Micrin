function validadorNumero(info: any){
    let numericPattern =  new RegExp("[0-9]+");

    if(numericPattern.test(info)){
        return true;
    }
    return false;
}

export default validadorNumero;