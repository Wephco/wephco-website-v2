'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import type { IAdminUser } from '../interfaces/userInterface';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseClient';
import { Role } from '@/interfaces/userInterface';
import { useSessionUser } from '@/hooks/useSessionUser';

interface AuthContextType {
	currentUser: IAdminUser | null;
	loading: boolean;
	// role: string | null;
	isAuthenticated: boolean;
	// userInfo: IUserInfo | null;
	signup: (email: string, password: string, fullName: string) => Promise<any>;
	login: (email: string, password: string) => Promise<any>;
	logout: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	loginWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<IAdminUser | null>(null);
	// const [role, setRole] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	// const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { deleteSessionUser } = useSessionUser();

	useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
				setIsAuthenticated(true);
                setCurrentUser((prev) => ({
                    ...prev,
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName!,
                    email: firebaseUser.email!,
                    emailVerified: firebaseUser.emailVerified,
                    photoURL: firebaseUser.photoURL,
                } as IAdminUser));
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
	}, []);

	const signup = async (email: string, password: string, fullName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const roleToSet = Role.SUPPORT;

        await updateProfile(user, { displayName: fullName });

        const userData: IAdminUser = {
			id: user.uid,
			firstName: fullName.split(' ')[0],
			lastName: fullName.split(' ').slice(1).join(' '),
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
			email: email,
			role: roleToSet,
			createdAt: new Date(),
			updatedAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        sessionStorage.setItem('user', JSON.stringify(userData));
        
        return { role: roleToSet, uid: user.uid };
	};

	const login = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Wait for the doc to return the role for the AuthForm redirection
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const userRole = userDoc.exists() ? userDoc.data().role : null;
        const userDataWithId = {
            id: userCredential.user.uid,
            ...(userDoc.exists() ? userDoc.data() : {}),
        } as IAdminUser;

        setCurrentUser(userDataWithId);

        sessionStorage.setItem('user', JSON.stringify(userDataWithId));
        
        return { role: userRole, uid: userCredential.user.uid };
	};

	const logout = async () => {
        await firebaseSignOut(auth);
        deleteSessionUser();
	};

	const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
	};

	const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        let userRole = null;

        if (!userDoc.exists()) {
            // New user via Google
            userRole = Role.AFFILIATE; // Default role
            const userData = {
                email: userCredential.user.email,
                firstName: userCredential.user.displayName?.split(' ')[0] || '',
                lastName: userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
                phone: '',
                role: userRole,
                createdAt: new Date().toISOString(),
                status: 'ACTIVE'
            };
            await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        } else {
            userRole = userDoc.data().role;
        }

        return { role: userRole, uid: userCredential.user.uid };
    };

	const value: AuthContextType = {
		currentUser,
		loading,
		isAuthenticated,
		signup,
		login,
		logout,
		resetPassword,
		loginWithGoogle,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
