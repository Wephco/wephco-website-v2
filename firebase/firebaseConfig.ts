import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export const messaging = admin.messaging();

// ==========================================
// GENERIC CRUD FUNCTIONS FOR FIRESTORE
// ==========================================

export const createDocument = async (collectionPath: string, data: any, docId?: string) => {
  try {
    if (docId) {
      await db.collection(collectionPath).doc(docId).set(data);
      return docId;
    } else {
      const docRef = await db.collection(collectionPath).add(data);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error creating document in ${collectionPath}:`, error);
    throw error;
  }
};

export const getDocument = async (collectionPath: string, docId: string) => {
  try {
    const doc = await db.collection(collectionPath).doc(docId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionPath}:`, error);
    throw error;
  }
};

export const getAllDocuments = async (collectionPath: string) => {
  try {
    const snapshot = await db.collection(collectionPath).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionPath}:`, error);
    throw error;
  }
};

export const updateDocument = async (collectionPath: string, docId: string, data: any) => {
  try {
    await db.collection(collectionPath).doc(docId).update(data);
    return true;
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionPath}:`, error);
    throw error;
  }
};

export const deleteDocument = async (collectionPath: string, docId: string) => {
  try {
    await db.collection(collectionPath).doc(docId).delete();
    return true;
  } catch (error) {
    console.error(`Error deleting document ${docId} in ${collectionPath}:`, error);
    throw error;
  }
};

// ==========================================
// FIREBASE AUTHENTICATION FUNCTIONS
// ==========================================

export const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
};

export const getUserById = async (uid: string) => {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error(`Error fetching user data for ${uid}:`, error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error(`Error fetching user data for ${email}:`, error);
    throw error;
  }
};

export const createAuthUser = async (userData: admin.auth.CreateRequest) => {
  try {
    const userRecord = await auth.createUser(userData);
    return userRecord;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
};

export const updateAuthUser = async (uid: string, userData: admin.auth.UpdateRequest) => {
  try {
    const userRecord = await auth.updateUser(uid, userData);
    return userRecord;
  } catch (error) {
    console.error(`Error updating user ${uid}:`, error);
    throw error;
  }
};

export const deleteAuthUser = async (uid: string) => {
  try {
    await auth.deleteUser(uid);
    return true;
  } catch (error) {
    console.error(`Error deleting user ${uid}:`, error);
    throw error;
  }
};

export const setCustomUserClaims = async (uid: string, claims: object) => {
  try {
    await auth.setCustomUserClaims(uid, claims);
    return true;
  } catch (error) {
    console.error(`Error setting custom claims for user ${uid}:`, error);
    throw error;
  }
};