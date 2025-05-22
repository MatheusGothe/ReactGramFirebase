const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, './chavePrivadaFirebase.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://instagramclone-7c9f7.firebaseio.com'
});

const db = admin.firestore();

async function migrateProfileImages() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  console.log(`Encontrados ${snapshot.size} usuários.`);

  const batch = db.batch();
  let toUpdate = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const url = data.profileImage;
    if (!url) {
      skipped++;
      continue;
    }

    const match = url.match(
      /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/(images%2F[^?]+)\?alt=media&token=(.+)$/
    );
    if (!match) {
      skipped++;
      continue;
    }

    const [, pathEncoded, token] = match;
    const newPath = pathEncoded.replace(/^images%2F/, 'imagesCompressed%2F');
    const newUrl = `https://firebasestorage.googleapis.com/v0/b/instagramclone-7c9f7.appspot.com/o/${newPath}?alt=media&token=${token}`;

    if (newUrl !== url) {
      batch.update(doc.ref, { profileImage: newUrl });
      toUpdate++;
    } else {
      skipped++;
    }
  }

  console.log(`Pronto para atualizar ${toUpdate} documentos (ignorados: ${skipped}).`);

  if (toUpdate === 0) {
    console.log('Nada para atualizar. Encerrando.');
    return;
  }

  // Aqui o “commit” é atômico: ou tudo é aplicado, ou nada.
  try {
    await batch.commit();
    console.log(`✅ Migração concluída: ${toUpdate} documentos atualizados.`);
  } catch (err) {
    console.error('❌ Erro no commit do batch, nenhuma mudança foi aplicada:', err);
  }
}

migrateProfileImages()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Erro geral na migração:', err);
    process.exit(1);
  });
