// Creating a Higher Order function to handle Async controller functions
// it will take a function as an argument and will return a function which contains Promises 

let AsyncHandler =  (fn) =>  {
  return (req,res,next) => {
    Promise.resolve(fn(req,res,next)).catch(err => next(err));
  }
};

export {AsyncHandler}