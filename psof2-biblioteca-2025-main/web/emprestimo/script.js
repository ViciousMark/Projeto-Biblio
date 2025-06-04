url = "http://localhost:3001";

//Objetos tipo formulário do DOM
const detalhes = document.querySelector("#detalhes form");
const cadastro = document.querySelector("#cadastro form");

//Obter títulos da API
fetch(url)
    .then((res) => res.json())
    .then((dados) => {
        document.querySelector("title").innerHTML = dados.titulo;
        document.querySelector("header h1").innerHTML = dados.titulo;
    })

//Enviar dados de cadastro para a API
cadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = {
        alunoRa: cadastro.alunoRa.value,
        livroId: Number(cadastro.livroId.value)
    }
    fetch(url + "/emprestimos", {
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

//Obter lista de emprestimos da API
fetch(url + "/emprestimos")
    .then((res) => res.json())
    .then((dados) => {
        const corpo = document.querySelector("main tbody");
        dados.forEach((emp) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Id">${emp.id}</td>
                <td data-label="RA">${emp.alunoRa}</td>
                <td data-label="Telefone">${emp.livroId}</td>
                <td data-label="Data retirada">${new Date(emp.retirada).toLocaleDateString('pt-br')}</td>
                <td data-label="Hora retirada">${new Date(emp.retirada).toLocaleTimeString('pt-br')}</td>
                <td data-label="Data devolução">${emp.devolucao != null ? new Date(emp.devolucao).toLocaleDateString('pt-br') : "Emprestado"}</td>
                <td data-label="Hora devolução">${emp.devolucao != null ? new Date(emp.devolucao).toLocaleTimeString('pt-br') : "Emprestado"}</td>
                <td data-label="Multa">${emp.multa}</td>
                <td data-label="Detalhes">
                    <button onclick="showDetalhes('${emp.id}')">
                        Detalhes
                    </button>
                </td>
            `;
            corpo.appendChild(tr);
        });
    });

// Funções para controlar os modais
function abrirModalCadastro() {
    document.querySelector("#cadastro").classList.remove("oculto");
}

function fecharModalCadastro() {
    document.querySelector("#cadastro").classList.add("oculto");
}

function abrirModalDetalhes() {
    document.querySelector("#detalhes").classList.remove("oculto");
}

function fecharModalDetalhes() {
    document.querySelector("#detalhes").classList.add("oculto");
}

// Adicione eventos aos botões de fechar
document.querySelector("#cadastro button").addEventListener("click", fecharModalCadastro);
document.querySelector("#detalhes button").addEventListener("click", fecharModalDetalhes);

// Feche o modal clicando fora do conteúdo
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            if (modal.id === "cadastro") fecharModalCadastro();
            if (modal.id === "detalhes") fecharModalDetalhes();
        }
    });
});

//Preencher o formulário de detalhes com os dados do emprestimo
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
            abrirModalDetalhes(); // Esta linha abre o modal
        });
}

//Alterar os dados do emprestimo na API
detalhes.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = {
        alunoRa: detalhes.alunoRa.value,
        livroId: Number(detalhes.livroId.value),
        retirada: new Date(detalhes.retirada.value)
    }
    if (detalhes.devolucao.value != "") {
        dados.devolucao = new Date(detalhes.devolucao.value);
    }
    if (detalhes.multa.value != 0) {
        dados.multa = Number(detalhes.multa.value);
    }
    fetch(url + "/emprestimos/" + detalhes.id.value, {
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

//Deletar emprestimo da API
function excluir() {
    const id = detalhes.id.value;
    fetch(url + "/emprestimos/" + id, {
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