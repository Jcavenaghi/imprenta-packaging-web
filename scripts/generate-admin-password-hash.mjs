#!/usr/bin/env node
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error(
      "Usage: node scripts/generate-admin-password-hash.mjs <password>"
    );
    process.exit(1);
  }
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  console.log(`ADMIN_PASSWORD_HASH=${derived.toString("hex")}`);
  console.log(`ADMIN_PASSWORD_SALT=${salt}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});