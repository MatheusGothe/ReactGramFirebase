import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../lib/firebase";
import { v4 as uuidv4 } from "uuid";

// Função para fazer o upload da imagem
const uploadImage = async({photo:image, title: photoId}, onProgress) => {


  // Verifique o tipo de arquivo
  if (!['image/jpeg', 'image/jpg','image/png','image/avif'].includes(image.type)) {
    throw new Error('Formato de arquivo inválido.');
  }


  const storageRef = ref(storage, `imagesCompressed/${photoId}`)

  const uploadTask = uploadBytesResumable(storageRef,image)
  
  // Crie uma nova Promise para lidar com o processo de upload e obtenção do URL
  const url = await new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress(progress); // Chame a função de callback com o progresso atual
        switch (snapshot.state) {
          case 'paused':
          
            break;
          case 'running':
            
            break;
        }
      },
      error => {
        console.log(error)
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          resolve(url)
        })
      }
    )
  })

  return url;
}

  
  export {uploadImage}
  