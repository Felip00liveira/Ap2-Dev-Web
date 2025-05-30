const API_URL_PROFESSOR = "https://school-system-spi.onrender.com/api/professores";

function mostrarErro(msg, err) {
  console.error(err);
  alert(msg);
}
function toggleMenuBar() {
  document.querySelector('.menu').classList.toggle('shrink');
}

// Cadastrar Professor
document.getElementById("professor-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const idade = parseInt(form.idade.value);

  if (isNaN(idade) || idade < 18) return alert("A idade do professor deve ser maior ou igual a 18 anos.");

  const data = {
    nome: form.nome.value,
    materia: form.materia.value,
    observacoes: form.observacao.value,
    idade,
  };

  try {
    const res = await fetch(API_URL_PROFESSOR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    alert("Professor cadastrado com sucesso!");
    form.reset();
  } catch (err) {
    mostrarErro("Erro ao cadastrar professor.", err);
  }
});

// Listar Professores
document.getElementById("listar-professores").onclick = listarProfessores;

async function listarProfessores() {
  try {
    const res = await fetch(API_URL_PROFESSOR);
    const professores = await res.json();
    const c = document.getElementById("professores-lista");
    c.innerHTML = "<h2>Lista de Professores</h2>";
    professores.forEach(p => {
      c.innerHTML += `
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
    const res = await fetch(`${API_URL_PROFESSOR}/${id}`);
    if (!res.ok) throw new Error();
    const p = await res.json();

    document.getElementById("professor-id").value = p.id;
    document.getElementById("update-nome").value = p.nome;
    document.getElementById("update-materia").value = p.materia;
    document.getElementById("update-observacao").value = p.observacoes;
    document.getElementById("update-idade").value = p.idade;
    document.getElementById("edit-popup").style.display = "block";
  } catch (err) {
    mostrarErro("Erro ao carregar dados do professor.", err);
  }
};

// Atualizar Professor
document.getElementById("update-form").onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const id = document.getElementById("professor-id").value;
  const idade = parseInt(form["update-idade"].value);

  if (isNaN(idade) || idade < 18) return alert("A idade do professor deve ser maior ou igual a 18 anos.");

  const data = {
    nome: form["update-nome"].value.trim(),
    materia: form["update-materia"].value.trim(),
    observacoes: form["update-observacao"].value.trim(),
    idade,
  };

  try {
    const res = await fetch(`${API_URL_PROFESSOR}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    alert("Professor atualizado com sucesso!");
    form.reset();
    document.getElementById("edit-popup").style.display = "none";
    listarProfessores();
  } catch (err) {
    mostrarErro("Erro ao atualizar professor.", err);
  }
};

// Excluir Professor (global)
window.excluirProfessor = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este professor?")) return;
  try {
    const res = await fetch(`${API_URL_PROFESSOR}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    alert("Professor excluído com sucesso!");
    listarProfessores();
  } catch (err) {
    mostrarErro("Erro ao excluir professor.", err);
  }
}

// Fechar popup
document.getElementById("close-popup").onclick = () => {
  document.getElementById("edit-popup").style.display = "none";
};