'use server';
import { cookies } from 'next/headers';
import { db , auth} from '../../../firebase/admin';


export async function signUp(params:SignUpParams) {
  const { uid,name, email } = params;
  
  try {
    const userRecord = await db.collection('users').doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists. Please log in instead.'
      };
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    });

    return{
        success: true,
        message: 'Sign up successful! You can now log in.'
    }


  } catch (error: any) {
    console.error('Error during sign up:', error);
    
    if(error.code === 'auth/email-already-exists') {
      return {
        success : false,
        message: 'Email already exists. Please use a different email address.'
        }
    }
    return {
      success: false,
      message: 'An error occurred during sign up. Please try again later.'

    }
}
}

export async function signIn(params:SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: 'User not found. Please sign up first.'
      };
    }
    await setSessionCookie(idToken);

  } catch (error: any) {
    console.log('Error during sign in:', error);
    return{
        success: false,
        message: error.message || 'An error occurred during sign in. Please try again later.'
    }
  }
    
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 7 * 1000 });

    cookieStore.set('session', sessionCookie, {
        maxAge : 60 * 60 * 24 * 7, 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) {
            return null;
        }
        return{
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (error: any) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}

export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user;
    
}