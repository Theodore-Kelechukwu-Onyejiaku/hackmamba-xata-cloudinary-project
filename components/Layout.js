import Header from "./Header"

export default function Layout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}
