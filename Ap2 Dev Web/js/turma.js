const API_URL_TURMA = "https://school-system-spi.onrender.com/api/turmas";

// Cadastrar Turma
document.getElementById("turma-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    materia: form.materia.value.trim(),
    descricao: form.descricao.value.trim(),
    ativo: form.ativo.value === "true",
    professor_id: parseInt(form.professor_id.value),
  };

  try {
    const res = await fetch(API_URL_TURMA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao cadastrar turma.");

    alert("Turma cadastrada com sucesso!");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar turma.");
  }
});

// Listar Turmas
document.getElementById("listar-turmas").addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL_TURMA);
    const turmas = await res.json();

    const container = document.getElementById("turmas-lista");
    container.innerHTML = "<h2>Lista de Turmas</h2>";

    turmas.forEach((t) => {
      container.innerHTML += `
        <div class="card-turma">
          <div class="turma-materia">${t.materia}
            <span class="turma-id">ID: ${t.id}</span>
          </div>
          ${t.descricao && t.descricao !== "null" ? `<div class="turma-descricao">Descrição: ${t.descricao}</div>` : ""}
          <div class="turma-ativo">Ativo: ${t.ativo ? "Sim" : "Não"}</div>
          ${t.professor_id != null && t.professor_id !== 0 ? `<div class="turma-prof">Professor ID: ${t.professor_id}</div>` : ""}
          <button onclick="editarTurma(${t.id})">Editar</button>
          <button onclick="excluirTurma(${t.id})">Excluir</button>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar lista de turmas.");
  }
});

// Editar Turma
window.editarTurma = async function (id) {
  try {
    const res = await fetch(`${API_URL_TURMA}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar turma.");

    const turma = await res.json();

    document.getElementById("turma-id").value = turma.id;
    document.getElementById("update-materia").value = turma.materia;
    document.getElementById("update-descricao").value = turma.descricao;
    document.getElementById("update-ativo").value = turma.ativo ? "true" : "false";
    document.getElementById("update-professor_id").value = turma.professor_id;

    document.getElementById("edit-popup-turma").style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados da turma.");
  }
};

// Atualizar Turma
document.getElementById("update-form-turma").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const turmaId = document.getElementById("turma-id").value;

  const data = {
    materia: form["update-materia"].value.trim(),
    descricao: form["update-descricao"].value.trim(),
    ativo: form["update-ativo"].value === "true",
    professor_id: parseInt(form["update-professor_id"].value),
  };

  if (isNaN(data.professor_id)) {
    alert("Preencha corretamente o ID do professor.");
    return;
  }

  try {
    const res = await fetch(`${API_URL_TURMA}/${turmaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao atualizar turma.");

    alert("Turma atualizada com sucesso!");
    form.reset();
    document.getElementById("edit-popup-turma").style.display = "none";
    document.getElementById("listar-turmas").click();
  } catch (err) {
    console.error(err);
    alert("Erro ao atualizar turma.");
  }
});

// Excluir Turma
window.excluirTurma = async function (id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta turma?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL_TURMA}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao excluir turma.");

    alert("Turma excluída com sucesso!");
    document.getElementById("listar-turmas").click();
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir turma.");
  }
};

// Fechar popup
document.getElementById("close-popup-turma").addEventListener("click", () => {
  document.getElementById("edit-popup-turma").style.display = "none";
});