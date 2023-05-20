export type SignupDto = {
  email: string
  username: string
  firstName?: string
  lastName?: string
  mobile?: number
  password: string
}

export type LoginDto = {
  usernameOrEmail: string
  password: string
}
