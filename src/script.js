// Importe funções do arquivo functions.js
import {
  auth,
  renderItens,
  handleScroll,
  handleScrollButtonClick,
} from "/src/scripts/functions.js"; // Substitua 'seuarquivo.js' pelo caminho correto para o arquivo onde as funções estão definidas

// Agora você pode chamar as funções conforme necessário
const token = localStorage.getItem("token");
auth(token);

const fetchURL = "http://localhost:3000/noticias/4";
//const fetchURL = "http://localhost:3000/noticias/4";

renderItens(fetchURL);

// ... Outros usos das funções

window.addEventListener("scroll", handleScroll);
document
  .getElementById("arrow-box")
  .addEventListener("click", handleScrollButtonClick);
