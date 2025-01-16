// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpWzgQjp8kJncy7IJrHsydcQhjxCsACp0",
  authDomain: "chat-app-whatsapp-87348.firebaseapp.com",
  projectId: "chat-app-whatsapp-87348",
  storageBucket: "chat-app-whatsapp-87348.appspot.com",
  messagingSenderId: "181948870574",
  appId: "1:181948870574:web:0ee29e771e9f584976a23f",
  measurementId: "G-64RK8LH5YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);

// export {storage,app as default}; 