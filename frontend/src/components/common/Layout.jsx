import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children, disabledNav }) {
    return (
        <>
            {disabledNav ? "" : <Navbar />}
            <main>
            {children}
            </main>
            <Footer/>
        </>
    );
}

export default Layout;