import { useContext } from 'react'
import { AuthContext, AuthContextType } from 'src/context/AuthContext'

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
