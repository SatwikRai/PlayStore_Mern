import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, title }) => {
    return (
        <>
            <Header />
            <main style={{ minHeight: "70vh" }}>
                <Toaster />
                {children}
            </main>
            <Footer />
        </>
    )
}

export default Layout