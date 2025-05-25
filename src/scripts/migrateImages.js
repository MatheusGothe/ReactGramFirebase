const admin = require('firebase-admin');
const sharp = require('sharp');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, './chavePrivadaFirebase.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'instagramclone-7c9f7.appspot.com'
});

const bucket = admin.storage().bucket();

async function deleteCompressedFolder() {
  console.log('Deletando pasta imagesCompressed...');
  const [files] = await bucket.getFiles({ prefix: 'imagesCompressed/' });

  if (files.length === 0) {
    console.log('Pasta imagesCompressed já está vazia.');
    return;
  }

  await Promise.all(files.map(file => file.delete()));
  console.log('Pasta imagesCompressed deletada com sucesso.');
}

async function migrateImages() {
  console.log('Iniciando migração de imagens...');
  const [files] = await bucket.getFiles({ prefix: 'images/' });
  console.log(`Total de arquivos encontrados: ${files.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const [metadata] = await file.getMetadata();
      const token = metadata.metadata?.firebaseStorageDownloadTokens;

      if (!token) {
        console.warn(`Arquivo ${file.name} não possui token de download. Pulando.`);
        continue;
      }

      const [buffer] = await file.download();

      const compressedBuffer = await sharp(buffer)
        .resize(128)
        .jpeg({ quality: 100 })
        .toBuffer();

      const destination = file.name.replace('images/', 'imagesCompressed/');
      const fileCompressed = bucket.file(destination);

      await fileCompressed.save(compressedBuffer, {
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            firebaseStorageDownloadTokens: token
          }
        }
      });

      console.log(`Migrated: ${file.name} -> ${destination}`);
      successCount++;
    } catch (error) {
      console.error(`Erro ao migrar ${file.name}:`, error);
      errorCount++;
    }
  }

  if (errorCount > 0) {
    console.log(`Houve erros na migração. Deletando a pasta imagesCompressed...`);
    await deleteCompressedFolder();
  }

  console.log('Migração concluída!');
  console.log(`Sucesso: ${successCount}`);
  console.log(`Falhas: ${errorCount}`);
}

migrateImages().catch(error => {
  console.error('Erro geral na migração:', error);
});
