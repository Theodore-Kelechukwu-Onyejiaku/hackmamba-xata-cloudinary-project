import { ToastContainer } from 'react-toastify';
import Header from './Header';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
  return (
    <div className="dark:bg-black h-full">
      <Header />
      <ToastContainer />
      <div className="content">
        {children}
      </div>
    </div>
  );
}
