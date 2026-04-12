import Header from "../../assets/components/Header/Header";
import Footer from "../../assets/components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />

      <div className="main-container">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}