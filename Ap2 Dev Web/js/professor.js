const API_URL_PROFESSOR = "https://school-system-spi.onrender.com/api/professores";

// Função utilitária para mostrar erros
function mostrarErro(msg, err) {
  console.error(err);
  alert(msg);
}

// Cadastrar Professor
document.getElementById("professor-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede envio padrão do formulário
  const form = e.target;
  const idade = parseInt(form.idade.value);

  // Validação de idade mínima
  if (isNaN(idade) || idade < 18) return alert("A idade do professor deve ser maior ou igual a 18 anos.");

  // Monta objeto com dados do formulário
  const data = {
    nome: form.nome.value,
    materia: form.materia.value,
    observacoes: form.observacao.value,
    idade,
  };

  try {
    // Envia os dados para a API para cadastrar o professor
    const res = await fetch(API_URL_PROFESSOR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    alert("Professor cadastrado com sucesso!");
    form.reset(); // Limpa o formulário
  } catch (err) {
    mostrarErro("Erro ao cadastrar professor.", err);
  }
});

// Listar Professores
document.getElementById("listar-professores").onclick = listarProfessores;

async function listarProfessores() {
  try {
    // Busca lista de professores na API
    const res = await fetch(API_URL_PROFESSOR);
    const professores = await res.json();
    const container = document.getElementById("professores-lista");
    container.innerHTML = "<h2>Lista de Professores</h2>";

    // Para cada professor, cria um card com os dados e botões de ação
    professores.forEach((p) => {
      container.innerHTML += `
        <div class="card-professor">
          <div class="prof-nome">${p.nome}</div>
          <div class="prof-materia">Matéria: ${p.materia ?? ""}</div>
          ${p.observacoes && p.observacoes !== "null" ? `<div class="prof-observacao">Observação: ${p.observacoes}</div>` : ""}
          <div class="prof-idade">Idade: ${p.idade}</div>
          <button onclick="editarProfessor(${p.id})">Editar</button>
          <button onclick="excluirProfessor(${p.id})">Excluir</button>
        </div>
      `;
    });
  } catch (err) {
    mostrarErro("Erro ao listar professores.", err);
  }
}

// Editar Professor (global)
window.editarProfessor = async function (id) {
  try {
    // Busca dados do professor pelo ID
    const res = await fetch(`${API_URL_PROFESSOR}/${id}`);
    if (!res.ok) throw new Error();
    const p = await res.json();

    // Preenche o formulário de edição com os dados do professor
    document.getElementById("professor-id").value = p.id;
    document.getElementById("update-nome").value = p.nome;
    document.getElementById("update-materia").value = p.materia;
    document.getElementById("update-observacao").value = p.observacoes;
    document.getElementById("update-idade").value = p.idade;
    document.getElementById("edit-popup").style.display = "block"; // Mostra o popup de edição
  } catch (err) {
    mostrarErro("Erro ao carregar dados do professor.", err);
  }
};

// Atualizar Professor
document.getElementById("update-form").onsubmit = async (e) => {
  e.preventDefault(); // Impede envio padrão do formulário
  const form = e.target;
  const id = document.getElementById("professor-id").value;
  const idade = parseInt(form["update-idade"].value);

  // Validação de idade mínima
  if (isNaN(idade) || idade < 18) return alert("A idade do professor deve ser maior ou igual a 18 anos.");

  // Monta objeto com dados atualizados
  const data = {
    nome: form["update-nome"].value.trim(),
    materia: form["update-materia"].value.trim(),
    observacoes: form["update-observacao"].value.trim(),
    idade,
  };

  try {
    // Envia os dados atualizados para a API
    const res = await fetch(`${API_URL_PROFESSOR}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    alert("Professor atualizado com sucesso!");
    form.reset(); // Limpa o formulário de edição
    document.getElementById("edit-popup").style.display = "none"; // Fecha o popup
    listarProfessores(); // Atualiza a lista de professores
  } catch (err) {
    mostrarErro("Erro ao atualizar professor.", err);
  }
};

// Excluir Professor (global)
window.excluirProfessor = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este professor?")) return; // Confirmação do usuário
  try {
    // Envia requisição para deletar o professor
    const res = await fetch(`${API_URL_PROFESSOR}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    alert("Professor excluído com sucesso!");
    listarProfessores(); // Atualiza a lista de professores
  } catch (err) {
    mostrarErro("Erro ao excluir professor.", err);
  }
}

// Fechar popup de edição
document.getElementById("close-popup").onclick = () => {
  document.getElementById("edit-popup").style.display = "none";
};

// Botão de turmas disponíveis
document.getElementById("btn-turmas").onclick = async function () {
  try {
    // Busca lista de turmas na API
    const res = await fetch("https://school-system-spi.onrender.com/api/turmas");
    if (!res.ok) throw new Error();
    const turmas = await res.json();
    const lista = document.getElementById("lista-turmas-prof");
    // Monta HTML com as turmas disponíveis
    lista.innerHTML = turmas.length
      ? turmas.map(t => `
        <div style="border-bottom:1px solid #eee;padding:8px 0;">
          <strong>${t.materia}</strong> (ID: ${t.id})<br>
          ${t.descricao ? `Descrição: ${t.descricao}<br>` : ""}
          Ativo: ${t.ativo ? "Sim" : "Não"}<br>
          Professor ID: ${t.professor_id ?? "-"}
        </div>
      `).join("")
      : "<p>Nenhuma turma cadastrada.</p>";
    document.getElementById("popup-turmas").style.display = "block"; // Mostra o popup de turmas
  } catch (err) {
    mostrarErro("Erro ao buscar turmas.", err);
  }
};

// Fechar popup de turmas
document.getElementById("fechar-popup-turmas").onclick = () => {
  document.getElementById("popup-turmas").style.display = "none";
};