/**
 * 工具类
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {// 加密
  encrypt (word, keyStr, ivvStr) {
    // keyStr = keyStr || '1234567887654321'
    // var key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var key = CryptoJS.enc.Utf8.parse(keyStr)
    var ivv = CryptoJS.enc.Utf8.parse(ivvStr)

    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: ivv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding })
    return encrypted.toString()
  }
  // 解密
  // decrypt (word, keyStr) {
  //   keyStr = keyStr || '1234567887654321'
  //   var key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  //   var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  //   return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  // }

}
