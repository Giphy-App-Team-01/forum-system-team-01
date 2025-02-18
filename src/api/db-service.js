import {
  equalTo,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
  remove,
} from 'firebase/database';
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
      // isBlocked: false,
      // isAdmin: false,
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
    console.error('❌ Error fetching users:', error);
    return [];
  }
};

/**
 * Fetches all posts created by a specific user.
 *
 * @param {string} userId - The ID of the user whose posts we want to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of post objects.
 */
export const getUserPosts = async (userId) => {
  try {
    const postsRef = ref(db, 'posts');
    const userPostsQuery = query(
      postsRef,
      orderByChild('authorId'),
      equalTo(userId)
    );
    const snapshot = await get(userPostsQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const postsData = snapshot.val();
    return Object.keys(postsData).map((key) => ({
      postId: key,
      ...postsData[key],
    }));
  } catch (error) {
    console.error('❌ Error fetching user posts:', error);
    return [];
  }
};

/**
 * Blocks or unblocks a user by updating their block status in the database.
 *
 * @param {string} userId - The ID of the user to block or unblock.
 * @param {boolean} shouldBlock - A boolean indicating whether to block (true) or unblock (false) the user.
 * @returns {Promise<void>} A promise that resolves when the block status has been updated.
 * @throws Will throw an error if the update operation fails.
 */
export const blockUser = async (userId, shouldBlock) => {
  try {
    await update(ref(db, `users/${userId}`), {
      isBlocked: shouldBlock,
    });
  } catch (error) {
    console.error('❌ Error updating block status:', error);
  }
};

/**
 * Updates the user data in the database.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updatedData - The new data to update for the user.
 * @returns {Promise<void>} A promise that resolves when the user data is updated.
 * @throws Will throw an error if the update operation fails.
 */
export const updateUserData = async (userId, updatedData) => {
  try {
    await update(ref(db, `users/${userId}`), updatedData);
    console.log(`✅ User ${userId} data updated successfully.`);
  } catch (error) {
    console.error('❌ Error updating user data:', error);
  }
};

/**
 * Updates the role of a user in the database.
 *
 * @param {string} userId - The ID of the user whose role is to be updated.
 * @param {boolean} isAdmin - A boolean indicating whether the user should be an admin.
 * @returns {Promise<void>} - A promise that resolves when the user role is updated.
 * @throws {Error} - Throws an error if the update operation fails.
 */
export const updateUserRole = async (userId, isAdmin) => {
  try {
    await update(ref(db, `users/${userId}`), { isAdmin });
  } catch (error) {
    console.error('❌ Error updating user role:', error);
  }
};

// ------------------------------------------------------------------------------------------------------------------

// This is a test function to add comments to the database (for testing purposes)
// when comment functionality is done in the app, this function will not be needed

export const addTestComments = async (postId) => {
  try {
    const commentsRef = ref(db, 'comments');

    const comment1Ref = push(commentsRef);
    await set(comment1Ref, {
      commentId: comment1Ref.key,
      postId: postId,
      authorId: '7TtAFO4lU4db1Li4q13WRPPJsQe2',
      content: 'This is a test comment!',
      createdAt: Date.now(),
    });

    const comment2Ref = push(commentsRef);
    await set(comment2Ref, {
      commentId: comment2Ref.key,
      postId: postId,
      authorId: '7TtAFO4lU4db1Li4q13WRPPJsQe2',
      content: 'Another test comment!',
      createdAt: Date.now(),
    });

    const comment3Ref = push(commentsRef);
    await set(comment3Ref, {
      commentId: comment3Ref.key,
      postId: postId,
      authorId: 'RRgxhYXiKuOseJuulddQ8LpqP3L2',
      content: 'Yet another test comment!',
      createdAt: Date.now(),
    });

    const comment4Ref = push(commentsRef);
    await set(comment4Ref, {
      commentId: comment2Ref.key,
      postId: postId,
      authorId: 'RRgxhYXiKuOseJuulddQ8LpqP3L2',
      content: 'and another one!',
      createdAt: Date.now(),
    });

    console.log('✅ Test comments added!');
  } catch (error) {
    console.error('❌ Error adding test comments:', error);
  }
};

// addTestComments("-OJChTUdRARD0EcZyRQN");

//------------------------------------------------------------------------------------------------------------------

/**
 * Fetches comments made by a specific user along with the titles of the posts they commented on.
 *
 * @param {string} userId - The ID of the user whose comments are to be fetched.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of comments with post titles.
 * Each comment object contains the original comment properties and an additional `postTitle` property.
 *
 * @throws Will return an empty array if an error occurs during fetching.
 */
export const getUserCommentsWithPostTitles = async (userId) => {
  try {
    const snapshot = await get(
      query(ref(db, 'comments'), orderByChild('authorId'), equalTo(userId))
    );

    if (!snapshot.exists()) {
      return [];
    }

    const comments = Object.values(snapshot.val());

    const postIds = [...new Set(comments.map((comment) => comment.postId))];
    const postTitles = {};

    await Promise.all(
      postIds.map(async (postId) => {
        const postSnapshot = await get(ref(db, `posts/${postId}/title`));
        if (postSnapshot.exists()) {
          postTitles[postId] = postSnapshot.val();
        } else {
          postTitles[postId] = 'Unknown Post';
        }
      })
    );

    const commentsWithPostTitles = comments.map((comment) => ({
      ...comment,
      postTitle: postTitles[comment.postId] || 'Unknown Post',
    }));

    return commentsWithPostTitles;
  } catch (error) {
    console.error('❌ Error fetching user comments with post titles:', error);
    return [];
  }
};

export const updatePostInfo = (postId, newContent) => {
  try {
    update(ref(db, `posts/${postId}`), { content: newContent });
  } catch (error) {
    console.error('❌ Error updating post info:', error);
  }
};

export const deletePostById = async (postId) => {
  try {
    await remove(ref(db, `posts/${postId}`));
  } catch (error) {
    console.error('❌ Error deleting post:', error);
  }
};
