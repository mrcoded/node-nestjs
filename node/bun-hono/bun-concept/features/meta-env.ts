function importMetaAndEnv() {
  console.log(import.meta.url);

  //only returns true if the current module is the main module (bun run)
  console.log("Is this main module ?", import.meta.main);

  console.log(process.env.NODE_ENV);
  console.log(Bun.env.NODE_ENV);
}

importMetaAndEnv();
