import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import {api, requestConfig} from '../utils/config'

// Get user details
const profile = async(id,dispatch) => {
    
    try{

    const userCollection = doc(db,'users',id)
 
    const userDocSnap = await getDoc(userCollection)
        
    if(userDocSnap.exists()){
    console.log('entrou')
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

// Update user and details
const updateProfile = async(data, token) => {

    const config = requestConfig("PUT",data, token, true)

    try {

        const res = await fetch(api + "/users/",config)
            .then((res) => res.json())
            .catch((err) => err);
  
      return res;

    } catch (error) {
        console.log(error)
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

// Reset Password
const resetPassword = async(email) => {
    const config = requestConfig("PUT", { email: email })

    try {
        const res = await fetch(api + '/users/reset-password', config)
                .then((res) => res.json())
                .catch((err) => err)

        return res    
    }catch(error) {
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

    console.log(data)
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

  const searchUsers = async(query,token) => {


    const config = requestConfig("GET",null, token)

    try {

        const res = await fetch(api + "/users/search?q=" + query,config)
                    .then((res) => res.json())
                    .catch((err) => err)

        return res

        
    } catch (error) {
        console.log(error)
    }

}
  



const userService = {
    profile,
    updateProfile,
    getUserDetails,
    resetPassword,
    followUser,
    unFollowUser,
    getUserFollowers,
    getUserFollowing,
    searchUsers,
    followUserContainer,
    unFollowUserContainer
}

export default userService