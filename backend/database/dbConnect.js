import mongoose from "mongoose";
const name = "instavibe";
const dbConnect = async () => {
  const dbconnect = await mongoose.connect(
    `${process.env.MONGODB_URL}/${name}`
  );
  console.log(`Database connected to ${dbconnect.connection.host}`);
};

export { dbConnect };
