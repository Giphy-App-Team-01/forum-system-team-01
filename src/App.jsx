import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
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
  );
}

export default App;
