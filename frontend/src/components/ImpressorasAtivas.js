import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// carregando estilos
import "./ImpressorasAtivas.css"

const socket = io("http://localhost:5000"); // Backend rodando nessa porta

function ImpressorasAtivas() {
  const [impressoras, setImpressoras] = useState([]);

  // Carrega as impressoras atuais no primeiro carregamento
  useEffect(() => {
    fetch("http://localhost:5000/impressoras")
      .then((res) => res.json())
      .then((data) => setImpressoras(data))
      .catch((err) => console.error("Erro ao buscar impressoras:", err));
  }, []);

  // Conecta ao WebSocket para receber novas impressoras ao vivo
  useEffect(() => {
    socket.on("nova-impressora", (novaImp) => {
      console.log("🖨️ Nova impressora detectada:", novaImp);

      // Adiciona a nova impressora à lista existente
      setImpressoras((prev) => [novaImp, ...prev]);

      // Alerta simples (pode usar Toast depois)
      alert(`Nova impressora: ${novaImp.ip} — ${novaImp.pageCount} páginas`);
    });

    // Cleanup
    return () => {
      socket.off("nova-impressora");
    };
  }, []);

  return (
    <div className="impressorasAtivas">

      {/* <h2 className="tituloDaSessao">
        <span>
          🖨️
        </span>
        <span>
          Impressoras Ativas
        </span>
        <span>
          Listando todas os dispositivos (impressoras) conectados no sistema em tempo real atráves da rede ou cabo.
        </span>


      </h2> */}

      {impressoras.length === 0 ? (
        <div className="alerta">
          {/* <p>Nenhuma impressora detectada.</p> */}

          <div className="janelaInformativa">
            
            <h2>Nenhuma Impressoras Detectada</h2>
            
            <p>
              Não foram detectadas qualquer 
               <em className="destaque">
                 impressoras 
              </em> 
              pelo sistema atráves da rede wifi, cabo ou outra forma.
            </p>
          </div>

        
        </div>
      ) : (
        <ul>
          {impressoras.map((imp, i) => (
            <li key={i}>
              <strong>IP:</strong> {imp.ip} — <strong>Páginas:</strong> {imp.pageCount}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default ImpressorasAtivas;
