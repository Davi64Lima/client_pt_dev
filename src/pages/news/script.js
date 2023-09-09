const token = localStorage.getItem("token");

const urlDomain = "https://api-ptdev.onrender.com";
//const urlDomain = "https://api-ptdev.onrender.com";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const newsId = urlParams.get("id");

// Selecione o botão pelo ID
const postCommentBotao = document.getElementById("comment-btn");
// Adicione um ouvinte de evento para o clique

function renderizarDadosDaNoticia(news) {
  const tituloElement = document.getElementById("titulo");
  const conteudoElement = document.getElementById("notice p");

  tituloElement.textContent = news.title; // Altere "title" para o campo correto no objeto de notícia
  conteudoElement.textContent = news.conteudo; // Altere "content" para o campo correto no objeto de notícia

  let url = `data:image/${news.extensionfile};base64,${news.src}`;

  fetch(url)
    .then((resposta) => resposta.blob())
    .then((imagem) => {
      const imagemElement = document.getElementById("top-img");
      imagemElement.src = URL.createObjectURL(imagem);
    });
}

function renderizarComentarios(comentarios) {
  const commentArea = document.getElementById("comments-id");
  // commentArea.textContent = ""; // Limpa a área de comentários antes de adicionar os novos

  comentarios.forEach((comentario) => {
    const userComment = document.createElement("div");
    userComment.classList.add("user-comment");

    const nameComment = document.createElement("h6");
    nameComment.classList.add("name-comment");
    nameComment.textContent = comentario.author; // Altere "author" para o campo correto no objeto de comentário

    const txtComment = document.createElement("p");
    txtComment.classList.add("comment");
    txtComment.textContent = comentario.texto; // Altere "text" para o campo correto no objeto de comentário

    const dateComment = document.createElement("p");
    dateComment.classList.add("time");
    dateComment.textContent = comentario.data; // Altere "date" para o campo correto no objeto de comentário

    userComment.append(nameComment, txtComment, dateComment);
    commentArea.appendChild(userComment);
    userComment.style.opacity = 100;
  });
}

function formatarData(dataString) {
  // Parse da data original
  const data = new Date(dataString);

  // Obtém os componentes da data e hora
  const dia = String(data.getDate()).padStart(2, "0"); // Dia com dois dígitos
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Mês com dois dígitos (lembrando que janeiro é 0)
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0"); // Hora com dois dígitos
  const minutos = String(data.getMinutes()).padStart(2, "0"); // Minutos com dois dígitos

  // Formata a data no formato desejado
  const dataFormatada = `${dia}/${mes}/${ano} às ${horas}:${minutos}`;

  return dataFormatada;
}

function renderItensAuth() {
  if (token) {
    fetch(urlDomain + "/users/validation", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          localStorage.setItem("user", JSON.stringify(data.user));
          const loginBtn = document.getElementById("loginBtn");
          loginBtn.textContent = data.user.name;
          loginBtn.href = "/front/src/pages/profile/profile.html";

          fetch(urlDomain + "/noticias/id/" + newsId)
            .then((resposta) => resposta.json())
            .then((noticia) => {
              noticia = noticia[0];
              renderizarDadosDaNoticia(noticia);
            })
            .catch((erro) => {
              console.error("Erro ao buscar detalhes da notícia:", erro);
            });
          fetch(urlDomain + "/comments/" + newsId)
            .then((resposta) => resposta.json())
            .then((comentarios) => {
              renderizarComentarios(comentarios);
            })
            .catch((erro) => {
              console.log("Erro ao buscar comentários:", erro);
            });
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar autenticação:", error);
      });
  } else {
    fetch(urlDomain + "/noticias/" + newsId)
      .then((resposta) => resposta.json())
      .then((noticia) => {
        noticia = noticia[0];
        renderizarDadosDaNoticia(noticia);
      })
      .catch((erro) => {
        console.error("Erro ao buscar detalhes da notícia:", erro);
      });
    fetch(urlDomain + "/comments/" + newsId)
      .then((resposta) => resposta.json())
      .then((comentarios) => {
        renderizarComentarios(comentarios);
      })
      .catch((erro) => {
        console.log("Erro ao buscar comentários:", erro);
      });
  }
}
async function publicComment() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Você precisa estar logado para comentar!");
    window.location.href = "/front/src/pages/autenticacao/login/login.html";
    return;
  }

  // Mostrar a tela de carregamento
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.display = "block";

  const comment = document.getElementById("floatingTextarea").value;
  const data = formatarData(new Date());

  const author = user._id; // Acesse o ID do usuário diretamente

  const commentData = {
    texto: comment,
    data: data,
    author: author,
    publicacao: newsId,
  };

  try {
    await fetch(urlDomain + "/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    // Ocultar a tela de carregamento após a requisição ser concluída
    loadingScreen.style.display = "none";

    window.location.reload();
  } catch (error) {
    console.error("Erro ao enviar o comentário:", error);

    // Em caso de erro, também oculte a tela de carregamento
    loadingScreen.style.display = "none";
  }
}

renderItensAuth();
postCommentBotao.addEventListener("click", publicComment);

window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  const navLinks = Array.from(document.getElementsByClassName("nav-link"));
  const scroll = window.scrollY;
  let screenWidth = window.innerWidth;

  if (scroll > 10 && screenWidth > 992) {
    navbar.classList.add("scroll");
    navbar.style.height = "65px";
    navLinks.forEach((elem) => {
      elem.style.fontSize = "14px";
    });
  } else if (scroll < 10 && screenWidth > 992) {
    navbar.classList.remove("scroll");
    navbar.style.height = "99px";
    navLinks.forEach((elem) => {
      elem.style.fontSize = "16px";
    });
  } else if (screenWidth < 992) {
    navbar.style.height = "auto";
  }

  const scrollBtn = document.getElementById("arrow-box");

  if (window.scrollY > 500) {
    scrollBtn.style.opacity = "1";
    scrollBtn.style.transform = "translateX(.4rem)";
  } else {
    scrollBtn.style.opacity = "0";
    scrollBtn.style.transform = "translateX(4rem)";
  }
});

document.getElementById("arrow-box").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollBy(0, -100000);
});
