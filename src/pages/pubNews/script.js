const token = localStorage.getItem("token");

import {
  auth,
  renderItens,
  handleScroll,
  handleScrollButtonClick,
} from "/front/src/scripts/functions.js";

function mapCategoriaValue(value) {
  switch (value) {
    case "1":
      return "Esporte";
    case "2":
      return "Tecnologia";
    case "3":
      return "Arte";
    default:
      return "Outros";
  }
}

async function handleSubmitForm(ev) {
  ev.preventDefault();

  const form = new FormData(ev.target);
  const fileInput = document.querySelector("#file"); // Seleciona o input de arquivo pelo ID
  const file = fileInput.files[0]; // Obtém o arquivo do input de arquivo
  const title = form.get("title");
  const autor = form.get("autor");
  const categoria = mapCategoriaValue(form.get("categoria"));
  const conteudo = form.get("conteudo");

  const dados = new FormData(); // Use FormData para lidar com envio de arquivo
  dados.append("file", file); // Anexe o arquivo ao FormData
  dados.append("title", title);
  dados.append("categoria", categoria);
  dados.append("conteudo", conteudo);
  dados.append("autor", autor);
  console.log(dados);
  try {
    const response = await fetch("https://api-ptdev.onrender.com/noticias", {
      method: "POST",
      body: dados, // Use o FormData diretamente como corpo da requisição
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log(responseData);
    alert("Notícia publicada com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao publicar notícia!");
  }

  document.querySelector("form").reset();
}

async function initialize() {
  auth(token);

  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmitForm);
}

initialize();
