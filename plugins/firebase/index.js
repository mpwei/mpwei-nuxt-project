/**
 * Firebase
 *
 * @since 0.0.1
 * @version 0.0.1
 * @author MPWEI
 * @date 2020/01/23
 */
import Vue from 'vue'
import Firebase from 'firebase/app'
import FirebaseConfig from './config'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'

try {
  Firebase.initializeApp({
    apiKey: FirebaseConfig.apiKey,
    authDomain: FirebaseConfig.authDomain,
    storageBucket: FirebaseConfig.storageBucket,
    projectId: FirebaseConfig.projectId,
    appId: FirebaseConfig.appId,
    messagingSenderId: FirebaseConfig.messagingSenderId,
    measurementId: FirebaseConfig.measurementId
  })
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

Vue.prototype.$Firebase = (_Service) => {
  if (_Service === 'app') {
    return Firebase
  }
  return Firebase[_Service]()
}

const Storage = Firebase.storage()
const Firestore = Firebase.firestore()
const Auth = Firebase.auth()
const FirebaseApp = Firebase

export { Storage, Firestore, Auth, FirebaseApp }
