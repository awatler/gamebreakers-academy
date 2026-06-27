import { createContext, useContext } from 'react'

export const SignupModalContext = createContext({
  openSignupModal: () => {},
})

export function useSignupModal() {
  return useContext(SignupModalContext)
}
