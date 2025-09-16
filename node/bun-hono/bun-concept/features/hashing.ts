async function hashingOperations() {
  const password = "123456";
  const hashedPassword = await Bun.password.hash(password);

  console.log(hashedPassword);
  const isPasswordCorrect = await Bun.password.verify(password, hashedPassword);
  console.log(isPasswordCorrect);

  const argonHashedPassword = await Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 4,
    timeCost: 3,
  });
  console.log(argonHashedPassword);

  const bcryptHashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
  console.log(bcryptHashedPassword);
}

hashingOperations();
