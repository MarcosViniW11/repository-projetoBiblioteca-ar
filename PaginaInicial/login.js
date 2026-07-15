const API="http://localhost:8080/auth/login"


document.getElementById("loginId").addEventListener("submit", async (pagina) => {
    pagina.preventDefault();

    const login={
        email:document.getElementById("emailId").value,
        senha:document.getElementById("senhaId").value
    }

    if(login.email === "" || login.senha === ""){alert("Campo(s) em Branco!"); return;};

    const res = await fetch(API,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(login)
    });

    if (!res.ok) {
            const errorJs = await res.json();
            // Tenta pegar 'message' ou 'mensagem', o que estiver disponível
            const errorMsg = errorJs.message || errorJs.mensagem || "Credenciais Inválidas!";
            
            alert("MENSAGEM DE ERRO: " + errorMsg);
            return;
        }

    /*if(res.status==404){
        js=await res.json();

        mensagem = js.message;
        alert("MENSAGEM DE ERROR: "+mensagem);
        return;
    }

    if (!res.ok) { alert("OCORREU UM ERRO Ao Logar, credenciais Inválidas!"); return; }
    */
    const resposta = await res.json();
    const token = resposta.token;
    const role = resposta.role;

    window.localStorage.setItem("token", token);
    window.localStorage.setItem("role", role);

   
    if (role === "ROLE_ADMIN") {
        alert("LOGADO COMO ADMIN, redirecionando para página de Admin");
        window.location.href = "../PaginaAdmin/admin.html";
    } else {
        alert("Usuário Logado Com Sucesso, Redirecionando para página de Usuários");
        window.location.href = "../PaginaUsuario/usuario.html";
    }    
    
})

function togglePassword() {
    const passwordInput = document.getElementById("senhaId");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.textContent = "🙈"; // Ícone de "esconder"
    } else {
        passwordInput.type = "password";
        eyeIcon.textContent = "👁️"; // Ícone de "mostrar"
    }
}