const API_URL_TURMA = "https://school-system-spi.onrender.com/api/turmas";
const API_URL_PROFESSOR = "https://school-system-spi.onrender.com/api/professores";

function toggleMenuBar() {
  document.querySelector('.menu').classList.toggle('shrink');
}


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
    if (!res.ok) throw new Error();
    alert("Turma cadastrada com sucesso!");
    form.reset();
  } catch (err) {
    alert("Erro ao cadastrar turma.");
    console.error(err);
  }
});


document.getElementById("listar-turmas").onclick = listarTurmas;

async function listarTurmas() {
  try {
    const [resTurmas, resProfs] = await Promise.all([
      fetch(API_URL_TURMA),
      fetch(API_URL_PROFESSOR)
    ]);
    const turmas = await resTurmas.json();
    const professores = await resProfs.json();

    const profMap = {};
    professores.forEach(p => { profMap[p.id] = p.nome; });

    const container = document.getElementById("turmas-lista");
    container.innerHTML = "<h2>Lista de Turmas</h2>";
    turmas.forEach((t) => {
      const nomeProf = profMap[t.professor_id] || "Desconhecido";
      container.innerHTML += `
        <div class="card-turma">
          <div class="turma-materia">${t.materia}</div>
          <div class="turma-descricao">${t.descricao ?? ""}</div>
          <div class="turma-prof">Professor: ${nomeProf}</div>
          <div class="turma-ativo">Ativo: ${t.ativo ? "Sim" : "Não"}</div>
          <button onclick="editarTurma(${t.id})">Editar</button>
          <button onclick="excluirTurma(${t.id})">Excluir</button>
        </div>
      `;
    });
  } catch {
    alert("Erro ao carregar lista de turmas.");
  }
}


window.editarTurma = async function (id) {
  try {
    const res = await fetch(`${API_URL_TURMA}/${id}`);
    if (!res.ok) throw new Error();
    const turma = await res.json();
    document.getElementById("turma-id").value = turma.id;
    document.getElementById("update-materia").value = turma.materia;
    document.getElementById("update-descricao").value = turma.descricao;
    document.getElementById("update-ativo").value = turma.ativo ? "true" : "false";
    document.getElementById("update-professor_id").value = turma.professor_id;
    document.getElementById("edit-popup-turma").style.display = "block";
  } catch (err) {
    alert("Erro ao carregar dados da turma.");
    console.error(err);
  }
};


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
    if (!res.ok) throw new Error();
    alert("Turma atualizada com sucesso!");
    form.reset();
    document.getElementById("edit-popup-turma").style.display = "none";
    listarTurmas();
  } catch (err) {
    alert("Erro ao atualizar turma.");
    console.error(err);
  }
});


window.excluirTurma = async function (id) {
  if (!confirm("Tem certeza que deseja excluir esta turma?")) return;
  try {
    const res = await fetch(`${API_URL_TURMA}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    alert("Turma excluída com sucesso!");
    listarTurmas();
  } catch (err) {
    alert("Erro ao excluir turma.");
    console.error(err);
  }
};


document.getElementById("close-popup-turma").onclick = () => {
  document.getElementById("edit-popup-turma").style.display = "none";
};