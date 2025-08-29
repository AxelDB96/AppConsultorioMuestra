async function verHorarios() {
    const fecha = document.getElementById("fecha").value;
    if (!fecha) return;

    fetch(`/Turno/Horarios?fecha=${fecha}`)
        .then(res => res.json())
        .then(data => {
            const div = document.getElementById("horarios");
            div.innerHTML = "";

            data.forEach(h => {
                const horaTexto = h.hora + ":00";
                const color = h.disponible ? "success" : "danger";
                const btn = h.disponible ? `<button class="btn btn-light btn-sm" onclick="seleccionarHorario('${fecha}', ${h.hora})">Seleccionar</button>` : "";

                div.innerHTML += `<div class="alert alert-${color} d-flex justify-content-between align-items-center">
                            ${horaTexto} ${btn}
                        </div>`;
            });

            const modal = new bootstrap.Modal(document.getElementById('modalHorarios'));
            modal.show();
        });
}

//

async function verHorariosSviejo() {
    const fecha = document.getElementById("fecha").value;
    if (!fecha) return;

    try {
        const res = await fetch(`/api/turno/horarios?fecha=${fecha}`);
        if (!res.ok) throw new Error("No se pudieron obtener los horarios.");

        const data = await res.json();
        const div = document.getElementById("horarios");
        div.innerHTML = "";

        data.forEach(h => {
            const horaTexto = h.hora.toString().padStart(2, '0') + ":00";
            const color = h.disponible ? "success" : "danger";
            const btn = h.disponible
                ? `<button class="btn btn-light btn-sm" onclick="seleccionarHorario('${fecha}', ${h.hora})">Seleccionar</button>`
                : "";

            div.innerHTML += `
                <div class="alert alert-${color} d-flex justify-content-between align-items-center">
                    ${horaTexto} ${btn}
                </div>`;
        });

        const modal = new bootstrap.Modal(document.getElementById('modalHorarios'));
        modal.show();
    } catch (error) {
        console.error(error);
        alert("Error al cargar los horarios.");
    }
}


//

async function verHorariosS() {
    const fecha = document.getElementById("fecha").value;
    if (!fecha) return;

    try {
        const res = await fetch(`/api/turno/horarios?fecha=${fecha}`);
        if (!res.ok) throw new Error("No se pudieron obtener los horarios.");

        const data = await res.json();
        const div = document.getElementById("horarios");
        div.innerHTML = "";

        data.forEach(h => {
            const horaTexto = h.hora.toString().padStart(2, '0') + ":" + h.minuto.toString().padStart(2, '0');
            const color = h.disponible ? "success" : "danger";
            const btn = h.disponible
                ? `<button class="btn btn-light btn-sm" onclick="seleccionarHorario('${fecha}', ${h.hora}, ${h.minuto})">Seleccionar</button>`
                : "";

            div.innerHTML += `
                <div class="alert alert-${color} d-flex justify-content-between align-items-center">
                    ${horaTexto} ${btn}
                </div>`;
        });

        new bootstrap.Modal(document.getElementById('modalHorarios')).show();
    } catch (error) {
        console.error(error);
        alert("Error al cargar los horarios.");
    }
}



async function seleccionarHorarioviejo(fecha, hora) {
    const fechaHora = new Date(fecha);
    fechaHora.setHours(hora);
    fechaHora.setMinutes(0);
    document.getElementById("horaSeleccionada").value = fechaHora.toISOString();

    // Cerrar el modal de horarios
    bootstrap.Modal.getInstance(document.getElementById('modalHorarios')).hide();

    // Abrir el modal de formulario
    const modalForm = new bootstrap.Modal(document.getElementById('modalFormulario'));
    modalForm.show();
}

function seleccionarHorario(fecha, hora, minuto) {
    const fechaHora = new Date(fecha);
    fechaHora.setHours(hora);
    fechaHora.setMinutes(minuto);
    document.getElementById("horaSeleccionada").value = fechaHora.toISOString();

    bootstrap.Modal.getInstance(document.getElementById('modalHorarios')).hide();
    new bootstrap.Modal(document.getElementById('modalFormulario')).show();
}

async function buscarPacientes() {
    const termino = document.getElementById("busquedaPaciente").value;
    const resultados = document.getElementById("resultadosBusqueda");

    if (termino.length === 0) {
        resultados.innerHTML = "";
        return;
    }

    fetch(`/Turno/BuscarPacientes?termino=${termino}`)
        .then(res => res.json())
        .then(data => {
            resultados.innerHTML = "";

            data.forEach(p => {
                const item = document.createElement("button");
                item.classList.add("list-group-item", "list-group-item-action");
                item.textContent = `${p.nombres} ${p.apellido} - ${p.documento}`;
                item.onclick = () => seleccionarPaciente(p);
                resultados.appendChild(item);
            });
        });
}
//

async function buscarPacientesSS() {
    const termino = document.getElementById("busquedaPaciente").value;
    const resultados = document.getElementById("resultadosBusqueda");

    if (termino.length === 0) {
        resultados.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`/api/turno/buscar-pacientes?termino=${encodeURIComponent(termino)}`);
        if (!res.ok) throw new Error("No se pudieron buscar pacientes.");

        const data = await res.json();
        resultados.innerHTML = "";

        data.forEach(p => {
            const item = document.createElement("button");
            item.classList.add("list-group-item", "list-group-item-action");
            item.textContent = `${p.nombres} ${p.apellido} - ${p.documento}`;
            item.onclick = () => seleccionarPaciente(p);
            resultados.appendChild(item);
        });
    } catch (error) {
        console.error(error);
        alert("Error al buscar pacientes.");
    }
}

//

async function seleccionarPaciente(p) {
    document.getElementById("id_paciente").value = p.id_paciente;
    document.getElementById("nombres").value = p.nombres;
    document.getElementById("apellido").value = p.apellido;
    document.getElementById("documento").value = p.documento;
    document.getElementById("telefono").value = p.telefonoResponsable;
    document.getElementById("ubicacion").value = p.ubicacion;

    document.getElementById("busquedaPaciente").value = `${p.nombres} ${p.apellido}`;
    document.getElementById("resultadosBusqueda").innerHTML = "";
}
async function agendar(e) {
    e.preventDefault();

    const id_paciente = document.getElementById("id_paciente").value;
    const diaYhoraStr = document.getElementById("horaSeleccionada").value;

    const diaYhora = diaYhoraStr; 

    const nombres = document.getElementById("nombres").value;
    const apellido = document.getElementById("apellido").value;
    const documento = document.getElementById("documento").value;
    const telefono = document.getElementById("telefono").value;
    const ubicacion = document.getElementById("ubicacion").value;

    fetch("/Turno/AgendarTurno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_paciente, nombres, apellido, documento, telefono, diaYhora, ubicacion })
    })
        .then(res => {
            if (res.ok) return res.text();
            return res.text().then(err => { throw new Error(err); });
        })
        .then(msg => {
            alert(msg);
            bootstrap.Modal.getInstance(document.getElementById('modalFormulario')).hide();
            verHorarios(); // Actualizar vista de horarios

            document.getElementById("id_paciente").value = "";
            document.getElementById("nombres").value = "";
            document.getElementById("apellido").value = "";
            document.getElementById("documento").value = "";
            document.getElementById("telefono").value = "";
            document.getElementById("ubicacion").value = "";

        })
        .catch(err => alert(err.message));
}

//

async function agendarR(e) {
    e.preventDefault();

    const id_paciente = document.getElementById("id_paciente").value;
    const diaYhora = document.getElementById("horaSeleccionada").value;
    const nombres = document.getElementById("nombres").value;
    const apellido = document.getElementById("apellido").value;
    const documento = document.getElementById("documento").value;
    const telefono = document.getElementById("telefono").value;
    const ubicacion = document.getElementById("ubicacion").value;

    try {
        const res = await fetch("/api/turno/agendarTurno", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_paciente, nombres, apellido, documento, telefono, diaYhora, ubicacion })
        });

        if (!res.ok) throw new Error(await res.text());

        const msg = await res.text();
        alert(msg);
        bootstrap.Modal.getInstance(document.getElementById('modalFormulario')).hide();
        verHorarios();

        // Limpiar formulario
        ["id_paciente", "nombres", "apellido", "documento", "telefono", "ubicacion"].forEach(id =>
            document.getElementById(id).value = ""
        );
    } catch (error) {
        console.error(error);
        alert("Error al agendar turno: " + error.message);
    }
}

//
async function cerrarModal() {
    document.getElementById("modalHorarios").style.display = "none";
    document.getElementById("formulario-turno").style.display = "none";
}

async function cerrarFormulario() {
    document.getElementById("modalFormulario").style.display = "none";
}