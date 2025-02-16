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
import Authenticated from './hoc/Authenticated';
import Loading from './components/Loading/Loading';

function App() {
  const [appState, setAppState] = useState({
    authUser: null, // From Firebase Authentication
    dbUser: null, // From Firestore Database
    loading: true, // Flag for loading user data
  });

  const [user, loading, error] = useAuthState(auth);

  // ✅ Update the app state when the user changes
  useEffect(() => {
    if (user && user.uid !== appState.authUser?.uid) {
      setAppState((prevState) => ({
        ...prevState,
        authUser: user,
      }));
    } else if (!user) {
      setAppState((prevState) => ({
        ...prevState,
        authUser: null,
        dbUser: null,
      }));
    }
  }, [user]);

  // ✅ Update loading state separately
  useEffect(() => {
    setAppState((prevState) => ({
      ...prevState,
      loading,
    }));
  }, [loading]);

  // ✅ Fetch user data only after Firebase authentication is fully loaded
  useEffect(() => {
    if (!user || loading) return;

    getUserData(user.uid)
      .then((data) => {
        setAppState((prevState) => ({
          ...prevState,
          dbUser: data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [user, loading]);

  // Show loading spinner while loading user data
  if (appState.loading) {
    return <Loading />;
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
            <Route
              path='/all-posts/'
              element={
                <Authenticated>
                  <AllPosts />
                </Authenticated>
              }
            />
            <Route
              path='/create-post/'
              element={
                <Authenticated>
                  <CreatePost />
                </Authenticated>
              }
            />
            <Route
              path='/post/:id'
              element={
                <Authenticated>
                  <PostSingleView />
                </Authenticated>
              }
            />
            <Route
              path='/user/:userId/'
              element={
                <Authenticated>
                  <UserProfile />
                </Authenticated>
              }
            />
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
