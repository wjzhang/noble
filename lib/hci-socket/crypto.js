const crypto = require('crypto');

function r () {
  return crypto.randomBytes(16);
}

function c1 (k, r, pres, preq, iat, ia, rat, ra) {
  const p1 = Buffer.concat([
    iat,
    rat,
    preq,
    pres
  ]);

  const p2 = Buffer.concat([
    ra,
    ia,
    Buffer.from('00000000', 'hex')
  ]);

  let res = xor(r, p1);
  res = e(k, res);
  res = xor(res, p2);
  res = e(k, res);

  return res;
}

function s1 (k, r1, r2) {
  return e(k, Buffer.concat([
    r2.subarray(0, 8),
    r1.subarray(0, 8)
  ]));
}

function e (key, data) {
  key = swap(key);
  data = swap(data);

  const cipher = crypto.createCipheriv('aes-128-ecb', key, '');
  cipher.setAutoPadding(false);

  return swap(Buffer.concat([
    cipher.update(data),
    cipher.final()
  ]));
}

function xor (b1, b2) {
  const result = Buffer.alloc(b1.length);

  for (let i = 0; i < b1.length; i++) {
    result[i] = b1[i] ^ b2[i];
  }

  return result;
}

function swap (input) {
  const output = Buffer.alloc(input.length);

  for (let i = 0; i < output.length; i++) {
    output[i] = input[input.length - i - 1];
  }

  return output;
}

module.exports = {
  r: r,
  c1: c1,
  s1: s1,
  e: e
};
