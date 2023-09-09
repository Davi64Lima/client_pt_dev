// Função para lidar com o envio do formulário
async function lidarComEnvioFormulario(evento) {
  evento.preventDefault(); // Impede o envio padrão do formulário

  try {
    // Obter os dados do formulário
    const formulario = evento.target;
    const email = formulario.email.value;
    const senha = formulario.password.value;

    // Criar um objeto JSON com o email e a senha
    const dados = { email, password: senha };

    console.log(JSON.stringify(dados));

    // Enviar os dados para a sua API usando fetch
    const resposta = await fetch("https://api-ptdev.onrender.com/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao fazer login: ${resposta.status}`);
    }

    const dadosResposta = await resposta.json();
    localStorage.setItem("token", dadosResposta.token);
    console.log("Usuário logado com sucesso!");

    // Redirecione o usuário para a página desejada após o login
    window.location.href = "/front/src/index.html";
  } catch (erro) {
    // Lidar com quaisquer erros que ocorreram durante o processo
    console.error("Erro:", erro);
  }
}

// Adicionar um event listener para o evento "submit" do formulário
const formulario = document.getElementById("loginForm");
formulario.addEventListener("submit", lidarComEnvioFormulario);
