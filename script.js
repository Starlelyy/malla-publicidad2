const materias = [
  { nombre: "Filosofía" },
  { nombre: "Historia social general" },
  { nombre: "Introducción a la Sociología" },
  { nombre: "economía general" },
  { nombre: "introducción a la comunicación" },
  { nombre: "taller de lectura y escritura" },
  { nombre: "psicología general" },
  { nombre: "introducción a la publicidad", requiere: ["Historia social general", "introducción a la comunicación"], tipo: ["aprobada", "aprobada"] },
  { nombre: "psicología social", requiere: ["Introducción a la Sociología", "psicología general"], tipo: ["aprobada", "aprobada"] },
  { nombre: "lingüística", requiere: ["Introducción a la Sociología", "taller de lectura y escritura"], tipo: ["aprobada", "aprobada"] },
  { nombre: "comunicación visual", requiere: ["introducción a la comunicación", "taller de lectura y escritura"], tipo: ["aprobada", "aprobada"] },
  { nombre: "marketing I", requiere: ["economía general", "introducción a la comunicación"], tipo: ["aprobada", "aprobada"] },
  { nombre: "diseño y producción gráfica", requiere: ["comunicación visual", "introducción a la publicidad"], tipo: ["regularizada", "aprobada"] },
  { nombre: "metodología de la investigación social", requiere: ["Filosofía", "Introducción a la Sociología"], tipo: ["aprobada", "aprobada"] },
  { nombre: "comunicación I", requiere: ["Historia social general", "introducción a la comunicación"], tipo: ["aprobada", "aprobada"] },
  { nombre: "medios de comunicación publicitaria", requiere: ["marketing I", "introducción a la publicidad"], tipo: ["regularizada", "aprobada"] },
  { nombre: "redacción publicitaria", requiere: ["lingüística"], tipo: ["aprobada"] },
  { nombre: "Producción audiovisual", requiere: ["diseño y producción gráfica", "comunicación visual"], tipo: ["regularizada", "aprobada"] },
  { nombre: "comunicación II", requiere: ["comunicación I"], tipo: ["aprobada"] },
  { nombre: "planificación de medios", requiere: ["medios de comunicación publicitaria", "comunicación I"], tipo: ["regularizada", "aprobada"] },
  { nombre: "opinión pública", requiere: ["metodología de la investigación social"], tipo: ["aprobada"] },
  { nombre: "marketing II", requiere: ["marketing I"], tipo: ["aprobada"] },
  { nombre: "comunicación III", requiere: ["comunicación II", "comunicación I"], tipo: ["regularizada", "aprobada"] },
  { nombre: "Semiología", requiere: ["redacción publicitaria", "lingüística"], tipo: ["regularizada", "aprobada"] },
  { nombre: "organización y administración de la empresa publicitaria", requiere: ["planificación de medios", "medios de comunicación publicitaria"], tipo: ["regularizada", "aprobada"] },
  { nombre: "diseño multimedial", requiere: ["Producción audiovisual", "diseño y producción gráfica"], tipo: ["regularizada", "aprobada"] },
  { nombre: "investigación en publicidad", requiere: ["opinión pública", "metodología de la investigación social"], tipo: ["regularizada", "aprobada"] },
  { nombre: "prensa y comunicación institucional", requiere: ["comunicación II", "psicología social"], tipo: ["regularizada", "aprobada"] },
  { nombre: "política de los medios de comunicación social", requiere: ["comunicación I", "medios de comunicación publicitaria"], tipo: ["aprobada", "aprobada"] },
  { nombre: "práctica publicitaria", requiere: ["planificación de medios", "organización y administración de la empresa publicitaria", "medios de comunicación publicitaria"], tipo: ["regularizada", "regularizada", "aprobada"] },
  { nombre: "creatividad en publicidad", requiere: ["diseño multimedial", "Producción audiovisual"], tipo: ["regularizada", "aprobada"] },
];

const grid = document.querySelector(".grid");

function crearMateria(materia, index) {
  const div = document.createElement("div");
  div.className = "card locked";
  div.id = `materia-${index}`;
  div.innerHTML = `
    <h2>${materia.nombre}</h2>
    <select>
      <option value="nada">- Estado -</option>
      <option value="regularizada">Regularizada</option>
      <option value="aprobada">Aprobada</option>
    </select>
  `;
  div.querySelector("select").addEventListener("change", () => {
    guardarEstado();
    verificarDesbloqueo();
  });
  grid.appendChild(div);
}

function guardarEstado() {
  const estado = {};
  document.querySelectorAll(".card").forEach(card => {
    const nombre = card.querySelector("h2").innerText;
    const valor = card.querySelector("select").value;
    estado[nombre] = valor;
  });
  localStorage.setItem("estadoMaterias", JSON.stringify(estado));
}

function cargarEstado() {
  const estado = JSON.parse(localStorage.getItem("estadoMaterias") || "{}");
  document.querySelectorAll(".card").forEach(card => {
    const nombre = card.querySelector("h2").innerText;
    const select = card.querySelector("select");
    if (estado[nombre]) {
      select.value = estado[nombre];
    }
  });
}

function verificarDesbloqueo() {
  const estadoGuardado = JSON.parse(localStorage.getItem("estadoMaterias") || "{}");

  materias.forEach((m, i) => {
    const card = document.getElementById(`materia-${i}`);

    if (!m.requiere) {
      card.classList.remove("locked");
      card.classList.add("unlocked");
      return;
    }

    let habilitada = true;
    for (let j = 0; j < m.requiere.length; j++) {
      const requerida = m.requiere[j];
      const tipo = m.tipo[j];
      const estado = estadoGuardado[requerida];

      if (tipo === "aprobada" && estado !== "aprobada") habilitada = false;
      if (tipo === "regularizada" && estado !== "regularizada" && estado !== "aprobada") habilitada = false;
    }

    if (habilitada) {
      card.classList.remove("locked");
      card.classList.add("unlocked");
    } else {
      card.classList.remove("unlocked");
      card.classList.add("locked");
    }
  });
}

materias.forEach((m, i) => crearMateria(m, i));
cargarEstado();
verificarDesbloqueo();
