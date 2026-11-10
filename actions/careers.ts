'use server';

import {
  createDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  storage,
} from '@/firebase/firebaseConfig';
import crypto from 'crypto';
import { serializeDoc } from '@/lib/utils';
import { FIRESTORE_COLLECTIONS } from '@/lib/constants';
import {
  ICareerJob,
  IJobApplication,
  ApplicationStatus,
} from '@/interfaces/careerInterface';
import { revalidatePath } from 'next/cache';

const CAREERS_COLLECTION = FIRESTORE_COLLECTIONS.CAREERS || 'careers';
const APPLICATIONS_COLLECTION =
  FIRESTORE_COLLECTIONS.JOB_APPLICATIONS || 'job_applications';

export async function getCareers(
  onlyActive: boolean = false
): Promise<ICareerJob[]> {
  try {
    const docs = await getAllDocuments(CAREERS_COLLECTION);
    const jobs = docs.map((doc) => ({
      id: doc.id,
      ...serializeDoc(doc),
    })) as unknown as ICareerJob[];

    const filtered = onlyActive
      ? jobs.filter((job) => job.isActive !== false)
      : jobs;

    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return [];
  }
}

export async function getCareerById(id: string): Promise<ICareerJob | null> {
  try {
    const doc = await getDocument(CAREERS_COLLECTION, id);
    if (!doc) return null;
    return {
      id: doc.id,
      ...serializeDoc(doc),
    } as unknown as ICareerJob;
  } catch (error) {
    console.error(`Error fetching career ${id}:`, error);
    return null;
  }
}

export async function createCareer(
  data: Omit<ICareerJob, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (!data.title || !data.department || !data.location) {
      throw new Error('Title, department, and location are required.');
    }

    const payload = {
      title: data.title.trim(),
      department: data.department.trim(),
      location: data.location.trim(),
      type: data.type || 'Full-Time',
      experienceLevel: data.experienceLevel || '',
      salaryRange: data.salaryRange || '',
      summary: data.summary || '',
      description: data.description || '',
      responsibilities: Array.isArray(data.responsibilities)
        ? data.responsibilities.filter(Boolean)
        : [],
      requirements: Array.isArray(data.requirements)
        ? data.requirements.filter(Boolean)
        : [],
      benefits: Array.isArray(data.benefits)
        ? data.benefits.filter(Boolean)
        : [],
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      closingDate: data.closingDate || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const id = await createDocument(CAREERS_COLLECTION, payload);
    revalidatePath('/careers');
    revalidatePath('/dashboard/careers');
    return { success: true, id };
  } catch (error: any) {
    console.error('Error creating career:', error);
    return {
      success: false,
      error: error.message || 'Failed to create career opening.',
    };
  }
}

export async function updateCareer(
  id: string,
  data: Partial<ICareerJob>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) payload.title = data.title.trim();
    if (data.department !== undefined)
      payload.department = data.department.trim();
    if (data.location !== undefined) payload.location = data.location.trim();
    if (data.type !== undefined) payload.type = data.type;
    if (data.experienceLevel !== undefined)
      payload.experienceLevel = data.experienceLevel;
    if (data.salaryRange !== undefined) payload.salaryRange = data.salaryRange;
    if (data.summary !== undefined) payload.summary = data.summary;
    if (data.description !== undefined) payload.description = data.description;
    if (data.responsibilities !== undefined) {
      payload.responsibilities = data.responsibilities.filter(Boolean);
    }
    if (data.requirements !== undefined) {
      payload.requirements = data.requirements.filter(Boolean);
    }
    if (data.benefits !== undefined) {
      payload.benefits = data.benefits.filter(Boolean);
    }
    if (data.isActive !== undefined) payload.isActive = Boolean(data.isActive);
    if (data.closingDate !== undefined) payload.closingDate = data.closingDate;

    await updateDocument(CAREERS_COLLECTION, id, payload);
    revalidatePath('/careers');
    revalidatePath('/dashboard/careers');
    return { success: true };
  } catch (error: any) {
    console.error(`Error updating career ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to update career opening.',
    };
  }
}

export async function deleteCareer(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDocument(CAREERS_COLLECTION, id);
    revalidatePath('/careers');
    revalidatePath('/dashboard/careers');
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting career ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to delete career opening.',
    };
  }
}

export async function submitJobApplication(
  application: Omit<IJobApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (
      !application.applicantName ||
      !application.email ||
      !application.phone
    ) {
      throw new Error('Full name, email address, and phone number are required.');
    }

    const payload = {
      jobId: application.jobId || 'general',
      jobTitle: application.jobTitle || 'General Talent Network Application',
      department: application.department || 'General',
      applicantName: application.applicantName.trim(),
      email: application.email.trim(),
      phone: application.phone.trim(),
      linkedInUrl: application.linkedInUrl?.trim() || '',
      portfolioUrl: application.portfolioUrl?.trim() || '',
      resumeUrl: application.resumeUrl?.trim() || '',
      yearsOfExperience: application.yearsOfExperience?.trim() || '',
      coverLetter: application.coverLetter?.trim() || '',
      status: 'pending' as ApplicationStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const id = await createDocument(APPLICATIONS_COLLECTION, payload);
    revalidatePath('/dashboard/careers');
    return { success: true, id };
  } catch (error: any) {
    console.error('Error submitting job application:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit job application.',
    };
  }
}

export async function getJobApplications(): Promise<IJobApplication[]> {
  try {
    const docs = await getAllDocuments(APPLICATIONS_COLLECTION);
    const applications = docs.map((doc) => ({
      id: doc.id,
      ...serializeDoc(doc),
    })) as unknown as IJobApplication[];

    return applications.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
}

export async function updateJobApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDocument(APPLICATIONS_COLLECTION, id, {
      status,
      updatedAt: new Date(),
    });
    revalidatePath('/dashboard/careers');
    return { success: true };
  } catch (error: any) {
    console.error(`Error updating application status ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to update application status.',
    };
  }
}

export async function deleteJobApplication(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDocument(APPLICATIONS_COLLECTION, id);
    revalidatePath('/dashboard/careers');
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting application ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to delete job application.',
    };
  }
}

export async function uploadCareerCV(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  fileName?: string;
  error?: string;
}> {
  try {
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      throw new Error('No document file provided.');
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      throw new Error('Firebase Storage bucket is not configured.');
    }

    const bucket = storage.bucket(bucketName);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `resumes/${Date.now()}_${sanitizedName}`;
    const fileRef = bucket.file(storagePath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const downloadToken = crypto.randomUUID();

    await fileRef.save(buffer, {
      resumable: false,
      contentType: file.type || 'application/pdf',
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      storagePath
    )}?alt=media&token=${downloadToken}`;

    return {
      success: true,
      url: downloadUrl,
      fileName: file.name,
    };
  } catch (error: any) {
    console.error('Error uploading CV to Firebase Storage:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload CV to Firebase Storage.',
    };
  }
}


