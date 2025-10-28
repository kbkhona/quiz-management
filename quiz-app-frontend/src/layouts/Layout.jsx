import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AuthLayout;