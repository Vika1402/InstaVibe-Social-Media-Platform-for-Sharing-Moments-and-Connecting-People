import mongoose from "mongoose";
const name = "instavibe";
const dbConnect = async () => {
  try {
    const dbconnect = await mongoose.connect(
      `${process.env.MONGODB_URL}/${name}`
    );
    console.log(`Database connected to ${dbconnect.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export { dbConnect };
