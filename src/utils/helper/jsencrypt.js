import JsEncrypt from 'jsencrypt'

export const jsencrypt = (password) => {
  // 公钥
  var PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----' +
  'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFDIxLetw5tUQPiO6a+J4fF0gVyk' +
  'xMreoawYvBtWM3KZzkwGhKYNDN9SqyeMNGWqAuA/pFqN1Pu6mpcuewJ1thyWNLjT' +
  'lvo1srt0kMAZgXGjOR4ZxgqyZvbTdJLTA8rkiEfTgiz4c5ZsRlDA0cFJ/lw9ikcR' +
  '7gt9dtpTWt9hCZS5AgMBAAE=' +
  '-----END PUBLIC KEY-----'

  const jse = new JsEncrypt()
  jse.setPublicKey(PUBLIC_KEY)
  let encrypted = jse.encrypt(password)

  return encrypted
}
