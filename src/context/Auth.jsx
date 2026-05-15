import { createContext, useContext, useReducer, useEffect } from "react"

const AuthContext = createContext()

// Get initial state from localStorage
const storedUser = JSON.parse(localStorage.getItem('user'))
const initialState = storedUser 
    ? { isAuth: true, user: storedUser } 
    : { isAuth: false, user: {} }

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET_LOGIN":
            return { isAuth: true, user: payload }
        case "SET_PROFILE":
            return { ...state, user: payload }
        case "SET_LOGOUT":
            return { isAuth: false, user: {} }
        default:
            return state
    }
}

const Auth = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Sync localStorage when state changes
    useEffect(() => {
        if (state.isAuth) {
            localStorage.setItem('user', JSON.stringify(state.user))
        } else {
            localStorage.removeItem('user')
        }
    }, [state])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export default Auth