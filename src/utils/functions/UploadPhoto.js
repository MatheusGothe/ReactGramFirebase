import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../lib/firebase";


// Função para fazer o upload da imagem
const uploadImage = async({photo:image,photoId}, onProgress) => {
  const user = auth.currentUser
   console.log(image)
  // Verifique o tipo de arquivo
  if (!['image/jpeg', 'image/jpg','image/png','image/avif'].includes(image.type)) {
    throw new Error('Formato de arquivo inválido.');
  }

  const storageRef = ref(storage, `images/${photoId}`)
  const uploadTask = uploadBytesResumable(storageRef,image)
  
  // Crie uma nova Promise para lidar com o processo de upload e obtenção do URL
  const url = await new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(progress)
        console.log(snapshot)
        onProgress(progress); // Chame a função de callback com o progresso atual
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
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
  