import admin from 'firebase-admin';

const serviceAccount = require("./serviceAccountKey.json");

class FirebaseService {
    private static instance: admin.app.App;

    public static initialize() {
        if (!this.instance) {
            this.instance = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('Firebase initialized');
        }
        return this.instance;
    }

    public static messaging() {
        if (!this.instance) {
            throw new Error('Firebase is not initialized. Call FirebaseService.initialize() first.');
        }
        return admin.messaging();
    }
}

export default FirebaseService;
