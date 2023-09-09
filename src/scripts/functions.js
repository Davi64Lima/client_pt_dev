// Função para criar elementos de imagem
function createImage(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  return img;
}

// Função para criar elementos de texto
function createTextElement(tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  return element;
}

// Função para criar um card
function createCard(noticia) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.width = "20rem";

  const imgBox = document.createElement("div");
  imgBox.className = "img-box";

  //const imgSrc = `https://api-ptdev.onrender.com/uploads/${noticia.src}`;
  const imgSrc = `data:image/${noticia.extensionfile};base64,${noticia.src}`;
  const cardImageLink = document.createElement("a");
  cardImageLink.href = `/front/src/pages/news/news.html?id=${noticia._id}`;
  cardImageLink.appendChild(createImage(imgSrc, noticia.title));

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const titulo = createTextElement("h3", noticia.title);
  const data = createTextElement("p", noticia.data, "date");

  const categoria = createTextElement("p", noticia.categoria, "categoria");
  categoria.classList.add("category");

  imgBox.appendChild(cardImageLink);
  cardBody.appendChild(titulo);
  cardBody.appendChild(data);
  cardBody.appendChild(categoria);

  card.appendChild(imgBox);
  card.appendChild(cardBody);

  return card;
}

// Função para renderizar os cards
function renderizarCards(noticias) {
  const cardsContainer = document.querySelector(".cards-container");
  cardsContainer.textContent = "";

  noticias.forEach((noticia) => {
    const card = createCard(noticia);
    cardsContainer.appendChild(card);
  });
}

// Função para renderizar os itens (autenticado ou não)
function renderItens(fetchURL) {
  const cardsContainer = document.querySelector(".cards-container");
  cardsContainer.textContent = "";

  fetch(fetchURL)
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro ao buscar notícias: ${resposta.status}`);
      }
      return resposta.json();
    })
    .then((noticias) => {
      console.log(noticias);
      noticias.forEach((noticia) => {
        const card = createCard(noticia);
        cardsContainer.appendChild(card);
      });
    })
    .catch((erro) => {
      console.error("Erro:", erro);
    });
}

// Função para autenticação
function auth(token) {
  if (token) {
    fetch("https://api-ptdev.onrender.com/users/validation", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          const loginBtn = document.getElementById("loginBtn");
          loginBtn.textContent = data.user.name;
          loginBtn.href = "/front/src/pages/profile/profile.html";
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar autenticação:", error);
      });
  }
}

// Função para lidar com o scroll
function handleScroll() {
  const navbar = document.getElementById("navbar");
  const navLinks = Array.from(document.getElementsByClassName("nav-link"));
  const scroll = window.scrollY;
  const screenWidth = window.innerWidth;

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

  if (window.scrollY > 1000) {
    scrollBtn.style.opacity = "1";
    scrollBtn.style.transform = "translateX(.4rem)";
  } else {
    scrollBtn.style.opacity = "0";
    scrollBtn.style.transform = "translateX(4rem)";
  }
}

// Função para lidar com o clique no botão de scroll
function handleScrollButtonClick(e) {
  e.preventDefault();
  window.scrollBy(0, -10000);
}

// Função para aplicar a animação de revelação
function applyScrollReveal(selector) {
  ScrollReveal().reveal(selector, {
    delay: 300,
    rotate: {
      x: 100,
    },
  });
}

export {
  auth,
  renderItens,
  handleScroll,
  handleScrollButtonClick,
  applyScrollReveal,
};
