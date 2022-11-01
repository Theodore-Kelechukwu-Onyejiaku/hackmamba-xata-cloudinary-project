import "../styles/globals.css"
import Layout from "../components/Layout"
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from "react"
import AppContext from "../utils/AppContext"



function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [theme, setTheme] = useState("");
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme("dark")
      document.documentElement.classList.add('dark')
    } else {
      setTheme("light")
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return <SessionProvider session={session}>
    <AppContext.Provider value={{ theme: theme, setTheme: setTheme, searchValue: searchValue, setSearchValue: setSearchValue }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  </SessionProvider>

}

export default MyApp
