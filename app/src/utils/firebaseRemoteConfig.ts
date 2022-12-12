import { FirebaseApp, getApps, initializeApp } from 'firebase/app'
import { getRemoteConfig, isSupported as isRemoteConfigSupported, RemoteConfig } from 'firebase/remote-config'

export const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_CONFIG_API_KEY ?? ''}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN ?? ''}`,
  databaseURL: `${process.env.REACT_APP_FIREBASE_CONFIG_DATABASE_URL ?? ''}`,
  projectId: `${process.env.REACT_APP_FIREBASE_CONFIG_PROJECT_ID ?? ''}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET ?? ''}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDER_ID ?? ''}`,
  appId: `${process.env.REACT_APP_FIREBASE_CONFIG_APP_ID ?? ''}`,
}

export const remoteConfig = async (): Promise<RemoteConfig | null> => {
  let remoteConfig: RemoteConfig | null = null
  try {
    const firebaseApp: FirebaseApp = getApps()[0] ?? initializeApp(firebaseConfig)
    const isSupported = await isRemoteConfigSupported()
    if (isSupported) {
      remoteConfig = getRemoteConfig(firebaseApp)
    }
    return remoteConfig
  } catch (e) {
    console.warn('Failed to fetch remote config. Error:', e)
    return remoteConfig
  }
}
