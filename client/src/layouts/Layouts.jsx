import Header from "./Header";
import Footer from "./Footer";


function Layouts({ children }) { 
  return (<>

    <Header />
      <main className="min-h-lvh">{children}</main>
    <Footer />
    
  </>);
}
 
export default Layouts;