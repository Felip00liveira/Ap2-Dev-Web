const API_URL = "https://school-system-spi.onrender.com/api/alunos";

// Menu lateral responsivo
function toggleMenuBar() {
  document.querySelector('.menu').classList.toggle('shrink');
}

// Cadastrar Aluno
document.getElementById("aluno-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o envio padrão do formulário
  const form = e.target;
  // Monta objeto com dados do formulário
  const data = {
    nome: form.nome.value.trim(),
    data_nascimento: form.data_nascimento.value,
    nota_primeiro_semestre: parseFloat(form.nota_primeiro_semestre.value),
    nota_segundo_semestre: parseFloat(form.nota_segundo_semestre.value),
    turma_id: parseInt(form.turma_id.value),
  };

  // Validação: impede cadastro de alunos com mais de 100 anos
  if (data.data_nascimento) {
    const nascimento = new Date(data.data_nascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    if (idade > 100) {
      alert("O aluno não pode ter mais de 100 anos.");
      return;
    }
  }

  try {
    // Envia os dados para a API para cadastrar o aluno
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar aluno.");
    alert("Aluno cadastrado com sucesso!");
    form.reset(); // Limpa o formulário
  } catch (err) {
    alert("Erro ao cadastrar aluno.");
    console.error(err);
  }
});

// Listar Alunos
document.getElementById("listar-alunos").addEventListener("click", async () => {
  try {
    // Busca lista de alunos na API
    const res = await fetch(API_URL);
    const alunos = await res.json();
    const container = document.getElementById("alunos-lista");
    container.innerHTML = "<h2>Lista de Alunos</h2>";
    // Para cada aluno, cria um card com os dados e botões de ação
    alunos.forEach((a) => {
      container.innerHTML += `
        <div class="card-aluno">
          <div class="aluno-nome">${a.nome}</div>
          <div class="aluno-idade">Idade: ${a.idade}</div>
          <div class="aluno-media">Média: ${a.media_final ?? ""}</div>
          ${a.data_nascimento && a.data_nascimento !== "null" ? `<div class="aluno-nascimento">Nascimento: ${a.data_nascimento}</div>` : ""}
          ${a.turma_id != null && a.turma_id !== 0 ? `<div class="aluno-turma">Turma: ${a.turma_id}</div>` : ""}
          <button onclick="editarAluno(${a.id})">Editar</button>
          <button onclick="excluirAluno(${a.id})">Excluir</button>
        </div>
      `;
    });
  } catch (err) {
    alert("Erro ao carregar lista de alunos.");
    console.error(err);
  }
});

// Editar Aluno
window.editarAluno = async function (id) {
  try {
    // Busca dados do aluno pelo ID
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar aluno.");
    const aluno = await res.json();
    // Preenche o formulário de edição com os dados do aluno
    document.getElementById("aluno-id").value = aluno.id;
    document.getElementById("update-nome").value = aluno.nome;
    document.getElementById("update-data_nascimento").value = aluno.data_nascimento;
    document.getElementById("update-nota_primeiro_semestre").value = aluno.nota_primeiro_semestre;
    document.getElementById("update-nota_segundo_semestre").value = aluno.nota_segundo_semestre;
    document.getElementById("update-turma_id").value = aluno.turma_id;
    document.getElementById("edit-popup").style.display = "block"; // Mostra o popup de edição
  } catch (err) {
    alert("Erro ao carregar dados do aluno.");
    console.error(err);
  }
};

// Atualizar Aluno
document.getElementById("update-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede envio padrão do formulário
  const form = e.target;
  const alunoId = document.getElementById("aluno-id").value;
  // Monta objeto com dados atualizados
  const data = {
    nome: form["update-nome"].value.trim(),
    data_nascimento: form["update-data_nascimento"].value,
    nota_primeiro_semestre: parseFloat(form["update-nota_primeiro_semestre"].value),
    nota_segundo_semestre: parseFloat(form["update-nota_segundo_semestre"].value),
    turma_id: parseInt(form["update-turma_id"].value),
  };

  // Validação: impede atualização de alunos com mais de 100 anos
  if (data.data_nascimento) {
    const nascimento = new Date(data.data_nascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    if (idade > 100) {
      alert("O aluno não pode ter mais de 100 anos.");
      return;
    }
  }

  // Validação: notas e turma_id devem ser válidos
  if (
    isNaN(data.nota_primeiro_semestre) ||
    isNaN(data.nota_segundo_semestre) ||
    isNaN(data.turma_id)
  ) {
    alert("Preencha corretamente as notas e o ID da turma.");
    return;
  }

  try {
    // Envia os dados atualizados para a API
    const res = await fetch(`${API_URL}/${alunoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao atualizar aluno.");
    alert("Aluno atualizado com sucesso!");
    form.reset(); // Limpa o formulário de edição
    document.getElementById("edit-popup").style.display = "none"; // Fecha o popup
    document.getElementById("listar-alunos").click(); // Atualiza a lista de alunos
  } catch (err) {
    alert("Erro ao atualizar aluno.");
    console.error(err);
  }
});

// Excluir Aluno
window.excluirAluno = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este aluno?")) return; // Confirmação do usuário
  try {
    // Envia requisição para deletar o aluno
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir aluno.");
    alert("Aluno excluído com sucesso!");
    document.getElementById("listar-alunos").click(); // Atualiza a lista de alunos
  } catch (err) {
    alert("Erro ao excluir aluno.");
    console.error(err);
  }
};

// Fechar popup de edição
document.getElementById("close-popup").onclick = () => {
  document.getElementById("edit-popup").style.display = "none";
};