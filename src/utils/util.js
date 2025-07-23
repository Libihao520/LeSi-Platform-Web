import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt'

import {
  getPublicKeyService,
} from "@/api/user.js";

//加密函数
export function encrypt(data) {
  const key = CryptoJS.enc.Utf8.parse("C#ACXJAesCode@#!");
  const iv = CryptoJS.enc.Utf8.parse("ACXJV1024AESCODE");
  const content = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// RSA加密方法
export const rsaEncrypt = async (data) => {
  const publicKey = await getPublicKey()
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)

  const encrypted = encryptor.encrypt(data)
  if (!encrypted) {
    throw new Error('加密失败，请检查公钥格式')
  }
  return encrypted
}

const PUBLIC_KEY_STORAGE_KEY = 'rsa_public_key'
const EXPIRE_TIME_STORAGE_KEY = 'rsa_expire_time'

export const getPublicKey = async () => {
  // 从 localStorage 读取
  const storedPublicKey = localStorage.getItem(PUBLIC_KEY_STORAGE_KEY)
  const storedExpireTime = localStorage.getItem(EXPIRE_TIME_STORAGE_KEY)

  // 如果存在且未过期
  if (storedPublicKey && storedExpireTime && Date.now() < parseInt(storedExpireTime)) {
    return storedPublicKey
  }

  // 否则重新获取
  try {
    const res = await getPublicKeyService()
    const newPublicKey = res.data.data
    const newExpireTime = Date.now() + 30 * 60 * 1000

    // 存储到 localStorage
    localStorage.setItem(PUBLIC_KEY_STORAGE_KEY, newPublicKey)
    localStorage.setItem(EXPIRE_TIME_STORAGE_KEY, newExpireTime.toString())

    return newPublicKey
  } catch (error) {
    console.error('获取公钥失败:', error)
    throw error
  }
}

export const clearPublicKey = () => {
  localStorage.removeItem(PUBLIC_KEY_STORAGE_KEY)
  localStorage.removeItem(EXPIRE_TIME_STORAGE_KEY)
}