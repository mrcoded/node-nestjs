//streams are objects that lets you read data from the source of a file
//and write data to a destination
//readable => use for read
// writable => write to a file
//duplex => used for both read and write (TCP socket)
//transform => zlib streams

const fs = require('fs');
const zlib = require('zlib'); //compression gzip
const crypto = require('crypto');
const { Transform } = require("stream");

class EncryptStream extends Transform {
  constructor(key, vector) {
    super();
    this.key = key
    this.vector = vector
  }

  _transform(chunk, encoding, callback) {
    const cipher = crypto.createCipheriv("aes-256-cbc", this.key, this.vector)
    const encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]) //encrypt chunk data
    this.push(encrypted)
    callback()
  }
}

const key = crypto.randomBytes(32)
const vector = crypto.randomBytes(16)

const readableStream = fs.createReadStream("input.txt")

//new gzip object to compress the stream of data
const gzipStream = zlib.createGzip(key, vector)

const encryptStream = new EncryptStream(key, vector)

const writableStream = fs.createWriteStream("output.txt.gz.enc")

//read => compress => encrypt => write
readableStream.pipe(gzipStream).pipe(encryptStream).pipe(writableStream)

console.log("read=>compress=>write data")