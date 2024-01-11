const crypto = require("crypto");
const getHash = () => crypto.randomBytes(32).toString('base64');
const apiTokenSalt = getHash();
const transferTokenSalt = getHash();
const adminJwtSecret = getHash();
const jwtSecret = getHash();
const appKeys = [];
for (let i = 0; i < 3; i += 1) {
  appKeys.push(getHash());
}

console.log(`APP_KEYS="${appKeys.join(",")}"`);
console.log(`API_TOKEN_SALT="${apiTokenSalt}"`);
console.log(`ADMIN_JWT_SECRET="${adminJwtSecret}"`);
console.log(`JWT_SECRET="${jwtSecret}"`);
console.log(`TRANSFER_TOKEN_SALT="${transferTokenSalt}"`);