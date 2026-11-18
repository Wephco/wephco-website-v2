'use server';

import { IConsultation } from "@/interfaces/userInterface";
import { createDocument, getAllDocuments, updateDocument } from "@/firebase/firebaseConfig";
import { serializeDoc } from "@/lib/utils";
import { FIRESTORE_COLLECTIONS } from "@/lib/constants";

const COLLECTION_NAME = FIRESTORE_COLLECTIONS.CONSULTATIONS;

export const updateConsultation = async (id: string, data: Partial<IConsultation>): Promise<void> => {
    try {
        const payload = { ...data };
        delete payload.id;
        await updateDocument(COLLECTION_NAME, id, payload);
    } catch (error) {
        console.error(`Error updating consultation ${id}:`, error);
        throw new Error("Failed to update consultation");
    }
};

export const getConsultations = async (): Promise<IConsultation[]> => {
    try {
        const docs = await getAllDocuments(COLLECTION_NAME);
        const consultations = docs.map(doc => ({
            id: doc.id,
            ...serializeDoc(doc)
        })) as unknown as IConsultation[];

        return consultations.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error fetching consultations:", error);
        throw new Error("Failed to fetch consultations");
    }
};

export const createConsultation = async (data: IConsultation): Promise<IConsultation> => {
    try {
        const payload = {
            service: data.service,
            meetingDate: data.meetingDate instanceof Date ? data.meetingDate : new Date(data.meetingDate),
            meetingLocation: data.meetingLocation || "",
            phoneNumber: data.phoneNumber,
            email: data.email,
            organizationName: data.organizationName || "",
            name: data.name,
            details: data.details || "",
            preferredModeOfContact: data.preferredModeOfContact || "",
            status: data.status || false,
            createdAt: new Date(),
        };

        const id = await createDocument(COLLECTION_NAME, payload);

        return {
            id,
            ...payload,
        } as unknown as IConsultation;
    } catch (error) {
        console.error("Error creating consultation:", error);
        throw new Error("Failed to create consultation");
    }
};
