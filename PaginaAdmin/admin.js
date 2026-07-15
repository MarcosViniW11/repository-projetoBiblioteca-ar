/* ==========================================================
   CONFIGURAÇÕES GERAIS
========================================================== */

const API_BASE = "http://localhost:8080";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

/* ==========================================================
   VALIDAÇÕES DE ACESSO
========================================================== */

if (!token) {

    alert("Usuário não autenticado.");

    window.location.href = "../PaginaInicial/login.html";
}

if (role !== "ROLE_ADMIN") {

    alert("Acesso negado.");

    window.location.href = "../PaginaInicial/login.html";
}

/* ==========================================================
   HEADERS PADRÃO
========================================================== */

function getHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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

    toast.classList.remove("erro");
    toast.classList.remove("sucesso");

    if (sucesso) {
        toast.classList.add("sucesso");
    } else {
        toast.classList.add("erro");
    }

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3500);
}

function escapeHtml(valor) {

    if (valor === null || valor === undefined) return "-";

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatarData(valor) {

    if (!valor) return "-";

    return String(valor)
        .replace("T", " ")
        .slice(0, 16);
}

/* ==========================================================
   REQUEST PADRÃO
========================================================== */

async function apiRequest(url, method = "GET", body = null) {

    try {

        mostrarLoading();

        const config = {
            method: method,
            headers: getHeaders()
        };

        if (body !== null && body !== undefined) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);

        if (response.status === 401) {

            localStorage.clear();

            mostrarToast(
                "Sessão expirada. Faça login novamente.",
                false
            );

            setTimeout(() => {

                window.location.href =
                    "../PaginaInicial/login.html";

            }, 1500);

            throw new Error("Não autorizado");
        }

        if (response.status === 403) {

            mostrarToast(
                "Você não possui permissão.",
                false
            );

            throw new Error("Acesso negado");
        }

        if (!response.ok) {

            let mensagemErro = "Erro na operação.";

            try {

                const erroJson = await response.json();

                mensagemErro =
                    erroJson.message ||
                    erroJson.error ||
                    mensagemErro;

            } catch {

            }

            throw new Error(mensagemErro);
        }

        if (response.status === 204) {
            return null;
        }

        const texto = await response.text();

        if (!texto) {
            return null;
        }

        try {
            return JSON.parse(texto);
        } catch {
            return texto;
        }

    } catch (error) {

        if (error instanceof Error && error.message) {
            mostrarToast(error.message, false);
        }

        console.error(error);

        throw error;

    } finally {

        esconderLoading();
    }
}

/* ==========================================================
   NAVEGAÇÃO ENTRE PÁGINAS
========================================================== */

function mostrarSecao(idSecao) {

    document
        .querySelectorAll(".page")
        .forEach(secao => {

            secao.classList.remove("active");

        });

    document
        .querySelectorAll(".menu-btn")
        .forEach(botao => {

            botao.classList.remove("active");

        });

    const secao = document.getElementById(idSecao);

    if (secao) {
        secao.classList.add("active");
    }

    const botoes =
        document.querySelectorAll(".menu-btn");

    botoes.forEach(botao => {

        if (
            botao
                .getAttribute("onclick")
                ?.includes(idSecao)
        ) {

            botao.classList.add("active");
        }
    });
}

/* ==========================================================
   LOGOUT
========================================================== */

function logout() {

    const confirmar = confirm(
        "Deseja realmente sair?"
    );

    if (!confirmar) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    mostrarToast("Logout realizado.");

    setTimeout(() => {

        window.location.href =
            "../PaginaInicial/login.html";

    }, 1000);
}

/* ==========================================================
   ELEMENTOS GLOBAIS
========================================================== */

const tbodyLivros =
    document.getElementById("tbodyLivros");

const tbodyAutores =
    document.getElementById("tbodyAutores");

const tbodyCategorias =
    document.getElementById("tbodyCategorias");

const tbodyUsuarios =
    document.getElementById("tbodyUsuarios");

const tbodyEmprestimos =
    document.getElementById("tbodyEmprestimos");

/* ==========================================================
   DASHBOARD CARDS
========================================================== */

const totalLivros =
    document.getElementById("totalLivros");

const totalAutores =
    document.getElementById("totalAutores");

const totalCategorias =
    document.getElementById("totalCategorias");

const totalUsuarios =
    document.getElementById("totalUsuarios");

const totalEmprestimos =
    document.getElementById("totalEmprestimos");

/* ==========================================================
   ARRAYS GLOBAIS
========================================================== */

let livros = [];

let autores = [];

let categorias = [];

let usuarios = [];

let emprestimos = [];

/* ==========================================================
   EVENTOS INICIAIS
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const logoutBtn =
            document.getElementById("logoutBtn");

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logout
            );
        }

        const nomeAdmin =
            document.getElementById("adminNome");

        if (nomeAdmin) {
            nomeAdmin.innerText =
                localStorage.getItem("nome") || "Administrador";
        }

        mostrarSecao("dashboard");

        await carregarDadosIniciais();
    }
);

/* ==========================================================
   CARREGAMENTO INICIAL
========================================================== */

async function carregarDadosIniciais() {

    try {

        await Promise.all([
            carregarLivros(),
            carregarAutores(),
            carregarCategorias(),
            carregarUsuarios(),
            carregarEmprestimos()
        ]);

        atualizarDashboard();

    } catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   DASHBOARD
========================================================== */

function atualizarDashboard() {

    totalLivros.innerText = livros.length;

    totalAutores.innerText = autores.length;

    totalCategorias.innerText = categorias.length;

    totalUsuarios.innerText = usuarios.length;

    totalEmprestimos.innerText = emprestimos.length;

}

/* ==========================================================
   GET LIVROS
========================================================== */

async function carregarLivros() {

    const dados = await apiRequest(
        `${API_BASE}/livros`
    );

    livros = Array.isArray(dados) ? dados : [];

    preencherTabelaLivros();

}

/* ==========================================================
   GET AUTORES
========================================================== */

async function carregarAutores() {

    const dados = await apiRequest(
        `${API_BASE}/autores`
    );

    autores = Array.isArray(dados) ? dados : [];

    preencherTabelaAutores();

}

/* ==========================================================
   GET CATEGORIAS
========================================================== */

async function carregarCategorias() {

    const dados = await apiRequest(
        `${API_BASE}/categorias`
    );

    categorias = Array.isArray(dados) ? dados : [];

    preencherTabelaCategorias();

}

/* ==========================================================
   GET USUÁRIOS
========================================================== */

async function carregarUsuarios() {

    const dados = await apiRequest(
        `${API_BASE}/usuarios`
    );

    usuarios = Array.isArray(dados) ? dados : [];

    preencherTabelaUsuarios();

}

/* ==========================================================
   GET EMPRÉSTIMOS
========================================================== */

async function carregarEmprestimos() {

    const dados = await apiRequest(
        `${API_BASE}/emprestimos`
    );

    emprestimos = Array.isArray(dados) ? dados : [];

    preencherTabelaEmprestimos();

}

/* ==========================================================
   TABELA LIVROS
========================================================== */

function preencherTabelaLivros() {

    tbodyLivros.innerHTML = "";

    livros.forEach(livro => {

        const disponivel = livro.quantidadeDisponivel ?? livro.quantidadeTotal ?? 0;

        tbodyLivros.innerHTML += `

            <tr>

                <td>${escapeHtml(livro.id)}</td>

                <td>${escapeHtml(livro.titulo)}</td>

                <td>${escapeHtml(livro.isbn)}</td>

                <td>${escapeHtml(livro.anoPublicacao)}</td>

                <td>${escapeHtml(livro.editora)}</td>

                <td>${escapeHtml(livro.quantidadeTotal)}</td>

                <td>${escapeHtml(disponivel)}</td>

                <td>${escapeHtml(livro.autor)}</td>

                <td>${escapeHtml(livro.categoria)}</td>

                <td>

                    <button onclick="editarLivro(${livro.id})">
                        Editar
                    </button>

                    <button onclick="confirmarExcluirLivro(${livro.id})">
                        Excluir
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

    tbodyAutores.innerHTML = "";

    autores.forEach(autor => {

        tbodyAutores.innerHTML += `

            <tr>

                <td>${escapeHtml(autor.id)}</td>

                <td>${escapeHtml(autor.nome)}</td>

                <td>${escapeHtml(autor.nacionalidade)}</td>

                <td>${escapeHtml(autor.biografia ?? "-")}</td>

                <td>

                    <button onclick="editarAutor(${autor.id})">

                        Editar

                    </button>

                    <button onclick="confirmarExcluirAutor(${autor.id})">

                        Excluir

                    </button>

                </td>

            </tr>

        `;

    });

}

/* ==========================================================
   TABELA CATEGORIAS
========================================================== */

function preencherTabelaCategorias() {

    tbodyCategorias.innerHTML = "";

    categorias.forEach(categoria => {

        tbodyCategorias.innerHTML += `

            <tr>

                <td>${escapeHtml(categoria.id)}</td>

                <td>${escapeHtml(categoria.nome)}</td>

                <td>${escapeHtml(categoria.descricao ?? "-")}</td>

                <td>

                    <button onclick="editarCategoria(${categoria.id})">

                        Editar

                    </button>

                    <button onclick="confirmarExcluirCategoria(${categoria.id})">

                        Excluir

                    </button>

                </td>

            </tr>

        `;

    });

}

/* ==========================================================
   TABELA USUÁRIOS
========================================================== */

function preencherTabelaUsuarios() {

    tbodyUsuarios.innerHTML = "";

    usuarios.forEach(usuario => {

        tbodyUsuarios.innerHTML += `

            <tr>

                <td>${escapeHtml(usuario.id)}</td>

                <td>${escapeHtml(usuario.nome)}</td>

                <td>${escapeHtml(usuario.email)}</td>

                <td>${escapeHtml(usuario.telefone ?? "-")}</td>

                <td>${escapeHtml(formatarData(usuario.dataCadastro))}</td>

                <td>${escapeHtml(usuario.ativo ? "Sim" : "Não")}</td>

                <td>${escapeHtml(usuario.role)}</td>

                <td>

                    <button onclick="editarUsuario(${usuario.id})">

                        Editar

                    </button>

                    <button onclick="abrirModalSenha(${usuario.id})">

                        Senha

                    </button>

                </td>

            </tr>

        `;

    });

}

/* ==========================================================
   TABELA EMPRÉSTIMOS
========================================================== */

function preencherTabelaEmprestimos() {

    tbodyEmprestimos.innerHTML = "";

    emprestimos.forEach(emprestimo => {

        tbodyEmprestimos.innerHTML += `

            <tr>

                <td>${escapeHtml(emprestimo.id)}</td>

                <td>${escapeHtml(emprestimo.usuario)}</td>

                <td>${escapeHtml(emprestimo.livro)}</td>

                <td>${escapeHtml(emprestimo.dataEmprestimo)}</td>

                <td>${escapeHtml(emprestimo.dataPrevistaDevolucao)}</td>

                <td>${escapeHtml(emprestimo.dataDevolucao ?? "-")}</td>

                <td>${escapeHtml(emprestimo.status)}</td>

                <td>

                    <button
                        onclick="devolverEmprestimo(${emprestimo.id})">

                        Devolver

                    </button>

                </td>

            </tr>

        `;

    });

}

function abrirModalLivro() {

    document.getElementById("tituloModalLivro").innerText =
        "Novo Livro";

    document.getElementById("livroId").value = "";

    document.getElementById("tituloLivro").value = "";
    document.getElementById("isbnLivro").value = "";
    document.getElementById("anoLivro").value = "";
    document.getElementById("editoraLivro").value = "";
    document.getElementById("quantidadeLivro").value = "";
    document.getElementById("descricaoLivro").value = "";

    carregarSelectAutores();
    carregarSelectCategorias();

    document.getElementById("modalLivro").style.display = "flex";
}

function fecharModalLivro() {

    document.getElementById("modalLivro").style.display = "none";

}

/* ==========================================================
   MODAL AUTOR
========================================================== */

function abrirModalAutor() {

    document.getElementById("tituloModalAutor").innerText =
        "Novo Autor";

    document.getElementById("autorId").value = "";

    document.getElementById("nomeAutor").value = "";
    document.getElementById("nacionalidadeAutor").value = "";
    document.getElementById("biografiaAutor").value = "";

    document.getElementById("modalAutor").style.display = "flex";
}

function fecharModalAutor() {

    document.getElementById("modalAutor").style.display = "none";

}

/* ==========================================================
   MODAL CATEGORIA
========================================================== */

function abrirModalCategoria() {

    document.getElementById("tituloModalCategoria").innerText =
        "Nova Categoria";

    document.getElementById("categoriaId").value = "";

    document.getElementById("nomeCategoria").value = "";
    document.getElementById("descricaoCategoria").value = "";

    document.getElementById("modalCategoria").style.display =
        "flex";
}

function fecharModalCategoria() {

    document.getElementById("modalCategoria").style.display =
        "none";

}

/* ==========================================================
   MODAL USUÁRIO
========================================================== */

function fecharModalUsuario() {

    document.getElementById("modalUsuario").style.display =
        "none";

}

/* ==========================================================
   MODAL SENHA
========================================================== */

function abrirModalSenha(id) {

    document.getElementById("usuarioSenhaId").value = id;

    document.getElementById("senhaAtual").value = "";
    document.getElementById("novaSenha").value = "";

    document.getElementById("modalSenha").style.display =
        "flex";
}

function fecharModalSenha() {

    document.getElementById("modalSenha").style.display =
        "none";

}

/* ==========================================================
   MODAL EXCLUSÃO
========================================================== */

function abrirModalExcluir(texto, callback) {

    document.getElementById("textoExcluir").innerText = texto;

    document.getElementById("btnConfirmarExcluir").onclick =
        callback;

    document.getElementById("modalExcluir").style.display =
        "flex";
}

function fecharModalExcluir() {

    document.getElementById("modalExcluir").style.display =
        "none";

}

/* ==========================================================
   SELECT AUTORES
========================================================== */

function carregarSelectAutores() {

    const select =
        document.getElementById("autorLivro");

    select.innerHTML = "";

    autores.forEach(autor => {

        select.innerHTML += `

            <option value="${autor.id}">
                ${autor.nome}
            </option>

        `;

    });

}

/* ==========================================================
   SELECT CATEGORIAS
========================================================== */

function carregarSelectCategorias() {

    const select =
        document.getElementById("categoriaLivro");

    select.innerHTML = "";

    categorias.forEach(categoria => {

        select.innerHTML += `

            <option value="${categoria.id}">
                ${categoria.nome}
            </option>

        `;

    });

}

async function salvarLivro() {

    const id =
        document.getElementById("livroId").value;

    const body = {

        titulo:
            document.getElementById("tituloLivro").value.trim(),

        isbn:
            document.getElementById("isbnLivro").value.trim(),

        anoPublicacao:
            Number(document.getElementById("anoLivro").value),

        editora:
            document.getElementById("editoraLivro").value.trim(),

        quantidadeTotal:
            Number(document.getElementById("quantidadeLivro").value),

        descricao:
            document.getElementById("descricaoLivro").value.trim(),

        autorId:
            Number(document.getElementById("autorLivro").value),

        categoriaId:
            Number(document.getElementById("categoriaLivro").value)

    };

    if (
        body.titulo === "" ||
        body.isbn === "" ||
        body.editora === ""
    ) {

        mostrarToast(
            "Preencha todos os campos obrigatórios.",
            false
        );

        return;
    }

    try {

        if (id === "") {

            await apiRequest(

                `${API_BASE}/admin/livros`,

                "POST",

                body

            );

            mostrarToast(
                "Livro cadastrado com sucesso."
            );

        } else {

            await apiRequest(

                `${API_BASE}/admin/livros/${id}`,

                "PUT",

                body

            );

            mostrarToast(
                "Livro atualizado com sucesso."
            );

        }

        fecharModalLivro();

        await carregarLivros();

        atualizarDashboard();

    } catch (erro) {

        console.error(erro);

    }

}

/* ==========================================================
   EDITAR LIVRO
========================================================== */

function editarLivro(id) {

    const livro =
        livros.find(l => l.id === id);

    if (!livro) return;

    document.getElementById("tituloModalLivro")
        .innerText = "Editar Livro";

    document.getElementById("livroId").value =
        livro.id;

    document.getElementById("tituloLivro").value =
        livro.titulo;

    document.getElementById("isbnLivro").value =
        livro.isbn;

    document.getElementById("anoLivro").value =
        livro.anoPublicacao;

    document.getElementById("editoraLivro").value =
        livro.editora;

    document.getElementById("quantidadeLivro").value =
        livro.quantidadeTotal;

    document.getElementById("descricaoLivro").value =
        livro.descricao;

    carregarSelectAutores();
    carregarSelectCategorias();

    const autorSelect = document.getElementById("autorLivro");
    const categoriaSelect = document.getElementById("categoriaLivro");

    const autorId =
        livro.autorId ||
        autores.find(a =>
            String(a.nome).toLowerCase() === String(livro.autor || "").toLowerCase()
        )?.id;

    const categoriaId =
        livro.categoriaId ||
        categorias.find(c =>
            String(c.nome).toLowerCase() === String(livro.categoria || "").toLowerCase()
        )?.id;

    if (autorSelect && autorId) {
        autorSelect.value = autorId;
    }

    if (categoriaSelect && categoriaId) {
        categoriaSelect.value = categoriaId;
    }

    document.getElementById("modalLivro")
        .style.display = "flex";

}

/* ==========================================================
   EXCLUIR LIVRO
========================================================== */

function confirmarExcluirLivro(id) {

    abrirModalExcluir(

        "Deseja realmente excluir este livro?",

        async () => {

            try {

                await apiRequest(

                    `${API_BASE}/admin/livros/${id}`,

                    "DELETE"

                );

                fecharModalExcluir();

                mostrarToast(
                    "Livro excluído com sucesso."
                );

                await carregarLivros();

                atualizarDashboard();

            } catch (erro) {

                console.error(erro);

            }

        }

    );

}

/* ==========================================================
   SALVAR AUTOR
========================================================== */

async function salvarAutor() {

    const id =
        document.getElementById("autorId").value;

    const body = {

        nome:
            document.getElementById("nomeAutor").value.trim(),

        nacionalidade:
            document.getElementById("nacionalidadeAutor").value.trim(),

        biografia:
            document.getElementById("biografiaAutor").value.trim()

    };

    if (body.nome === "") {

        mostrarToast(
            "Informe o nome do autor.",
            false
        );

        return;
    }

    try {

        if (id === "") {

            await apiRequest(

                `${API_BASE}/admin/autores`,

                "POST",

                body

            );

            mostrarToast(
                "Autor cadastrado com sucesso."
            );

        } else {

            await apiRequest(

                `${API_BASE}/admin/autores/${id}`,

                "PUT",

                body

            );

            mostrarToast(
                "Autor atualizado com sucesso."
            );

        }

        fecharModalAutor();

        await carregarAutores();

        carregarSelectAutores();

        atualizarDashboard();

    } catch (erro) {

        console.error(erro);

    }

}

/* ==========================================================
   EDITAR AUTOR
========================================================== */

function editarAutor(id) {

    const autor =
        autores.find(a => a.id === id);

    if (!autor) return;

    document.getElementById("tituloModalAutor")
        .innerText = "Editar Autor";

    document.getElementById("autorId").value =
        autor.id;

    document.getElementById("nomeAutor").value =
        autor.nome;

    document.getElementById("nacionalidadeAutor").value =
        autor.nacionalidade;

    document.getElementById("biografiaAutor").value =
        autor.biografia ?? "";

    document.getElementById("modalAutor")
        .style.display = "flex";

}

/* ==========================================================
   EXCLUIR AUTOR
========================================================== */

function confirmarExcluirAutor(id) {

    abrirModalExcluir(

        "Deseja realmente excluir este autor?",

        async () => {

            try {

                await apiRequest(

                    `${API_BASE}/admin/autores/${id}`,

                    "DELETE"

                );

                fecharModalExcluir();

                mostrarToast(
                    "Autor excluído com sucesso."
                );

                await carregarAutores();

                carregarSelectAutores();

                atualizarDashboard();

            } catch (erro) {

                console.error(erro);

            }

        }

    );

}

/* ==========================================================
   SALVAR CATEGORIA
========================================================== */

async function salvarCategoria() {

    const id =
        document.getElementById("categoriaId").value;

    const body = {

        nome:
            document.getElementById("nomeCategoria").value.trim(),

        descricao:
            document.getElementById("descricaoCategoria").value.trim()

    };

    if (body.nome === "") {

        mostrarToast(
            "Informe o nome da categoria.",
            false
        );

        return;

    }

    try {

        if (id === "") {

            await apiRequest(

                `${API_BASE}/admin/categorias`,

                "POST",

                body

            );

            mostrarToast(
                "Categoria cadastrada com sucesso."
            );

        } else {

            await apiRequest(

                `${API_BASE}/admin/categorias/${id}`,

                "PUT",

                body

            );

            mostrarToast(
                "Categoria atualizada com sucesso."
            );

        }

        fecharModalCategoria();

        await carregarCategorias();

        atualizarDashboard();

    } catch (erro) {

        console.error(erro);

    }

}

/* ==========================================================
   EDITAR CATEGORIA
========================================================== */

function editarCategoria(id) {

    const categoria =
        categorias.find(c => c.id === id);

    if (!categoria) return;

    document.getElementById("tituloModalCategoria")
        .innerText = "Editar Categoria";

    document.getElementById("categoriaId").value =
        categoria.id;

    document.getElementById("nomeCategoria").value =
        categoria.nome;

    document.getElementById("descricaoCategoria").value =
        categoria.descricao;

    document.getElementById("modalCategoria")
        .style.display = "flex";

}

/* ==========================================================
   EXCLUIR CATEGORIA
========================================================== */

function confirmarExcluirCategoria(id) {

    abrirModalExcluir(

        "Deseja realmente excluir esta categoria?",

        async () => {

            try {

                await apiRequest(

                    `${API_BASE}/admin/categorias/${id}`,

                    "DELETE"

                );

                fecharModalExcluir();

                mostrarToast(
                    "Categoria excluída com sucesso."
                );

                await carregarCategorias();

                atualizarDashboard();

            } catch (erro) {

                console.error(erro);

            }

        }

    );

}

/* ==========================================================
   ABRIR MODAL USUÁRIO
========================================================== */

function abrirModalUsuario() {

    document.getElementById("tituloModalUsuario").innerText =
        "Editar Usuário";

    document.getElementById("usuarioId").value = "";

    document.getElementById("nomeUsuario").value = "";

    document.getElementById("emailUsuario").value = "";

    document.getElementById("telefoneUsuario").value = "";

    document.getElementById("modalUsuario").style.display =
        "flex";

}

/* ==========================================================
   SALVAR USUÁRIO
========================================================== */

async function salvarUsuario() {

    const id =
        document.getElementById("usuarioId").value;

    if (!id) {

        mostrarToast(
            "Selecione um usuário para editar.",
            false
        );

        return;
    }

    const body = {

        nome:
            document.getElementById("nomeUsuario").value.trim(),

        email:
            document.getElementById("emailUsuario").value.trim(),

        telefone:
            document.getElementById("telefoneUsuario").value.trim()

    };

    if (
        body.nome === "" ||
        body.email === ""
    ) {

        mostrarToast(
            "Preencha os campos obrigatórios.",
            false
        );

        return;

    }

    try {

        await apiRequest(

            `${API_BASE}/admin/usuarios/${id}`,

            "PUT",

            body

        );

        mostrarToast(
            "Usuário atualizado com sucesso."
        );

        fecharModalUsuario();

        await carregarUsuarios();

        atualizarDashboard();

    }

    catch (erro) {

        console.error(erro);

    }

}

/* ==========================================================
   EDITAR USUÁRIO
========================================================== */

function editarUsuario(id) {

    const usuario =
        usuarios.find(u => u.id === id);

    if (!usuario) return;

    document.getElementById("tituloModalUsuario").innerText =
        "Editar Usuário";

    document.getElementById("usuarioId").value =
        usuario.id;

    document.getElementById("nomeUsuario").value =
        usuario.nome;

    document.getElementById("emailUsuario").value =
        usuario.email;

    document.getElementById("telefoneUsuario").value =
        usuario.telefone ?? "";

    document.getElementById("modalUsuario").style.display =
        "flex";

}

/* ==========================================================
   ALTERAR SENHA
========================================================== */

async function alterarSenha() {

    const id = document.getElementById("usuarioSenhaId").value;

    const body = {
        senhaAtual: document.getElementById("senhaAtual").value,
        novaSenha: document.getElementById("novaSenha").value
    };

    if (!body.senhaAtual || !body.novaSenha) {
        mostrarToast("Informe a senha atual e a nova senha.", false);
        return;
    }

    try {

        await apiRequest(
            `${API_BASE}/admin/usuarios/${id}/senha`,
            "PUT",
            body
        );

        mostrarToast("Senha alterada com sucesso.");
        fecharModalSenha();
        await carregarUsuarios();

    } catch (erro) {
        console.error(erro);
    }

}

/* ==========================================================
   DEVOLVER EMPRÉSTIMO
========================================================== */

async function devolverEmprestimo(id) {

    try {

        await apiRequest(
            `${API_BASE}/admin/emprestimos/${id}/devolver`,
            "PUT"
        );

        mostrarToast("Empréstimo devolvido com sucesso.");
        await carregarEmprestimos();
        atualizarDashboard();

    } catch (erro) {
        console.error(erro);
    }

}

/* ==========================================================
   ATUALIZAR EMPRÉSTIMOS ATRASADOS
========================================================== */

async function atualizarEmprestimosAtrasados() {

    try {

        await apiRequest(
            `${API_BASE}/admin/emprestimos/atualizar-atrasados`,
            "POST"
        );

        mostrarToast("Empréstimos atualizados com sucesso.");
        await carregarEmprestimos();
        atualizarDashboard();

    } catch (erro) {
        console.error(erro);
    }

}

