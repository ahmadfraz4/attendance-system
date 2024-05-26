// ApiResponse class To handle api responses ... ********
// this class will return an object with status code, success flag, and message data *************
class ApiResponse{
    constructor(statusCode, success, message){
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
    }
}

export { ApiResponse}