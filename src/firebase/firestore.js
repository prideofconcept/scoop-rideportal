import firebaseApp from '@/firebase'
import 'firebase/firestore'

const firestore = firebaseApp.firestore()
const settings = {timestampsInSnapshots: true}
firestore.settings(settings)

export default firestore
