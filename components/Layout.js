import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { RiSunFill, RiMoonFill } from 'react-icons/ri';
import Header from './Header';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '../utils/AppContext';

export default function Layout({ children }) {
  const { theme, setTheme } = useContext(AppContext);
  return (
    <div className="dark:bg-black h-full">
      <Header />
      <ToastContainer />
      <div className="content">
        {children}
      </div>
      {theme === 'dark' ? <button type="button" className="border-none fixed z-50  bottom-3 p-2 border bg-black text-white rounded-full right-0 text-4xl outline-none ml-0 mr-3 md:mr-5"><RiSunFill onClick={() => { localStorage.theme = 'light'; setTheme('light'); }} /></button>
        : <button type="button" className="border-none fixed z-50  bottom-3 p-2 border bg-white rounded-full right-0 text-4xl outline-none mr-3 ml-0 md:mr-5"><RiMoonFill onClick={() => { localStorage.theme = 'dark'; setTheme('dark'); }} /></button>}
    </div>
  );
}
