function binaryDataOperation() {
  const buf = new ArrayBuffer(8);
  console.log("Arraybuffer size", buf.byteLength);

  const dv = new DataView(buf);
  dv.setUint8(0, 3);
  dv.setUint16(1, 513);
  console.log("Data view size", dv.byteLength);

  console.log(dv.getUint8(0));
  console.log(dv.getUint16(1));

  const uint8Array = new Uint8Array([0, 1, 2, 3, 4]);
  console.log("Uint8Array size", uint8Array);

  const nodeBuffer = Buffer.from("Hello BunJS");
  console.log(nodeBuffer, nodeBuffer.toString());

  const blob = new Blob(["<html>Hello BunJS</html>"], { type: "text/html" });
  console.log(blob.size, blob.type);

  const encoder = new TextEncoder();
  const encodedString = encoder.encode("Hello BunJS");
  console.log(encodedString, encodedString.length);

  const decoder = new TextDecoder();
  const decodedString = decoder.decode(encodedString);
  console.log(decodedString, decodedString.length);
}

binaryDataOperation();
