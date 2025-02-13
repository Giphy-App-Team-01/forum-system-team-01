// Auth service to handle user authentication

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase-config';

/**
 * Registers a new user with Firebase Authentication using the provided email and password.
 * 
 * @param {string} email - The email address of the user to register.
 * @param {string} password - The password for the new user.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credentials if registration is successful.
 * @throws {FirebaseError} If registration fails, an error will be thrown.
 *
 * @example
 * async function registerNewUser() {
 *   try {
 *     const userCredential = await registerUser("user@example.com", "securePassword123");
 *     console.log("User registered:", userCredential);
 *   } catch (error) {
 *     console.error("Registration error:", error.message);
 *   }
 * }
 *
 * registerNewUser();
 *
 * Note: Always use try/catch for error handling when using this function with async/await.
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user using Firebase Authentication with the provided email and password.
 * 
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credentials if login is successful.
 * @throws {FirebaseError} If login fails, an error will be thrown.
 *
 * @example
 * async function login() {
 *   try {
 *     const userCredential = await loginUser("user@example.com", "securePassword123");
 *     console.log("User logged in:", userCredential);
 *   } catch (error) {
 *     console.error("Login error:", error.message);
 *   }
 * }
 *
 * login();
 *
 * Note: Always use try/catch for error handling when using this function with async/await.
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user from Firebase.
 * 
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged out.
 * @throws {FirebaseError} If logout fails, an error will be thrown.
 *
 * @example
 * async function logout() {
 *   try {
 *     await logoutUser();
 *     console.log("User logged out successfully.");
 *   } catch (error) {
 *     console.error("Logout error:", error.message);
 *   }
 * }
 *
 * logout();
 *
 * Note: Always use try/catch for error handling when using this function.
 */
export const logoutUser = () => {
  return signOut(auth);
};

/**
 * Sends a password reset email to the specified email address using Firebase Authentication.
 * 
 * @param {string} email - The email address of the user who needs to reset their password.
 * @returns {Promise<void>} A promise that resolves when the password reset email is successfully sent.
 * @throws {FirebaseError} If sending the email fails, an error will be thrown.
 *
 * @example
 * async function resetPassword() {
 *   try {
 *     await forgotPassword("user@example.com");
 *     console.log("Password reset email sent successfully.");
 *   } catch (error) {
 *     console.error("Password reset error:", error.message);
 *   }
 * }
 *
 * resetPassword();
 *
 * Note: Always use try/catch for error handling when calling this function.
 */
export const forgotPassword = async (email) => {
  return sendPasswordResetEmail(auth, email);
};



