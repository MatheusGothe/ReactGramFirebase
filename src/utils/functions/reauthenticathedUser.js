import { getAuth, signInWithCredential, EmailAuthProvider } from "firebase/auth";
import { GlobalDispatchContext } from "../../state/context/GlobalContext";


export const reauthenticateUser = async (email, password) => {

    try {
        const auth = getAuth();
        const credential = EmailAuthProvider.credential(email, password);
        await signInWithCredential(auth, credential);
        return {error: false}
    } catch (error) {
        console.log(error)
        return {error: error.message,errorCode: error.code}
    }
        
};

