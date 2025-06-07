import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("No se pudo encontrar el elemento con id 'root'");
}
