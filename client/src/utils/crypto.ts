import Crypto from 'crypto-js'
import { ENV } from './env'

export function encrypt(text: string): string {
  return Crypto.AES.encrypt(JSON.stringify(text), ENV.VITE_CRYPTO_KEY).toString()
}

export function decrypt(text: string): string {
  const bytes = Crypto.AES.decrypt(text, ENV.VITE_CRYPTO_KEY)
  return JSON.parse(bytes.toString(Crypto.enc.Utf8))
}
