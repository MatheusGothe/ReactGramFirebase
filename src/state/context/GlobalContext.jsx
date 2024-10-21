import React, { createContext, useEffect, useReducer } from 'react'
import { globalReducer } from '../reducers/globalReducer'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../lib/firebase'


const initialState = {
  user: [],
  currentUser: [],
  info: {},
  photos: [],
  photo: [],
  loading: false,
  smallLoading: false,
  message: null,
  error: false,
  success: false,
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: false,
  isUploadPostModalOpen: false
}
const GlobalContext = createContext(initialState)
const GlobalDispatchContext = createContext(null) 

const GlobalContextProvider = ({children}) => {

    const [state,dispatch] = useReducer(globalReducer, initialState,)

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async (user) => {
        if(user){
          dispatch({
            type: 'SET_IS_AUTHENTICATED',
            payload: {
              isAuthenticated: true
            }
          })  
        } 
          dispatch({
            type: 'SET_LOADING',
            payload: {
              isLoading: false
            }
          })

      })

      return () => unsubscribe()

    },[])

  return (
    <GlobalContext.Provider value={state} >
         <GlobalDispatchContext.Provider value={dispatch} >
            {children}
         </GlobalDispatchContext.Provider>
     </GlobalContext.Provider>
  )
}

export {
    GlobalContext,GlobalDispatchContext
}


export default GlobalContextProvider