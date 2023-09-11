// Obtém o token e a newsId do localStorage
const token = localStorage.getItem("token");
const newsId = localStorage.getItem("noticiaID");

console.log(newsId);

// Selecione o botão pelo ID
const postCommentBotao = document.getElementById("comment-btn");

// Define a URL base da API
const apiUrl = "https://api-ptdev.onrender.com";

// Função para buscar dados da notícia e comentários
async function fetchData() {
  try {
    if (token) {
      const authResponse = await fetch(`${apiUrl}/users/validation`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (authResponse.ok) {
        const authData = await authResponse.json();
        localStorage.setItem("user", JSON.stringify(authData.user));
        const loginBtn = document.getElementById("loginBtn");
        loginBtn.textContent = authData.user.name;
        loginBtn.href = "pages/profile/profile.html";
      } else {
        localStorage.removeItem("token");
      }
    }

    const [noticiaResponse, comentariosResponse] = await Promise.all([
      fetch(`${apiUrl}/noticias/id/${newsId}`).then((response) =>
        response.json()
      ),
      fetch(`${apiUrl}/comments/${newsId}`).then((response) => response.json()),
    ]);

    renderizarDadosDaNoticia(noticiaResponse[0]);
    renderizarComentarios(comentariosResponse);
  } catch (error) {
    console.error("Erro ao buscar detalhes da notícia/comentários:", error);
  }
}

// Função para renderizar os dados da notícia
function renderizarDadosDaNoticia(news) {
  const tituloElement = document.getElementById("titulo");
  const conteudoElement = document.getElementById("notice p");
  const imagemElement = document.getElementById("top-img");

  tituloElement.textContent = news.title;
  conteudoElement.textContent = news.conteudo;

  imagemElement.src = `data:image/${news.extensionfile};base64,${news.src}`;
}

// Função para renderizar os comentários
function renderizarComentarios(comentarios) {
  const commentArea = document.getElementById("comments-id");
  commentArea.innerHTML = "";

  if (comentarios.length === 0) {
    const noCommentsMessage = document.createElement("p");
    noCommentsMessage.textContent = "Nenhum comentário ainda.";
    commentArea.appendChild(noCommentsMessage);
  } else {
    commentArea.classList.add("visible"); // Adiciona uma classe para tornar a área de comentários visível

    comentarios.forEach((comentario) => {
      const userComment = document.createElement("div");
      userComment.classList.add("user-comment");

      const nameComment = document.createElement("h6");
      nameComment.classList.add("name-comment"); // Correção aqui
      nameComment.textContent = comentario.author;

      const txtComment = document.createElement("p");
      txtComment.classList.add("comment");
      txtComment.textContent = comentario.texto;

      const dateComment = document.createElement("p");
      dateComment.classList.add("time");
      dateComment.textContent = comentario.data;

      userComment.append(nameComment, txtComment, dateComment);
      commentArea.appendChild(userComment);
    });
  }
}

// Função para publicar um comentário
async function publicComment() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Você precisa estar logado para comentar!");
    window.location.href = "/pages/autenticacao/login/login.html";
    return;
  }

  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.display = "block";

  const comment = document.getElementById("floatingTextarea").value;
  const data = formatarData(new Date());
  const author = user._id;

  const commentData = {
    texto: comment,
    data: data,
    author: author,
    publicacao: newsId,
  };

  try {
    await fetch(`${apiUrl}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    loadingScreen.style.display = "none";
    window.location.reload();
  } catch (error) {
    console.error("Erro ao enviar o comentário:", error);
    loadingScreen.style.display = "none";
  }
}

// Função para formatar a data
function formatarData(dataString) {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

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

fetchData();
