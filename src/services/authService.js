// import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import {api, requestConfig} from '../utils/config'
// import { auth } from '../lib/firebase';

// // Register a user
// const register = async(data) => {

//     const config = requestConfig("POST",data)

//     try {
//         const res = await fetch(api + "/users/register", config)
//           .then((res) => res.json())
//           .catch((err) => err);


//         // if(res._id){
//         //     localStorage.setItem("user", JSON.stringify(res))
//         // }


//         return res

//     } catch (error) {
//         console.log(error)
//     }

// }

// // Logout a user
// const logout = () => {
    
//      signOut(auth)
// }

// // Sign in a user
// const login = async(data) => {

//    const {email,password} = data

//     try{

//         const res = await signInWithEmailAndPassword(auth,email,password)
        

     
//         return res;

//     } catch(error){
//         console.log(error)
//         return error
//     }
// }

// const sendVerificattionEmail = async(email) => {
//     const data = {
//         email
//     }
//     const config = requestConfig("POST",data)
//     try{

//         const res = await fetch(api + '/users/send-email', config)
//             .then((res) => res.json())
//             .catch((err) =>  err)

        

//         console.log(res)
//         return res;

//     } catch(error){
//         console.log(error)
//     }

// }

// const authService = {
//     register,
//     logout,
//     login,
//     sendVerificattionEmail
// }
// export default authService