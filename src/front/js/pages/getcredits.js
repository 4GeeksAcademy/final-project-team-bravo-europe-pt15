import React, { useContext } from "react";
import { Context } from "../store/appContext";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import { Princing } from "../component/getcredits";


export const GetCredits = () => {
  return (
    <div>
      <Navbar />
      <div className="ellipse-container">
  {Array.from({ length: 9 }, (_, index) => (
    <div key={index} className={`ellipse ellipse-${index + 1}`} />
  ))}
</div>          
      <Princing />
      <Footer />
    </div>
  );
};



