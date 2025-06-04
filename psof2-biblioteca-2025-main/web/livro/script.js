const url = "http://localhost:3001";

// Objetos tipo formulário do DOM
const cadastro = document.querySelector("#cadastro form");
const detalhes = document.querySelector("#detalhes form");
const emprestimos = document.querySelector("#detalhes tbody");
const livrosBody = document.querySelector("#livros-body");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");

// Obter títulos da API
fetch(url)
    .then((res) => res.json())
    .then((dados) => {
        document.querySelector("title").innerHTML = dados.titulo;
        document.querySelector("header h1").innerHTML = dados.titulo;
    });

// Enviar dados de cadastro para a API
cadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = {
        titulo: cadastro.titulo.value,
        autor: cadastro.autor.value,
        prateleira: cadastro.prateleira.value,
    };
    fetch(url + "/livros", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then((res) => res.status)
    .then((status) => {
        if (status == 201) {
            window.location.reload();
        } else {
            alert("Erro ao enviar dados para a API!");
        }
    });
});

// Obter lista de livros da API e exibir em tabela
function carregarLivros(filtro = "") {
    fetch(url + "/livros")
        .then((res) => res.json())
        .then((dados) => {
            livrosBody.innerHTML = "";
            dados.forEach((livro) => {
                if (filtro === "" || 
                    livro.titulo.toLowerCase().includes(filtro.toLowerCase()) || 
                    livro.autor.toLowerCase().includes(filtro.toLowerCase())) {
                    
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${livro.id}</td>
                        <td>${livro.titulo}</td>
                        <td>${livro.autor}</td>
                        <td>${livro.prateleira}</td>
                        <td>
                            <button class="btn-detalhes" onclick="showDetalhes(${livro.id})">
                                Detalhes
                            </button>
                        </td>
                    `;
                    livrosBody.appendChild(tr);
                }
            });
        });
}

// Carregar livros ao iniciar
carregarLivros();

// Função de busca
searchButton.addEventListener("click", () => {
    carregarLivros(searchInput.value);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        carregarLivros(searchInput.value);
    }
});

// Preencher o formulário de detalhes com os dados do livro
function showDetalhes(id) {
    fetch(url + '/livros/' + id)
        .then((res) => res.json())
        .then((dados) => {
            detalhes.id.value = dados[0].id;
            detalhes.titulo.value = dados[0].titulo;
            detalhes.autor.value = dados[0].autor;
            detalhes.prateleira.value = dados[0].prateleira;
            emprestimos.innerHTML = "";
            dados[0].emprestimos.forEach((emp) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td data-label="ID">${emp.id}</td>
                    <td data-label="RA">${emp.aluno.ra}</td>
                    <td data-label="Aluno">${emp.aluno.nome}</td>
                    <td data-label="Telefone">${emp.aluno.telefone}</td>
                    <td data-label="Retirada">${new Date(emp.retirada).toLocaleDateString('pt-br')}</td>
                    <td data-label="Devolução">${emp.devolucao != null ? new Date(emp.devolucao).toLocaleDateString('pt-br') : "Emprestado"}</td>
                `;
                emprestimos.appendChild(tr);
            });
            document.querySelector("#detalhes").classList.remove("oculto");
        });
}

// Alterar os dados do livro na API
detalhes.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = {
        titulo: detalhes.titulo.value,
        autor: detalhes.autor.value,
        prateleira: detalhes.prateleira.value,
    };
    fetch(url + "/livros/" + detalhes.id.value, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then((res) => res.status)
    .then((status) => {
        if (status == 202) {
            window.location.reload();
        } else {
            alert("Erro ao enviar dados para a API!");
        }
    });
});

// Deletar livro da API
function excluir() {
    const id = detalhes.id.value;
    if (confirm("Tem certeza que deseja excluir este livro?")) {
        fetch(url + "/livros/" + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.status)
        .then((status) => {
            if (status == 204) {
                window.location.reload();
            } else {
                alert("Erro ao enviar dados para a API!");
            }
        });
    }
}