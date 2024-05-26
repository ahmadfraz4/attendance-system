import mongoose from "mongoose";

let uri = "mongodb://127.0.0.1:27017/Attendance-System";


async function Connection(){
    try {
       let conn = await mongoose.connect(process.env.MONGOURI)
       console.log(`Connected to mongodb `);
    } catch (error) {
        console.log(error)
    }
}

export { Connection }