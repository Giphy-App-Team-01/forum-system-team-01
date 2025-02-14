import { get, ref, set } from 'firebase/database';
import { db } from '../../firebase-config';

/**
 * Saves a user to the database.
 *
 * @param {string} uid - The unique identifier for the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} username - The username of the user.
 * @param {string} profilePictureURL - The URL of the user's profile picture.
 * @returns {Promise<void>} A promise that resolves when the user is saved to the database.
 * @throws Will throw an error if saving the user to the database fails.
 */
export const saveUserToDatabase = async (
  uid,
  firstName,
  lastName,
  email,
  username,
  profilePictureURL
) => {
  try {
    await set(ref(db, `users/${uid}`), {
      firstName,
      lastName,
      email,
      username,
      profilePicture: profilePictureURL,
      isBlocked: false,
      isAdmin: false,
    });
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};

/**
 * Fetches the profile picture URL of a user from the database.
 *
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<string|null>} - A promise that resolves to the URL of the user's profile picture,
 *                                   or a default avatar URL if the profile picture does not exist,
 *                                   or null if an error occurs.
 */
export const getUserProfilePicture = async (uid) => {
  try {
    const snapshot = await get(ref(db, `users/${uid}/profilePicture`));
    return snapshot.exists()
      ? snapshot.val()
      : '../../assets/default-avatar.jpg';
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null;
  }
};

/**
 * Fetches all user emails from the database.
 *
 * @async
 * @function getAllUserEmails
 * @returns {Promise<string[]>} A promise that resolves to an array of user email addresses.
 * @throws Will log an error message to the console if there is an issue fetching user emails.
 */
export const getAllUserEmails = async () => {
  try {
    const snapshot = await get(ref(db, 'users'));

    console.log(snapshot.val());

    if (snapshot.exists()) {
      const users = snapshot.val();
      const emails = Object.values(users).map((user) => user.email);
      return emails;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user emails:', error);
    return [];
  }
};

export const getSinglePostDetails = async (id) => {
  try {
    const mockObject = {
      id,
      userId: 'userId1',
      title: 'Best Crypto to Invest in 2024',
      content: 'I think BTC and ETH will dominate...',
      createdAt: 1707836480000,
      updatedAt: 1707836580000,
      likes: 15,
      dislikes: 2,
      commentCount: 1,
    };
    return mockObject;
  } catch (err) {
    console.log(err);
    return {};
  }
};


/**
 * Fetches user data from the database.
 *
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<Object|null>} A promise that resolves to the user data object if it exists, or null if it does not exist or an error occurs.
 */
export const getUserData = async (uid) => {
  try {
    const snapshot = await get(ref(db, `users/${uid}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
