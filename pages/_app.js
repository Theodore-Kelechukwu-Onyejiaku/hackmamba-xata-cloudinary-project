import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AppContext from '../utils/AppContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [theme, setTheme] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <SessionProvider session={session}>
      <AppContext.Provider value={{
        theme, setTheme, searchValue, setSearchValue, profilePicture, setProfilePicture,
      }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
