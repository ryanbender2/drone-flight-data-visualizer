import { initializeApp, getApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: "drone-flight-data-visualizer.firebaseapp.com",
    projectId: "drone-flight-data-visualizer",
    storageBucket: "drone-flight-data-visualizer.appspot.com",
    messagingSenderId: "195582540554",
    appId: "1:195582540554:web:c2b21397767db3a1b298f3",
    measurementId: "G-0Y10HQEEY0"
};

function createFirebaseApp(config: FirebaseOptions): FirebaseApp {
    try {
        return getApp();
    } catch {
        var firebaseApp = initializeApp(config);
        if (process.env.NODE_ENV !== "production") {
            connectStorageEmulator(getStorage(firebaseApp), 'localhost', 9199)
        }
        return firebaseApp;
    }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

// Storage export
export const storage = getStorage(firebaseApp);
