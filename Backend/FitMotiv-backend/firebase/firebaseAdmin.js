import admin from 'firebase-admin';
import credentials from './serviceAccountKey.json' with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export default admin;
