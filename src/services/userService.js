import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { auth, db, storage } from '../lib/firebase'
import { requestConfig} from '../utils/config'

// Get user details
const profile = async(id,dispatch) => {
    
    try{

    const userCollection = doc(db,'users',id)
 
    const userDocSnap = await getDoc(userCollection)
        
    if(userDocSnap.exists()){
     dispatch({
       type:'SET_USER',
       payload: {
         user: userDocSnap.data()
       }
     })

     
 
     return userDocSnap.data()
    }


    }catch(error){
        console.log(error)
        return error
    }
}

// Get user details
const getUserDetails = async(id,dispatch) => {

    try {
        
        const userCollection = doc(db,'users',id)

        const userDocSnap = await getDoc(userCollection)
     
        if(userDocSnap.exists()){

            
         // Agora, vamos buscar o post do usuário
         const postsQuery = query(collection(db,'posts'),where('userId','==',id),orderBy('timestamp','desc'))
         const postsQuerySnapShot = await getDocs(postsQuery)

         let photoData = []

         postsQuerySnapShot.forEach((doc) => {
            photoData.push(doc.data())
         })

         const userRef = doc(db,'users',auth.currentUser.uid)
         const user = await getDoc(userRef)


    
         // Você pode despachar o post aqui ou retorná-lo
    
         
         return {user: userDocSnap.data(), photos: photoData,userAuth:user.data()};
        }

    } catch (error) {
        console.log(error)
    }
}


// Follow a user 
const followUser = async(data) => {

    const {user,userAuth} = data

    try{
        
        const userRef = doc(db,'users',user.id)

        await updateDoc(userRef, {
            followers: arrayUnion(userAuth.id)
        })

        const userAuthRef = doc(db,'users',userAuth.id)

        await updateDoc(userAuthRef,{
            following:arrayUnion(user.id)
        })

          
    }catch(error){
        console.log(error)
    }

}
// UnFollow a user 
const unFollowUser = async(unFollowData) => {

    const {user,userAuth} = unFollowData

    try{
        const userRef = doc(db,'users',user.id)

        await updateDoc(userRef,{
            followers: arrayRemove(userAuth.id)
        })

        const userAuthRef = doc(db,'users',userAuth.id)
        await updateDoc(userAuthRef,{
            following: arrayRemove(user.id)
        })
     
    }catch(error){
        console.log(error)
    }

}
// Follow a user 
const followUserContainer = async(data) => {
    const {user,userAuth} = data
    try{
        const userRef= doc(db,'users',user.id)
        const userAuthRef = doc(db,'users',userAuth.id)

        const [userSnap,userAuthSnap] = await Promise.all([
            getDoc(userRef),
            getDoc(userAuthRef)
        ])

        await updateDoc(userAuthRef,{
            following: arrayUnion(user.id)
        })

        await updateDoc(userRef,{
            followers: arrayUnion(userAuth.id)
        })

        return {user:userSnap.data(),userAuth:userAuthSnap.data()}     
    }catch(error){
        console.log(error)
    }

}
// UnFollow a user 
const unFollowUserContainer = async(data) => {

    const {user,userAuth} = data
    try{
        const userRef= doc(db,'users',user.id)
        const userAuthRef = doc(db,'users',userAuth.id)

        const [userSnap,userAuthSnap] = await Promise.all([
            getDoc(userRef),
            getDoc(userAuthRef)
        ])

        await updateDoc(userAuthRef,{
            following: arrayRemove(user.id)
        })

        await updateDoc(userRef,{
            followers: arrayRemove(userAuth.id)
        })

        return {user:userSnap.data(),userAuth:userAuthSnap.data()}     
    }catch(error){
        console.log(error)
    }

}
const getUserFollowers = async (data) => {

    try {
      const userRef = doc(db, 'users', data.id);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const followerIds = userData.followers;
  
        // Buscar os documentos dos seguidores
        const followerRefs = followerIds.map(id => doc(db, 'users', id));
        const followerSnaps = await Promise.all(followerRefs.map(getDoc));
  
        // Filtrar os seguidores que existem
        const followers = followerSnaps.filter(snap => snap.exists()).map(snap => snap.data());
  
        return followers;
      }
    } catch (error) {
      console.log(error);
    }
  };
  
// Get user Followers
const getUserFollowing = async (data) => {

    const userRef = doc(db,'users',data.id)
    const userSnap = await getDoc(userRef)

    if(userSnap.exists()){
        const userData = userSnap.data()
        const followingIds = userData.following

        const followingRefs = followingIds.map(id => doc(db,'users',id))
        const followingSnap = await Promise.all(followingRefs.map(getDoc))

        const followings = followingSnap.filter(snap => snap.exists()).map(snap => snap.data());
 
        return followings

    }
  
    try {
      
    } catch (error) {
      console.log(error);
    }
  };

export const searchUsers = async(input) => {
   
    try {
        const usersRef = collection(db,'users')
        const snapShot = await getDocs(usersRef)

        let users = []

        snapShot.forEach(doc => {
            users.push(doc.data())
        })
        
        return users

        
    } catch (error) {
        console.log(error)
    }

}
  

const userService = {
    profile,
    getUserDetails,
    followUser,
    unFollowUser,
    getUserFollowers,
    getUserFollowing,
    followUserContainer,
    unFollowUserContainer
}

export default userService