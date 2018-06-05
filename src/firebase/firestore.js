import firebaseApp from '@/firebase'

const firestore = firebaseApp.firestore()
const settings = {timestampsInSnapshots: true}
firestore.settings(settings)

export default firestore
