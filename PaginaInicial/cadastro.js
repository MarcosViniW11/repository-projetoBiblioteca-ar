const API="http://localhost:8080/auth/register";


document.getElementById("cadatroId").addEventListener("submit", async pagina => {
    pagina.preventDefault()

    const cadastro = {
        nome:document.getElementById("nomeId").value,
        email:document.getElementById("emailId").value,
        senha:document.getElementById("senhaId").value,
        telefone:document.getElementById("telefoneId").value
    }

    if(cadastro.nome === "" || cadastro.email === "" || cadastro.senha === "" || cadastro.telefone === ""){
        alert("Campo(s) em branco!!")
        return
    }

    if(cadastro.senha.length < 6){alert("Senha precisa ter ao menos 6 caracters"); return;}

    const res = await fetch(API,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(cadastro)
    });

    if(res.status === 400){ 
        let body = await res.json()
        let resFinal = body.mensagem;
        alert(`Ocorreu um erro inesperado: ${resFinal}`);
        return;
    }

    if(res.status!==201){
        alert("Ocorreu um erro ao cadastrar!")
        return
    }

    alert("Cadastro Realizado Com Sucesso, Redimencionando para pagina de Login!")
    window.location.href="./login.html";
})




function togglePassword() {
    const inputSenha = document.getElementById("senhaId");
    const icone = document.getElementById("eyeIcon");

    if (inputSenha.type === "password") {
        inputSenha.type = "text";
        icone.textContent = "🙈"; // Muda para o macaco cobrindo os olhos
    } else {
        inputSenha.type = "password";
        icone.textContent = "👁️"; // Volta para o olho
    }
}
