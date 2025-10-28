import Header from "./Header";
import Footer from "./Footer";


function Layouts({ children }) { 
  return (<>

    <Header />
      <main>{children}</main>
    <Footer />
    
  </>);
}
 
export default Layouts;