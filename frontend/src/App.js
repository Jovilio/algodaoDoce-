import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from
"react-router-dom";
import ImpressorasAtivas from "./components/ImpressorasAtivas";
import Historico from "./components/Historico";
import SobreApp from './components/SobreApp';
import SobreDesenvolvedor from './components/SobreDesenvolvedor';
//importando estilos
import "./components/AppHeader.css"

//importar imagem
import logo from "./imagens/logoGotasSemFundo1.png";

function App() {
  return (
    <Router>
      <div >
        
        <header className="cabecalho_app">
          
          <div className="logoMarca" title="logo do app - Gotas">
            <img src={logo} alt="Logo" className="logo" />
          </div>
            
        <nav>
          <NavLink to="/" className="btnLinkDaNav">impressoras</NavLink>
          <NavLink to="/historico" className="btnLinkDaNav">histórico</NavLink>
          <NavLink to="/sobre-app" className="btnLinkDaNav">aplicativo</NavLink>
          <NavLink to="/sobre-desenvolvedor" className="btnLinkDaNav">desenvolvedor</NavLink>
        </nav>
          
        </header>

        <Routes>
          <Route path="/" element={<ImpressorasAtivas />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/sobre-app" element={<SobreApp />} />
          <Route path="/sobre-desenvolvedor" element={<SobreDesenvolvedor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
