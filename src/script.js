// Importe funções do arquivo functions.js
import {
  auth,
  renderItens,
  handleScroll,
  handleScrollButtonClick,
} from "/front/src/scripts/functions.js"; // Substitua 'seuarquivo.js' pelo caminho correto para o arquivo onde as funções estão definidas

// Agora você pode chamar as funções conforme necessário
const token = localStorage.getItem("token");
auth(token);

const fetchURL = "https://api-ptdev.onrender.com/noticias/4";
//const fetchURL = "https://api-ptdev.onrender.com/noticias/4";

renderItens(fetchURL);

// ... Outros usos das funções

window.addEventListener("scroll", handleScroll);
document
  .getElementById("arrow-box")
  .addEventListener("click", handleScrollButtonClick);
