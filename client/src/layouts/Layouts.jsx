import Header from "./Header";
import Footer from "./Footer";


function Layouts({ children }) { 
  return (<>

    <Header />
      <main className="min-h-[calc(100vh-165px)] md:min-h-[calc(100vh-180px)] lg:min-h-[calc(100vh-135px)]">{children}</main>
    <Footer />
    
  </>);
}
 
export default Layouts;