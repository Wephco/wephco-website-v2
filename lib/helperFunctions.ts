import { IApiErrorResponse } from "@/interfaces/appInterface";
import axios, { AxiosError } from "axios";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { upload } from "@vercel/blob/client";
import { differenceInMonths } from "date-fns";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/firebaseClient';
// import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(file: File, path: string): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileRef = ref(storage, `${path}/${Date.now()}_${sanitizedName}`);
  const snapshot = await uploadBytes(fileRef, file, {
    contentType: file.type || 'application/octet-stream',
  });
  return await getDownloadURL(snapshot.ref);
}


export const formatCurrency = (number: number, currencyCode = 'USD', locale = 'en-US'): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(number);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return number.toLocaleString(locale, { maximumFractionDigits: 0 }); // Fallback to basic number formatting
    }
}

// export const scrollTo = (targetId: string) => {
//   const targetElement = document.getElementById(targetId)

//   if(targetElement){
//     targetElement.scrollIntoView({behavior:'smooth'})
//   }
// }

export const handleError = (error: unknown) => {
  let errorMessage = 'Failed to create enquiry. An unexpected error occurred.';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<Partial<IApiErrorResponse>>; 
      if (axiosError.response) {
        // Server responded with an error status code (4xx, 5xx)
        const serverErrorData = axiosError.response.data;
        const serverMessage = serverErrorData?.message || serverErrorData?.error;

        errorMessage = `Failed to create enquiry (status ${axiosError.response.status})${serverMessage ? `: ${serverMessage}` : '.'}`;
        // You could log the full error response for debugging if needed
        // console.error('Server error response:', axiosError.response.data);
      } else if (axiosError.request) {
        // Request was made but no response received (e.g., network error, CORS issue in browser)
        errorMessage = 'Failed to create enquiry: No response from server. Check network connection or API availability.';
      } else {
        // Something else happened in setting up the request that triggered an Error
        errorMessage = `Failed to create enquiry: ${axiosError.message}`;
      }
    } else if (error instanceof Error) {
      // Non-Axios error
      errorMessage = `Failed to create enquiry: ${error.message}`;
    }

    // For debugging purposes, you might want to log the original error
    console.error('createPropertyEnquiryRequest error:', error);

    return errorMessage;
}

export const generateId = (characterLength: number = 16): string => {
  return nanoid(characterLength)
}

/**
 * Uploads an image to Vercel Blob storage and returns the public URL
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} The public URL of the uploaded image
 * @throws {Error} With detailed error message if upload fails
 */
export const uploadImage = async (file: File, callback: any) => {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided');
  }

  const id = generateId()
  const filePath = `${id}-${file.name}`
  

  try {
    const blobUrl = await upload(filePath, file, {
    access: 'public',
    handleUploadUrl: "/api/upload",
    onUploadProgress: (progressEvent) => {
      callback(progressEvent.percentage)
    }
  })

  console.log(blobUrl)
  return blobUrl
  } catch (error) {
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        throw new Error('Server configuration error - please check your BLOB_READ_WRITE_TOKEN');
      }
      if (error.message.includes('size')) {
        throw new Error('File size too large - maximum size is 4.5MB');
      }
    }

    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}



export const uploadPDF = async (file: File): Promise<string> => {
  const id = generateId()
  try {
    var fileName = `${file.name}-${id}`

    if(!fileName.toLowerCase().endsWith('.pdf')){
      fileName += '.pdf'
    }

    const blob = await put(fileName, file, {
      access: 'public',
      contentType: 'application/pdf',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    return blob.url
  } catch (error) {
    throw new Error('Failed to upload PDF')
  }
}


export const convertBlobUrlToFile = async (blobUrl: string) => {
  const response = await fetch(blobUrl)
  const blob = await response.blob()
  const fileName = Math.random().toString(36).slice(2, 9)
  const mimeType = blob.type || "application/octet-stream"
  const file = new File([blob], `${fileName}.${mimeType.split('/')[1]}`, { type: mimeType });

  return file;
}

export const checkAuthenticationCode = (code?: string): boolean => {
  if (!code) {
    return false;
  }
  const authCode1 = process.env.NEXT_PUBLIC_AUTH_CODE1?.toLowerCase();
  const authCode2 = process.env.NEXT_PUBLIC_AUTH_CODE2?.toLowerCase();
  if (!authCode1 || !authCode2) {
    throw new Error('Authentication codes are not set in environment variables');
  }
  return code === authCode1 || code === authCode2;
}

export const getInitials = (fullName: string): string => {
  
  if (typeof fullName !== 'string' || fullName.trim() === '') {
    return '';
  }

  const nameParts = fullName.trim().split(/\s+/);
  const firstLetters = nameParts.map(part => part[0]);

  return firstLetters.join('').toUpperCase();
}

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
) => {
  if (!error) return fallback

  // Axios / fetch error shape
  if (typeof error === "object" && error !== null) {
    const anyError = error as any

    // API-provided message
    if (anyError.response?.data?.error) {
      return anyError.response.data.error
    }

    // HTTP status-based messages
    switch (anyError.response?.status) {
      case 400:
        return "Some of the information you entered is invalid. Please check and try again."
      case 401:
        return "Incorrect email or password. Please try again."
      case 403:
        return "You don’t have permission to perform this action."
      case 404:
        return "We couldn’t find an account with those details."
      case 409:
        return "An account with this email already exists."
      case 500:
        return "Our servers are having trouble right now. Please try again later."
    }

    // Network error
    if (anyError.message?.includes("Network")) {
      return "Network error. Please check your internet connection."
    }
  }

  // Standard JS Error
  if (error instanceof Error) {
    return error.message || fallback
  }

  // String error
  if (typeof error === "string") return error

  return fallback
}


/**
 * Generates a URL-friendly slug from a given blog title string.
 * @param title The string to convert into a slug.
 * @returns {string} The generated slug string.
 */
export const createSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    // Replace spaces with a hyphen
    .replace(/\s+/g, '-')
    // Remove all characters that are not letters, numbers, or hyphens
    .replace(/[^\w-]+/g, '')
    // Replace multiple consecutive hyphens with a single one
    .replace(/--+/g, '-')
    // Trim leading hyphens
    .replace(/^-+/, '')
    // Trim trailing hyphens
    .replace(/-+$/, '');

    return slug;
}


/**
 * Checks if a property's creation date is within the last 3 months from today.
 * @param createdAt The creation date of the property (as a Date object).
 * @returns {boolean} Returns true if the property is less than 3 months old, otherwise false.
 */
export const isPropertyRecent = (createdAt: Date): boolean => {
  const currentDate = new Date();

  const monthDifference = differenceInMonths(currentDate, createdAt)

  return monthDifference < 3;
}

/**
 * Calculates the estimated read time for a given text.
 * @param text The plain text content of the blog post.
 * @param wordsPerMinute The average reading speed (default is 200 WPM).
 * @returns The estimated read time in minutes, rounded up to the nearest whole number.
 */
export const calculateSimpleReadTime = (text: string, wordsPerMinute: number = 200): number => {
  // Find all sequences of non-whitespace characters to count words.
  const words = text.match(/\S+/g) || [];
  const wordCount = words.length;

  if (wordCount === 0) {
    return 0;
  }

  // Calculate the read time and round up to the nearest minute.
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  return readTime;
};


/**
 * Calculates a more accurate read time by stripping HTML and accounting for images.
 * @param content The blog post content, which may include HTML.
 * @param wordsPerMinute The average reading speed (default is 200 WPM).
 * @returns The estimated read time in minutes.
 */
export const calculateAdvancedReadTime = (content: string, wordsPerMinute: number = 200): number => {
  // 1. Strip all HTML tags to get the plain text.
  const textOnly = content.replace(/<[^>]*>/g, ' ');

  // 2. Count the words in the plain text.
  const words = textOnly.match(/\S+/g) || [];
  const wordCount = words.length;
  const textReadTimeInMinutes = wordCount / wordsPerMinute;

  // 3. Count the number of images in the original content.
  const imageCount = (content.match(/<img[^>]*>/g) || []).length;
  
  let imageReadTimeInSeconds = 0;
  if (imageCount > 0) {
    let seconds = 12; // Start with 12 seconds for the first image
    for (let i = 0; i < imageCount; i++) {
      imageReadTimeInSeconds += seconds;
      if (seconds > 3) {
        // Decrease by one second for each subsequent image, down to a minimum of 3.
        seconds--; 
      }
    }
  }
  const imageReadTimeInMinutes = imageReadTimeInSeconds / 60;

  // 4. Combine text and image time and round up to the nearest minute.
  const totalReadTime = Math.ceil(textReadTimeInMinutes + imageReadTimeInMinutes);

  return totalReadTime;
};


export const generateUniqueID = (prefix?: string, length: number = 10): string => {
  const randomPart = Math.random().toString(36).substring(2, 2 + length).toUpperCase()
  return prefix ? `${prefix}-${randomPart}` : randomPart
}


export const formatMeetingDate = (date: string) => {
  if (!date) return "";

  const [year, month, day] = date.split("-").map(Number);

  const formattedDate = new Date(year, month - 1, day);

  return formattedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
