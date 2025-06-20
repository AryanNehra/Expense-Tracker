const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENC_KEY, 'hex');
const ivLength = 16;

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

exports.decrypt = (cipherText) => {
  const [ivHex, encrypted] = cipherText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
