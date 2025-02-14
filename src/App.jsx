import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './views/Home/Home';
import AllPosts from './views/AllPosts/AllPosts';
import CreatePost from './views/CreatePost/CreatePost';
import UserProfile from './views/UserProfile/UserProfile';
import About from './views/About/About';
import PostSingleView from './views/PostSingleView/PostSingleView';
import NotFound from './views/NotFound/NotFound';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import ForgotPassword from './views/ForgotPassword/ForgotPassword';
import { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { getUserData } from './api/db-service';
import { AppContext } from './context/app.context';

function App() {

  const [appState, setAppState] = useState({
    authUser: null, // From Firebase Authentication
    dbUser: null, // From Firestore Database
  });


  const [user, loading, error] = useAuthState(auth);

  // Update the app state when the user changes
  useEffect(() => {
    if (appState.authUser !== user) {
      setAppState((prevState) => ({
        ...prevState,
        authUser: user,
      }));
    }
  }, [user]);

  // Fetch user data from the database when the user changes
  useEffect(() => {
    if (!user) {
      setAppState((prevState) => ({
        ...prevState,
        dbUser: null, //if there is no user, we set the dbUser to null
      }));
      return;
    }
  
    getUserData(user.uid)
      .then((data) => {
        setAppState((prevState) => ({
          ...prevState,
          dbUser: data, //if there is a user, we set the dbUser to the data we fetched
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [user]);


  //Waiting for the user to be loaded
  if (loading) {
    return <div>Loading...</div>; // This will be replaced with a Loading component
  }
  
  
  if (error) {
    return <div>Error: {error.message}</div>; // This will be replaced with an Error component
  }

  return (
    <AppContext.Provider value={{ ...appState, setAppState }}>
    <BrowserRouter>
      <Header />
      <Container extraClassName='page-content'>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/all-posts/' element={<AllPosts />} />
          <Route path='/create-post/' element={<CreatePost />} />
          <Route path='/post/:postId' element={<PostSingleView id={4} />} />
          <Route path='/user/:userId/' element={<UserProfile />} />
          <Route path='/about/' element={<About />} />
          <Route path='/login/' element={<Login />} />
          <Route path='/register/' element={<Register />} />
          <Route path='/forgot-password/' element={<ForgotPassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
