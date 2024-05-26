// creating custom error class to handle api errors 
class ApiError extends Error{
    constructor(statusCode ,message = 'something went wrong', error = [] , stack = ''){
        super(message);
        this.statusCode = statusCode;
        this.success = false
        this.message = message;
        this.error = error;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}