  // import { StrictMode } from "react";
  // import { createRoot } from "react-dom/client";
  // import "./index.css";
  // import { BrowserRouter } from "react-router-dom";
  // import App from "./App.jsx";
  // import  AdminContextProvider from "./context/AdminContext.jsx";
  // import AppContextProvider from "./context/AppContext.jsx";
  // import DoctorContextProvider from "./context/DoctorContext.jsx";

  // createRoot(document.getElementById("root")).render(
  //   <BrowserRouter>
  //     <AdminContextProvider>
  //       <AppContextProvider>
  //         <DoctorContextProvider>
  //       <App />
  //       </DoctorContextProvider>
  //       </AppContextProvider>
  //     </AdminContextProvider>
  //   </BrowserRouter>
  // );


  import { createRoot } from "react-dom/client";
  import "./index.css";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App.jsx";
  import AdminContextProvider from "./context/AdminContext.jsx";
  import AppContextProvider from "./context/AppContext.jsx";
  import {DoctorContextProvider} from "./context/DoctorContext.jsx";

  createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AdminContextProvider>
        <AppContextProvider>
          <DoctorContextProvider>
            <App />
          </DoctorContextProvider>
        </AppContextProvider>
      </AdminContextProvider>
    </BrowserRouter>
  );
