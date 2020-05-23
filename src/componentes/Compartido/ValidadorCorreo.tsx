function validadorCorreo(info: any){

    let emailPattern = new RegExp("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");

    if(emailPattern.test(info)){
        return true;
    }
    return false;


}

export default validadorCorreo;