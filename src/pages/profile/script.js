const token = localStorage.getItem("token");

// Script para fazer o logout
document.getElementById("logout-button").addEventListener("click", () => {
  // Remove o token do localStorage
  localStorage.removeItem("token");
  // Limpa o localStorage
  localStorage.clear();

  // Redireciona o usuário para a página inicial
  window.location.href = "/front/src/index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const userNameElement = document.getElementById("user-name");
  const userEmailElement = document.getElementById("user-email");

  function fetchUserDataAndDisplay() {
    if (token) {
      fetch("https://api-ptdev.onrender.com/users/validation", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Enviar o token no cabeçalho Authorization
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isAuthenticated) {
            console.log(data.user.isAdmin);
            userNameElement.textContent = data.user.name;
            userEmailElement.textContent = data.user.email;
            if (!data.user.isAdmin) {
              const pubNewsLink = document.getElementById("pubNews-btn");
              pubNewsLink.remove();
            }
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar autenticação:", error);
        });
    } else {
      window.location.href = "/front/src/pages/autenticacao/login/login.html";
    }
  }

  // Call the fetchUserDataAndDisplay function to get and display user data
  fetchUserDataAndDisplay();
});
