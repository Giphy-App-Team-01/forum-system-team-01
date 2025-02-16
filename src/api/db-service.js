import { get, onValue, push, ref, set } from 'firebase/database';
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
    console.log('Fetching post for ID:', id); // Check what ID is being passed
    const snapshot = await get(ref(db, 'posts/' + id));
    const data = snapshot.val();
    return data;
  } catch (err) {
    console.error('Firebase fetch error:', err);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(db, 'users'));
    const data = snapshot.val();
    console.log(data);
    return data;
  } catch (err) {
    console.error('Firebase fetch error:', err);
    return null;
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
    console.error('Error fetching user data:', error);
    return null;
  }
};

/**
 * Saves a post to the database.
 *
 * @param {string} userId - The ID of the user creating the post.
 * @param {string} title - The title of the post.
 * @param {string} content - The content of the post.
 * @returns {Promise<void>} A promise that resolves when the post is saved.
 * @throws Will throw an error if saving the post to the database fails.
 */
export const savePostToDatabase = async (userId, title, content) => {
  try {
    // Get a key for a new post.
    const postRef = push(ref(db, 'posts'));
    const postId = postRef.key;

    await set(postRef, {
      postId,
      authorId: userId,
      title,
      content,
      createdAt: Date.now(),
      likes: 0,
      dislikes: 0,
      commentCount: 0,
    });
  } catch (error) {
    console.error('❌ Error saving post to database:', error);
  }
};

/**
 * Listens for changes in total users and total posts.
 *
 * @param {Function} callback - Function to update the state when data changes.
 * @returns {Function} Unsubscribe function to detach the listener.
 */
export const subscribeToStats = (callback) => {
  const usersRef = ref(db, 'users');
  const postsRef = ref(db, 'posts');

  const unsubscribeUsers = onValue(usersRef, (snapshot) => {
    const totalUsers = snapshot.exists()
      ? Object.keys(snapshot.val()).length
      : 0;
    callback((prev) => ({ ...prev, totalUsers }));
  });

  const unsubscribePosts = onValue(postsRef, (snapshot) => {
    const totalPosts = snapshot.exists()
      ? Object.keys(snapshot.val()).length
      : 0;
    callback((prev) => ({ ...prev, totalPosts }));
  });

  return () => {
    unsubscribeUsers();
    unsubscribePosts();
  };
};


/**
 * Fetches all users from the database and filters them by username.
 * @param {string} searchQuery - The username search term.
 * @returns {Promise<Array>} - An array of matching users.
 */
export const searchUsersByUsername = async (searchQuery) => {
  try {
    const snapshot = await get(ref(db, 'users'));

    if (!snapshot.exists()) {
      return [];
    }

    const users = Object.entries(snapshot.val()).map(([uid, user]) => ({
      uid,
      ...user,
    }));

    const filteredUsers = users.filter((user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredUsers;
  } catch (error) {
    return [];
  }
};
