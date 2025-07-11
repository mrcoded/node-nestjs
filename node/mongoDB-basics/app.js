const mongoose = require('mongoose');


//connect to database
// mongoose.connect("mongodb+srv://decodingade:decodingade2025@cluster0.bps42zc.mongodb.net/").then(() => {
//   console.log("Connected to database");
// }).catch((err) => {
//   console.log(err);
// })

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   age: String,
//   isActive: Boolean,
//   tags: [String],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// })

//create User model
// const User = mongoose.model("User", userSchema)

async function runQueryExample() {
  try {
    //create a new document
    // const newUser = await User.create({
    //   name: "Coded Lord",
    //   email: "codedlord@example.com",
    //   age: "20",
    //   isActive: true,
    //   tags: ["devops", "cloud", "developer"]
    // })

    // const addUser = new User({
    //   name: "John Doe",
    //   email: "johndoe@example.com",
    //   age: "40",
    //   isActive: false,
    //   tags: ["PM", "team lead", "Product"]
    // })
    // await addUser.save()

    // const allUser = await User.find()
    // console.log(allUser);

    // const getUserStatus = await User.find({ isActive: false })
    // console.log(getUserStatus);

    // const getUser = await User.findOne({ name: "Coded Two" })
    // console.log(getUser);

    //Selected fields
    // const selectedFields = await User.find().select("name email -_id")
    //-_id means dont include it
    // console.log(selectedFields);

    // const limitedUsers = await User.find().limit(5).skip(1)
    // console.log(limitedUsers);

    //Sorting Users
    // const sortedUsers = await User.find().sort({ age: 1 })
    // console.log(sortedUsers);

    // const countDocuments = await User.countDocuments({ isActive: false })
    // console.log(countDocuments);

    // const lastUserId = await User.find().sort({ _id: 1 }).skip(1).limit(1)
    // console.log(lastUserId);
    // const deletedUser = await User.findByIdAndDelete(lastUserId)
    // console.log(deletedUser);

    //update user
    // const updatedUser = await User.findByIdAndUpdate(lastUserId, {
    //   $set: {
    //     age: "120"
    //   }, $push: {
    //     tags: "cloud"
    //   }
    // }, { new: true })
    // console.log(updatedUser);
    // return newUser
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.connection.close()
  }
}

// runQueryExample()
