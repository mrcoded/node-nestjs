//buffers are objects that handles binary datas
//fs operations, cryptography, image processing

//allocates a buffer of 10 bytes => 10 zeros
const buffOne = Buffer.alloc(10)
console.log(buffOne);

const bufferFromString = Buffer.from("Hello")
console.log(bufferFromString);

const bufferFromArrayInteger = Buffer.from([1, 2, 3, 4, 5])
console.log(bufferFromArrayInteger);

buffOne.write("Hello")
console.log("after write", buffOne.toString());

console.log("first byte", bufferFromString[0]);

console.log("slice first 4 bytes", bufferFromString.slice(1, 4));

const concatBuffs = Buffer.concat([buffOne, bufferFromString])
console.log("concat", concatBuffs)

console.log("to json", concatBuffs.toJSON());
