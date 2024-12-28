import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      dbName: 'BW2'
    })
    console.log('Mongodb database is connected')
  } catch (error) {
    console.log('Error connecting database',error)
    process.exit(1)
  }
}

export default connectDB