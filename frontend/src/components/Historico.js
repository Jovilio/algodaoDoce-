import React, { useState } from "react";
import "./Historico.css"

function Historico() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [ip, setIp] = useState("");
  const [minimoPaginas, setMinimoPaginas] = useState("");
  const [dados, setDados] = useState([]);

  const buscar = async () => {
    const params = new URLSearchParams();
    if (inicio && fim) {
      params.append("inicio", inicio);
      params.append("fim", fim);
    }
    if (ip) params.append("ip", ip);
    if (minimoPaginas) params.append("minimo_paginas", minimoPaginas);

    try {
      const res = await fetch(`http://localhost:5000/historico?${params.toString()}`);
      const data = await res.json();
      setDados(data);
    } catch (e) {
      console.error("Erro ao buscar histórico:", e);
      setDados([]);
    }
  };

  return (
    <div className="filtrarConteudo">

      <div className="campoDeBusca">

        <div className="txtBuscarPorFiltro">
          <h2>
            Buscar <br></br> por parametros
          </h2>

          <p className="pSobreFiltro">
            Faça uma busca com parametros especificos para ver o que aconteceu durante determinado periodo.
          </p>
        </div>

        <div className="inputsParaBuscar">
          <label>
            <span>Início</span>
            <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />
          </label>
          
          <label>
            <span>Fim</span>
            <input type="date" value={fim} onChange={e => setFim(e.target.value)} /></label>
          
          <label>
            <span>IP da Impressora</span>
            <input type="text" value={ip} onChange={e => setIp(e.target.value)} placeholder="IP da impressora" /></label>
          <label>
            <span>
              Mínimo de páginas
            </span>
            <input type="number" value={minimoPaginas} onChange={e => setMinimoPaginas(e.target.value)} placeholder="Qtd de páginas" /></label>

      <button onClick={buscar} className="btnBuscar">Buscar</button>
        </div>
        
      <button className="btnExportarParaCSV"
        onClick={() => {
          const params = new URLSearchParams();
          if (inicio && fim) {
            params.append("inicio", inicio);
            params.append("fim", fim);
          }
          if (ip) params.append("ip", ip);
          if (minimoPaginas) params.append("minimo_paginas", minimoPaginas);

          const url = `http://localhost:5000/historico/csv?${params.toString()}`;
          window.open(url, "_blank");
        }}
      >
        Descarregar arquivo CSV
      </button>
      </div>
      

      {dados.length === 0 ? (
        <p>Nenhum dado encontrado.</p>
      ) : (
        <ul>
          {dados.map((imp, idx) => (
            <li key={idx}>
              <strong>IP:</strong> {imp.ip} | <strong>Páginas:</strong> {imp.pageCount} |{" "}
              <strong>Data:</strong> {new Date(imp.data_detectada).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Historico;
