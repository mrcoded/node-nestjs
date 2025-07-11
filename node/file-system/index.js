const path = require('path');
const fs = require('fs');

const dataFolder = path.join(__dirname, "data")
const filePath = path.join(dataFolder, "data.js")

//create a folder using fs
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder)
  console.log("data folder created");
}

//synchronous ways of creating a file
fs.writeFileSync(filePath, "`Hello world`")
console.log("File created successfully")

//read file content
const readFileContent = fs.readFileSync(filePath, "utf8")
console.log("File content", readFileContent)

//appendLine
fs.appendFileSync(filePath, "\n `This is a new line added to the file`")
console.log("New file content added")

//Asynchronous ways of selecting a file
const asyncFilePath = path.join(dataFolder, "async-data.js");

//creating file content
fs.writeFile(asyncFilePath, "`Hello, Async file`", err => {
  if (err) throw err
  console.log("`Async file is created!`")

  //read file content
  fs.readFile(asyncFilePath, "utf8", (err, data) => {
    if (err) throw err
    console.log("`Async file content:`", data)
  })

  //add a new file
  fs.appendFile(asyncFilePath, "\n `This is a new line added to the async file`", (err) => {
    if (err) throw err
    console.log("`New line added to Async file content:`")
  })

  //read updated file content
  fs.readFile(asyncFilePath, "utf8", (err, updatedData) => {
    if (err) throw err
    console.log("`Updated Async file content:`", updatedData)
  })
})