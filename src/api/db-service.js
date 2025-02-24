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
  limitToLast,
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
      : '../../assets/images/default-avatar.jpg';
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

/**
 * Fetches the details of a single post from the database.
 *
 * @param {string} id - The unique identifier of the post.
 * @returns {Promise<Object|null>} A promise that resolves to the post details object if successful, or null if an error occurs.
 */
export const getSinglePostDetails = async (id) => {
  try {
    const snapshot = await get(ref(db, 'posts/' + id));
    const data = snapshot.val();
    return data;
  } catch (err) {
    console.error('Firebase fetch error:', err);
    return null;
  }
};

/**
 * Fetches all users from the Firebase database.
 *
 * @async
 * @function getAllUsers
 * @returns {Promise<Object|null>} A promise that resolves to an object containing user data, or null if an error occurs.
 * @throws Will log an error message to the console if the fetch operation fails.
 */
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

    return postId
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

/**
 * Updates the content of a post in the database.
 *
 * @param {string} postId - The unique identifier of the post to update.
 * @param {string} newContent - The new content to update the post with.
 */
export const updatePostInfo = (postId, newContent) => {
  try {
    update(ref(db, `posts/${postId}`), { content: newContent });
  } catch (error) {
    console.error('❌ Error updating post info:', error);
  }
};

/**
 * Deletes a post from the database by its ID.
 *
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<void>} A promise that resolves when the post is deleted.
 * @throws Will log an error message if the deletion fails.
 */
export const deletePostById = async (postId) => {
  try {
    await remove(ref(db, `posts/${postId}`));
  } catch (error) {
    console.error('❌ Error deleting post:', error);
  }
};

/**
 * Listens to the top commented posts in the database and invokes the callback with the sorted posts array.
 *
 * @param {function} callback - The callback function to be invoked with the sorted posts array.
 * @returns {function} - The unsubscribe function to stop listening to the changes.
 */
export const listenToTopCommentedPosts = (callback) => {
  const topCommentedQuery = query(
    ref(db, 'posts'),
    orderByChild('commentCount'),
    limitToLast(10)
  );
  const unsubscribe = onValue(topCommentedQuery, (snapshot) => {
    if (snapshot.exists()) {
      const postsArray = Object.entries(snapshot.val()).map(([key, value]) => ({
        postId: key,
        ...value,
      }));
      postsArray.sort((a, b) => b.commentCount - a.commentCount); // sort by comment count in descending order
      callback(postsArray);
    } else {
      callback([]);
    }
  });

  return unsubscribe; //unsubscribe function
};

/**
 * Listens to the latest posts from the database and invokes the callback with the posts data.
 *
 * @param {function} callback - The callback function to be invoked with the latest posts data.
 * The callback receives an array of post objects, each containing a `postId` and other post properties.
 * The posts are ordered by their creation date in ascending order.
 *
 * @returns {function} - A function to unsubscribe from the database listener.
 */
export const listenToLatestPosts = (callback) => {
  const latestQuery = query(
    ref(db, 'posts'),
    orderByChild('createdAt'),
    limitToLast(10)
  );
  const unsubscribe = onValue(latestQuery, (snapshot) => {
    if (snapshot.exists()) {
      const postsArray = Object.entries(snapshot.val()).map(([key, value]) => ({
        postId: key,
        ...value,
      }));
      callback(postsArray.reverse()); // reverse() for ascending order
    } else {
      callback([]);
    }
  });

  return unsubscribe; // unsubscribe function
};

/**
 * Fetches related comments by post ID from the database.
 *
 * @param {string} postId - The ID of the post to fetch comments for.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of comment objects related to the given post ID.
 * @throws {Error} If the postId is not provided.
 */
export const fetchRelatedCommentsByPostId = async (postId) => {
  try {
    if (!postId) throw new Error('postId is required');

    const commentsRef = ref(db, 'comments');
    const snapshot = await get(commentsRef);

    if (snapshot.exists()) {
      const allComments = snapshot.val();
      const filteredComments = Object.entries(allComments)
        .map(([id, data]) => ({ id, ...data }))
        .filter((comment) => comment.postId === postId);

      return filteredComments;
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error fetching comments:', err);
    return [];
  }
};

/**
 * Fetches the display name of a user by their user ID.
 *
 * @param {string} userId - The ID of the user whose display name is to be fetched.
 * @returns {Promise<string|null>} A promise that resolves to the user's display name (first name and last name) or null if the user does not exist or an error occurs.
 * @throws {Error} Throws an error if the userId is not provided.
 */
export const fetchDisplayNameByUserId = async (userId) => {
  try {
    if (!userId) throw new Error('userId is required');

    const userRef = ref(db, 'users/' + userId);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val().firstName + ' ' + snapshot.val().lastName || null;
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error fetching username:', err);
    return null;
  }
};

/**
 * Adds a comment to a post by its ID.
 *
 * @param {string} postId - The ID of the post to which the comment will be added.
 * @param {string} authorId - The ID of the author of the comment.
 * @param {string} content - The content of the comment.
 * @param {Date} createdAt - The date and time when the comment was created.
 * @returns {Promise<void>} A promise that resolves when the comment has been added.
 */
export const addCommentToPostById = async (
  postId,
  authorId,
  content,
  createdAt
) => {
  try {
    const commentsRef = ref(db, 'comments');
    const commentRef = push(commentsRef);

    await set(commentRef, {
      commentId: commentRef.key,
      postId,
      authorId,
      content,
      createdAt,
    });
  } catch (err) {
    console.error('Error adding comment:', err);
  }
};

/**
 * Subscribes to comments for a specific post and invokes a callback with the filtered comments.
 *
 * @param {string} postId - The ID of the post to subscribe to comments for.
 * @param {function} callback - The callback function to be invoked with the filtered comments.
 * @returns {function} - A function to unsubscribe from the comments updates.
 */
export const subscribeToComments = (postId, callback) => {
  if (!postId) return () => {};

  const commentsRef = ref(db, `comments`);

  const unsubscribe = onValue(commentsRef, (snapshot) => {
    if (snapshot.exists()) {
      const allComments = snapshot.val();
      const filteredComments = Object.values(allComments).filter(comment => comment.postId === postId);
      callback(filteredComments);
    } else {
      callback([]); 
    }
  });

  return unsubscribe;
};

/**
 * Updates the comment count for a specific post in the database.
 *
 * @param {string} postId - The ID of the post to update.
 * @param {number} commentCount - The new comment count to set for the post.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws Will log an error message if the update fails.
 */
export const updateCommentCount = async (postId, commentCount) => {

  if (!await isExistPost(postId)) {
    return;
  }

  try {
    await update(ref(db, `posts/${postId}`), { commentCount });
  } catch (error) {
    console.error('❌ Error updating comment count:', error);
  }
};

export const deleteCommentById = async (commentId) => {
  try {
    await remove(ref(db, `comments/${commentId}`));
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
  }
};

  
/**
 * Updates the likes and dislikes count for a specific post.
 *
 * @param {string} postId - The ID of the post to update.
 * @param {number} likes - The new number of likes for the post.
 * @param {number} dislikes - The new number of dislikes for the post.
 * @param {string} userId - The ID of the user who is voting.
 * @param {string} type - The type of vote ('like' or 'dislike').
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
export const updateLikesDislikes = async (postId, likes, dislikes, userId, type) => {
  try {
    const postRef = ref(db, `posts/${postId}`);
    const snapshot = await get(postRef);

    if (!snapshot.exists()) return;

    const postData = snapshot.val();
    const usersVoted = postData.usersVoted || {}; 

    if (usersVoted[userId] === type) {
      return; 
    }

    usersVoted[userId] = type;

    await update(postRef, {
      likes,
      dislikes,
      usersVoted,
    });
  } catch (error) {
    console.error("❌ Error updating likes/dislikes:", error);
  }
};


/**
 * Subscribes to changes on a specific post and invokes a callback with the post data.
 *
 * @param {string} postId - The ID of the post to subscribe to.
 * @param {function} callback - The callback function to be called with the post data.
 * @returns {function} - A function to unsubscribe from the post updates.
 */
export const subscribeToPost = (postId, callback) => {
  if (!postId) return () => {};

  const postRef = ref(db, `posts/${postId}`);

  const unsubscribe = onValue(postRef, async (snapshot) => {
    if (snapshot.exists()) {
      const postData = snapshot.val();
      callback(postData); 
    }
  });

  return unsubscribe; 
};

/**
 * Fetches all posts from the database.
 *
 * @async
 * @function getAllPosts
 * @returns {Promise<Array>} A promise that resolves to an array of posts. If no posts are found, an empty array is returned.
 * @throws Will log an error message to the console if there is an issue fetching posts.
 */
export const getAllPosts = async () => {
  try {
    const postsRef = ref(db, "posts"); 
    const snapshot = await get(postsRef); 

    if (!snapshot.exists()) {
      return []; 
    }

    return Object.values(snapshot.val());
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return []; 
  }
};

/**
 * Checks if a post with the given ID exists in the database.
 *
 * @param {string} id - The ID of the post to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the post exists, false otherwise.
 */
export const isExistPost = async (id) => {
  if (!id) return false;

  try {
    const snapshot = await get(ref(db, `posts/${id}`));
    return snapshot.exists();
  } catch (error) {
    console.error('❌ Error checking post existence:', error);
    return false;
  }
};


