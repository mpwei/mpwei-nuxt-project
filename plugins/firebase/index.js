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

Vue.prototype.$Firebase = (_Service) => {
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

  return Firebase[_Service]()
}
