import {api, requestConfig} from '../utils/config'


// Get all stories
const getStories = async(data, token) => {

    const config = requestConfig("GET", data, token)

    try{

        const res = await fetch(api + "/stories", config)
            .then((res) => res.json())
            .catch((err) => err )

        return res

    } catch(error){
        console.log(error)
    }
}
// Get user stories
const getUserStories = async(id, token) => {

    const config = requestConfig("GET",null,token)

    try{

        const res = await fetch(api + `/stories/get/${id}`, config)
            .then((res) => res.json())
            .catch((err) => err )

        return res

    } catch(error){
        console.log(error)
    }
}
// Get user stories
const PostStorie = async(data, token) => {

    const config = requestConfig("POST",data,token,true)

    try{

        const res = await fetch(api + `/stories/create`, config)
            .then((res) => res.json())
            .catch((err) => err )

        return res

    } catch(error){
        console.log(error)
    }
}
// delete a story
const deleteStorie = async(id, token) => {

    const config = requestConfig("DELETE",id,token)

    try{

        const res = await fetch(api + `/stories/delete/${id}`, config)
            .then((res) => res.json())
            .catch((err) => err )


        return res

    } catch(error){
        console.log(error)
    }
}

const storieService = {
    getStories,
    getUserStories,
    PostStorie,
    deleteStorie
}

export default storieService