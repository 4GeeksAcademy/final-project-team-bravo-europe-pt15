//import react into the bundle
import React from "react";
import { createRoot } from "react-dom/client";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//create a root
const container = document.querySelector("#app");
const root = createRoot(container);

//render your react application
root.render(<Layout />);
