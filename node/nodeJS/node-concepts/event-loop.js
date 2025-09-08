const fs = require('fs');
const crypto = require('crypto');
const { set } = require('mongoose');
//timer=>pending callback queue=>idle, prepare=>poll=>check=>close callbacks

console.log("1, script start");

setTimeout(() => {
  console.log("2, setTimeout cd (macrotask)");
}, 0);

setTimeout(() => {
  console.log("3, setTimeout cd (macrotask)");
}, 0);

setImmediate(() => {
  console.log("4, setImmediate cb (check)");
});

Promise.resolve().then(() => {
  console.log("5, Promise (microtask)");
});

process.nextTick(() => {
  console.log("6, process.nextTick cb (microtask)");
});

fs.readFile(__filename, () => {
  console.log("7, fs.readFile cb (I/O cb macro task)");
})

crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log("8, crypto.pbkdf2 operation (CPU intensive task)");
});

console.log("9, script ends");