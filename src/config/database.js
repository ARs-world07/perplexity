import mongoose from "mongoose";

const connectToDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("connected to MongoDB")
    })
    .catch(err =>{
        console.log("error connected to MongoDB", err)
    }) 
};

export default connectToDB