/* ==========================================================
   CONFIGURAÇÕES GERAIS
========================================================== */

const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

/* ==========================================================
   VALIDAÇÃO DE ACESSO
========================================================== */

if (!token) {
    alert("Usuário não autenticado.");
    window.location.href = "../PaginaInicial/login.html";
}

if (role === "ROLE_ADMIN") {
    window.location.href = "../PaginaAdmin/admin.html";
}

/* ==========================================================
   HEADERS PADRÃO
========================================================== */

function getHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}

/* ==========================================================
   LOADING
========================================================== */

function mostrarLoading() {
    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "flex";
    }
}

function esconderLoading() {
    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "none";
    }
}

/* ==========================================================
   TOAST
========================================================== */

function mostrarToast(mensagem, sucesso = true) {
    const toast = document.getElementById("toast");
    const texto = document.getElementById("toastMensagem");

    if (!toast || !texto) return;

    texto.innerText = mensagem;
    toast.classList.remove("sucesso", "erro");
    toast.classList.add(sucesso ? "sucesso" : "erro");
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3500);
}

/* ==========================================================
   UTILITÁRIOS
========================================================== */

function formatarData(valor) {
    if (!valor) return "-";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return valor;
    }

    return data.toLocaleDateString("pt-BR");
}

function escaparTexto(valor) {
    return String(valor ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}

/* ==========================================================
   REQUEST PADRÃO
========================================================== */

async function apiRequest(url, method = "GET", body = null) {
    try {
        mostrarLoading();

        const config = {
            method,
            headers: getHeaders()
        };

        if (body !== null && body !== undefined) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);

        if (response.status === 401) {
            localStorage.clear();
            mostrarToast("Sessão expirada.", false);

            setTimeout(() => {
                window.location.href = "../PaginaInicial/login.html";
            }, 1500);

            throw new Error("Não autorizado");
        }

        if (!response.ok) {
            let mensagem = "Erro na operação.";

            try {
                const erro = await response.json();
                mensagem = erro.message || erro.error || mensagem;
            } catch {
            }

            throw new Error(mensagem);
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get("content-type") || "";
        const texto = await response.text();

        if (!texto.trim()) {
            return null;
        }

        if (contentType.includes("application/json")) {
            try {
                return JSON.parse(texto);
            } catch {
                return texto;
            }
        }

        return texto;
    } catch (erro) {
        console.error(erro);
        mostrarToast(erro.message, false);
        throw erro;
    } finally {
        esconderLoading();
    }
}

/* ==========================================================
   NAVEGAÇÃO ENTRE PÁGINAS
========================================================== */

function mostrarSecao(idSecao) {
    document.querySelectorAll(".page").forEach((secao) => {
        secao.classList.remove("active");
    });

    document.querySelectorAll(".menu-btn").forEach((botao) => {
        botao.classList.remove("active");
    });

    const pagina = document.getElementById(idSecao);

    if (pagina) {
        pagina.classList.add("active");
    }

    document.querySelectorAll(".menu-btn").forEach((botao) => {
        if (botao.getAttribute("onclick")?.includes(idSecao)) {
            botao.classList.add("active");
        }
    });
}

/* ==========================================================
   LOGOUT
========================================================== */

function logout() {
    const confirmar = confirm("Deseja sair?");

    if (!confirmar) return;

    localStorage.clear();
    mostrarToast("Logout realizado.");

    setTimeout(() => {
        window.location.href = "../PaginaInicial/login.html";
    }, 1000);
}

/* ==========================================================
   ELEMENTOS DAS TABELAS
========================================================== */

const tbodyLivros = document.getElementById("tbodyLivros");
const tbodyAutores = document.getElementById("tbodyAutores");
const tbodyCategorias = document.getElementById("tbodyCategorias");
const tbodyEmprestimos = document.getElementById("tbodyEmprestimos");

/* ==========================================================
   CARDS DO DASHBOARD
========================================================== */

const totalLivros = document.getElementById("totalLivros");
const totalAutores = document.getElementById("totalAutores");
const totalCategorias = document.getElementById("totalCategorias");
const totalEmprestimos = document.getElementById("totalEmprestimos");

/* ==========================================================
   PERFIL DO USUÁRIO
========================================================== */

const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
const perfilTelefone = document.getElementById("perfilTelefone");
const nomeUsuario = document.getElementById("nomeUsuario");

/* ==========================================================
   ARRAYS GLOBAIS
========================================================== */

let livros = [];
let autores = [];
let categorias = [];
let emprestimos = [];
let usuarioLogado = null;
let livroSelecionado = null;

/* ==========================================================
   EVENTOS INICIAIS
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    await carregarDadosIniciais();
});

/* ==========================================================
   CARREGAMENTO INICIAL
========================================================== */

async function carregarDadosIniciais() {
    try {
        await Promise.all([
            carregarLivros(),
            carregarAutores(),
            carregarCategorias(),
            carregarEmprestimos(),
            carregarMeuCadastro()
        ]);

        atualizarDashboard();
    } catch (erro) {
        console.error(erro);
    }
}

/* ==========================================================
   DASHBOARD
========================================================== */

function atualizarDashboard() {
    totalLivros.innerText = Array.isArray(livros) ? livros.length : 0;
    totalAutores.innerText = Array.isArray(autores) ? autores.length : 0;
    totalCategorias.innerText = Array.isArray(categorias) ? categorias.length : 0;
    totalEmprestimos.innerText = Array.isArray(emprestimos) ? emprestimos.length : 0;
}

/* ==========================================================
   GET LIVROS
========================================================== */

async function carregarLivros() {
    const resposta = await apiRequest(`${API_BASE}/livros`);
    livros = Array.isArray(resposta) ? resposta : [];
    preencherTabelaLivros();
}

/* ==========================================================
   GET AUTORES
========================================================== */

async function carregarAutores() {
    const resposta = await apiRequest(`${API_BASE}/autores`);
    autores = Array.isArray(resposta) ? resposta : [];
    preencherTabelaAutores();
}

/* ==========================================================
   GET CATEGORIAS
========================================================== */

async function carregarCategorias() {
    const resposta = await apiRequest(`${API_BASE}/categorias`);
    categorias = Array.isArray(resposta) ? resposta : [];
    preencherTabelaCategorias();
}

/* ==========================================================
   GET MEUS EMPRÉSTIMOS
========================================================== */

async function carregarEmprestimos() {
    const resposta = await apiRequest(`${API_BASE}/emprestimos/meus`);
    emprestimos = Array.isArray(resposta) ? resposta : [];
    preencherTabelaEmprestimos();
    atualizarDashboard();
}

/* ==========================================================
   GET MEU CADASTRO
========================================================== */

async function carregarMeuCadastro() {
    const resposta = await apiRequest(`${API_BASE}/usuarios/me`);
    usuarioLogado = resposta || null;
    preencherPerfil();
}

/* ==========================================================
   TABELA LIVROS
========================================================== */

function preencherTabelaLivros() {
    if (!tbodyLivros) return;

    tbodyLivros.innerHTML = "";

    if (!livros.length) {
        tbodyLivros.innerHTML = '<tr><td colspan="8">Nenhum livro encontrado.</td></tr>';
        return;
    }

    livros.forEach((livro) => {
        const titulo = escaparTexto(livro.titulo || "");
        const disponivel = Number(livro.quantidadeDisponivel || 0);

        tbodyLivros.innerHTML += `
            <tr>
                <td>${livro.id ?? "-"}</td>
                <td>${livro.titulo ?? "-"}</td>
                <td>${livro.autor ?? "-"}</td>
                <td>${livro.categoria ?? "-"}</td>
                <td>${livro.anoPublicacao ?? "-"}</td>
                <td>${livro.editora ?? "-"}</td>
                <td>${disponivel}</td>
                <td>
                    <button
                        onclick="abrirModalEmprestimo(${livro.id}, '${titulo}')"
                        ${disponivel <= 0 ? "disabled" : ""}>
                        Emprestar
                    </button>
                </td>
            </tr>
        `;
    });
}

/* ==========================================================
   TABELA AUTORES
========================================================== */

function preencherTabelaAutores() {
    if (!tbodyAutores) return;

    tbodyAutores.innerHTML = "";

    if (!autores.length) {
        tbodyAutores.innerHTML = '<tr><td colspan="4">Nenhum autor encontrado.</td></tr>';
        return;
    }

    autores.forEach((autor) => {
        tbodyAutores.innerHTML += `
            <tr>
                <td>${autor.id ?? "-"}</td>
                <td>${autor.nome ?? "-"}</td>
                <td>${autor.nacionalidade ?? "-"}</td>
                <td>${autor.biografia ?? "-"}</td>
            </tr>
        `;
    });
}

/* ==========================================================
   TABELA CATEGORIAS
========================================================== */

function preencherTabelaCategorias() {
    if (!tbodyCategorias) return;

    tbodyCategorias.innerHTML = "";

    if (!categorias.length) {
        tbodyCategorias.innerHTML = '<tr><td colspan="3">Nenhuma categoria encontrada.</td></tr>';
        return;
    }

    categorias.forEach((categoria) => {
        tbodyCategorias.innerHTML += `
            <tr>
                <td>${categoria.id ?? "-"}</td>
                <td>${categoria.nome ?? "-"}</td>
                <td>${categoria.descricao ?? "-"}</td>
            </tr>
        `;
    });
}

/* ==========================================================
   TABELA EMPRÉSTIMOS
========================================================== */

function preencherTabelaEmprestimos() {
    if (!tbodyEmprestimos) return;

    tbodyEmprestimos.innerHTML = "";

    if (!emprestimos.length) {
        tbodyEmprestimos.innerHTML = '<tr><td colspan="6">Nenhum empréstimo encontrado.</td></tr>';
        return;
    }

    emprestimos.forEach((emprestimo) => {
        tbodyEmprestimos.innerHTML += `
            <tr>
                <td>${emprestimo.id ?? "-"}</td>
                <td>${emprestimo.livro ?? "-"}</td>
                <td>${formatarData(emprestimo.dataEmprestimo)}</td>
                <td>${formatarData(emprestimo.dataPrevistaDevolucao)}</td>
                <td>${formatarData(emprestimo.dataDevolucao)}</td>
                <td>${emprestimo.status ?? "-"}</td>
            </tr>
        `;
    });
}

/* ==========================================================
   PERFIL DO USUÁRIO
========================================================== */

function preencherPerfil() {
    if (!usuarioLogado) return;

    nomeUsuario.innerText = usuarioLogado.nome || "Usuário";
    perfilNome.innerText = usuarioLogado.nome || "Usuário";
    perfilEmail.innerText = usuarioLogado.email || "-";
    perfilTelefone.innerText = usuarioLogado.telefone || "-";
}

/* ==========================================================
   FILTRAR LIVROS
========================================================== */

function filtrarLivros() {
    const texto = document.getElementById("pesquisaLivro")?.value?.toLowerCase() || "";
    tbodyLivros.innerHTML = "";

    const filtrados = livros.filter((livro) => {
        const titulo = (livro.titulo || "").toLowerCase();
        const autor = (livro.autor || "").toLowerCase();
        const categoria = (livro.categoria || "").toLowerCase();

        return titulo.includes(texto) || autor.includes(texto) || categoria.includes(texto);
    });

    if (!filtrados.length) {
        tbodyLivros.innerHTML = '<tr><td colspan="8">Nenhum livro encontrado.</td></tr>';
        return;
    }

    filtrados.forEach((livro) => {
        const titulo = escaparTexto(livro.titulo || "");
        const disponivel = Number(livro.quantidadeDisponivel || 0);
        tbodyLivros.innerHTML += `
            <tr>
                <td>${livro.id ?? "-"}</td>
                <td>${livro.titulo ?? "-"}</td>
                <td>${livro.autor ?? "-"}</td>
                <td>${livro.categoria ?? "-"}</td>
                <td>${livro.anoPublicacao ?? "-"}</td>
                <td>${livro.editora ?? "-"}</td>
                <td>${disponivel}</td>
                <td>
                    <button
                        onclick="abrirModalEmprestimo(${livro.id}, '${titulo}')"
                        ${disponivel <= 0 ? "disabled" : ""}>
                        Emprestar
                    </button>
                </td>
            </tr>
        `;
    });
}

/* ==========================================================
   FILTRAR AUTORES
========================================================== */

function filtrarAutores() {
    const texto = document.getElementById("pesquisaAutor")?.value?.toLowerCase() || "";
    tbodyAutores.innerHTML = "";

    const filtrados = autores.filter((autor) => {
        const nome = (autor.nome || "").toLowerCase();
        const nacionalidade = (autor.nacionalidade || "").toLowerCase();
        return nome.includes(texto) || nacionalidade.includes(texto);
    });

    if (!filtrados.length) {
        tbodyAutores.innerHTML = '<tr><td colspan="4">Nenhum autor encontrado.</td></tr>';
        return;
    }

    filtrados.forEach((autor) => {
        tbodyAutores.innerHTML += `
            <tr>
                <td>${autor.id ?? "-"}</td>
                <td>${autor.nome ?? "-"}</td>
                <td>${autor.nacionalidade ?? "-"}</td>
                <td>${autor.biografia ?? "-"}</td>
            </tr>
        `;
    });
}

/* ==========================================================
   FILTRAR CATEGORIAS
========================================================== */

function filtrarCategorias() {
    const texto = document.getElementById("pesquisaCategoria")?.value?.toLowerCase() || "";
    tbodyCategorias.innerHTML = "";

    const filtrados = categorias.filter((categoria) => {
        const nome = (categoria.nome || "").toLowerCase();
        const descricao = (categoria.descricao || "").toLowerCase();
        return nome.includes(texto) || descricao.includes(texto);
    });

    if (!filtrados.length) {
        tbodyCategorias.innerHTML = '<tr><td colspan="3">Nenhuma categoria encontrada.</td></tr>';
        return;
    }

    filtrados.forEach((categoria) => {
        tbodyCategorias.innerHTML += `
            <tr>
                <td>${categoria.id ?? "-"}</td>
                <td>${categoria.nome ?? "-"}</td>
                <td>${categoria.descricao ?? "-"}</td>
            </tr>
        `;
    });
}

/* ==========================================================
   MODAL CADASTRO
========================================================== */

function abrirModalCadastro() {
    if (!usuarioLogado) return;

    document.getElementById("cadastroNome").value = usuarioLogado.nome || "";
    document.getElementById("cadastroEmail").value = usuarioLogado.email || "";
    document.getElementById("cadastroTelefone").value = usuarioLogado.telefone || "";
    document.getElementById("modalCadastro").style.display = "flex";
}

function fecharModalCadastro() {
    document.getElementById("modalCadastro").style.display = "none";
}

/* ==========================================================
   ATUALIZAR CADASTRO
========================================================== */

async function salvarCadastro() {
    const body = {
        nome: document.getElementById("cadastroNome").value.trim(),
        email: document.getElementById("cadastroEmail").value.trim(),
        telefone: document.getElementById("cadastroTelefone").value.trim()
    };

    if (!body.nome || !body.email) {
        mostrarToast("Preencha os campos obrigatórios.", false);
        return;
    }

    try {
        await apiRequest(`${API_BASE}/usuarios/atualizarCadastro`, "PUT", body);
        mostrarToast("Cadastro atualizado com sucesso. Faça login novamente.");
        fecharModalCadastro();
        localStorage.clear();
        setTimeout(() => {
            window.location.href = "../PaginaInicial/login.html";
        }, 1300);
    } catch (erro) {
        console.error(erro);
    }
}

/* ==========================================================
   MODAL SENHA
========================================================== */

function abrirModalSenha() {
    document.getElementById("senhaAtual").value = "";
    document.getElementById("novaSenha").value = "";
    document.getElementById("modalSenha").style.display = "flex";
}

function fecharModalSenha() {
    document.getElementById("modalSenha").style.display = "none";
}

/* ==========================================================
   ALTERAR SENHA
========================================================== */

async function alterarSenha() {
    const body = {
        senhaAtual: document.getElementById("senhaAtual").value,
        novaSenha: document.getElementById("novaSenha").value
    };

    if (!body.senhaAtual || !body.novaSenha) {
        mostrarToast("Preencha todos os campos.", false);
        return;
    }

    try {
        await apiRequest(`${API_BASE}/usuarios/alterarSenhaCadastro/senha`, "PUT", body);
        mostrarToast("Senha alterada com sucesso. Faça login novamente.");
        fecharModalSenha();
        localStorage.clear();
        setTimeout(() => {
            window.location.href = "../PaginaInicial/login.html";
        }, 1300);
    } catch (erro) {
        console.error(erro);
    }
}

/* ==========================================================
   MODAL EMPRÉSTIMO
========================================================== */

function abrirModalEmprestimo(idLivro, tituloLivro) {
    livroSelecionado = idLivro;

    document.getElementById("textoEmprestimo").innerText =
        tituloLivro
            ? `Deseja realmente emprestar o livro "${tituloLivro}"?`
            : "Deseja realmente realizar este empréstimo?";

    document.getElementById("btnConfirmarEmprestimo").onclick = () => confirmarEmprestimo(idLivro);
    document.getElementById("modalEmprestimo").style.display = "flex";
}

function fecharModalEmprestimo() {
    livroSelecionado = null;
    document.getElementById("modalEmprestimo").style.display = "none";
}

/* ==========================================================
   REALIZAR EMPRÉSTIMO
========================================================== */

async function confirmarEmprestimo(idLivro) {
    const livroId = idLivro ?? livroSelecionado;

    if (!livroId) {
        mostrarToast("Nenhum livro selecionado.", false);
        return;
    }

    try {
        await apiRequest(`${API_BASE}/emprestimos`, "POST", { livroId: Number(livroId) });
        mostrarToast("Empréstimo realizado com sucesso.");
        fecharModalEmprestimo();
        await carregarLivros();
        await carregarEmprestimos();
        atualizarDashboard();
    } catch (erro) {
        console.error(erro);
    }
}