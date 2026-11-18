'use server';

import { auth, db, storage } from '@/firebase/firebaseConfig';
import { IAdminUser, Role } from '@/interfaces/userInterface';
import crypto from 'crypto';

export async function updateUserRole(userId: string, newRole: Role) {
  try {
    await db.collection('users').doc(userId).update({
      role: newRole,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update user role:', error);
    return {
      success: false,
      message: error.message || 'Failed to update user role',
    };
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    if (!userId) {
      throw new Error('User ID is required to update profile.');
    }

    const name = ((formData.get('name') as string) || '').trim();
    const email = ((formData.get('email') as string) || '').trim();
    const avatarFile = formData.get('avatar') as File | null;
    const existingPhotoURL =
      (formData.get('existingPhotoURL') as string) || '';
    const uploadedAvatarUrl =
      (formData.get('uploadedAvatarUrl') as string) || '';

    let photoURL = uploadedAvatarUrl || existingPhotoURL;

    // Handle avatar upload if a file was passed directly in FormData
    if (!uploadedAvatarUrl && avatarFile && avatarFile.size > 0) {
      const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      if (!bucketName) {
        throw new Error('Firebase Storage bucket is not configured.');
      }

      const bucket = storage.bucket(bucketName);
      const sanitizedName = avatarFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `avatars/${userId}_${Date.now()}_${sanitizedName}`;
      const file = bucket.file(fileName);

      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const downloadToken = crypto.randomUUID();

      await file.save(buffer, {
        resumable: false,
        contentType: avatarFile.type || 'image/jpeg',
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });

      photoURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
        fileName
      )}?alt=media&token=${downloadToken}`;
    }

    // Prepare update data for Firebase Auth
    const authUpdateData: Record<string, any> = {};
    if (name) authUpdateData.displayName = name;
    if (email) authUpdateData.email = email;
    if (photoURL) authUpdateData.photoURL = photoURL;

    if (Object.keys(authUpdateData).length > 0) {
      await auth.updateUser(userId, authUpdateData);
    }

    const nameParts = name ? name.split(/\s+/) : [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update Firestore User Document
    const firestoreUpdateData: Partial<IAdminUser> = {
      firstName,
      lastName,
      email,
      photoURL,
      updatedAt: new Date().toISOString(),
    };

    await db
      .collection('users')
      .doc(userId)
      .set(firestoreUpdateData, { merge: true });

    return {
      success: true,
      photoURL,
      firstName,
      lastName,
      email,
    };
  } catch (error: any) {
    console.error('Failed to update user profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to update user profile',
    };
  }
}
