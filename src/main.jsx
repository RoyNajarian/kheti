import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import './styles/global.css'
import "./i18n";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
