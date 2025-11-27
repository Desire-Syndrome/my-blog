import Header from "./Header";
import Footer from "./Footer";


function Layouts({ children }) { 
  return (<>

    <Header />
      <main className="min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-215px)] lg:min-h-[calc(100vh-175px)]">{children}</main>
    <Footer />
    
  </>);
}
 
export default Layouts;