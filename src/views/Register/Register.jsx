import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserToDatabase, getAllUserEmails } from '../../api/db-service';
import { uploadImageToCloudinary } from '../../api/upload-service';
import { registerUser } from '../../api/auth-service';
import defaultAvatar from '../../assets/default-avatar.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [existingEmails, setExistingEmails] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultAvatar);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Извличане на всички имейли при зареждане на компонента
  useEffect(() => {
    const fetchEmails = async () => {
      const emails = await getAllUserEmails();
      setExistingEmails(emails);
    };
    fetchEmails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreviewImage(file ? URL.createObjectURL(file) : defaultAvatar);
  };

  const validateForm = () => {
    const { firstName, lastName, email, username, password, confirmPassword } =
      formData;

    if (firstName.length < 4 || firstName.length > 32) {
      toast.error('First name must be between 4 and 32 characters.');
      return false;
    }
    if (lastName.length < 4 || lastName.length > 32) {
      toast.error('Last name must be between 4 and 32 characters.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Invalid email address.');
      return false;
    }
    console.log(existingEmails);

    if (existingEmails.includes(email)) {
      toast.error('This email is already registered. Please use another one.');
      return false;
    }
    if (username.length < 4 || username.length > 16) {
      toast.error('Username must be between 4 and 16 characters.');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const userCredential = await registerUser(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      //Upload the image to Cloudinary
      const profilePictureURL = profilePicture
        ? await uploadImageToCloudinary(profilePicture)
        : defaultAvatar;

      await saveUserToDatabase(
        user.uid,
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.username,
        profilePictureURL
      );

      toast.success(
        'Registration successful! You will be redirected to home.',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );

      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-container'>
      <h2>Register</h2>

      <ToastContainer />

      <div
        className='avatar-upload'
        onClick={() => document.getElementById('profilePicture').click()}
      >
        <img src={previewImage} alt='Profile Preview' />
      </div>
      <input
        type='file'
        id='profilePicture'
        className='avatar-input'
        onChange={handleFileChange}
        accept='image/*'
      />

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='firstName'
          placeholder='First Name'
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='lastName'
          placeholder='Last Name'
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='username'
          placeholder='Username'
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          name='confirmPassword'
          placeholder='Confirm Password'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type='submit' disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
