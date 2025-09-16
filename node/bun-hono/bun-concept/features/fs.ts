import type { BunFile } from "bun";

async function fsOperations() {
  //read a file
  const file: BunFile = Bun.file("read.txt");
  console.log(file.size);
  console.log(file.type);

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = await file.bytes();
  console.log(arrayBuffer, uint8Array);

  const content = "Hello! I am learning Bun for the first time";
  await Bun.write("output.txt", content);
  console.log("File created successfully");

  const inputFile = Bun.file("read.txt");
  await Bun.write("read_copy.txt", inputFile);
  console.log("File copied and created successfully");

  const isFileExists = await Bun.file("read_copy.txt").exists();
  console.log(isFileExists);

  await Bun.file("read_copy.txt").delete();
  console.log("Read file copy deleted successfully!");
}

fsOperations();
