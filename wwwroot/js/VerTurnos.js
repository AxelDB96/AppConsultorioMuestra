async function mostrarTurnos() {
    try {
        const response = await fetch('https://localhost:7138/api/Turno/obtenerTodos');
        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            throw new Error('Hubo un error al obtener los datos');
        }

        const registros = await response.json();
        console.log('Registros recibidos:', registros);

        const tbody = document.querySelector('#tablaTurnos tbody');
        tbody.innerHTML = ''; // Limpiar contenido previo

        registros
            .forEach(registro => {
                const fila = `
                    <tr>
                        <td><input type="text" class="form-control" value="${registro.nombres}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.apellido}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.diaYhora}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.ubicacion}" readonly></td>
                        <td>
                            <a href="javascript:void(0)" onclick="VerTurno(${registro.id_turno})" class="btn btn-primary btn-sm btn-editar">✏️ Ver Turno</a>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', fila);
            });
    } catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}


async function mostrarTurnosFinalizados() {
    try {
        const response = await fetch('https://localhost:7138/api/Turno/obtenerTodosFinalizados');
        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            throw new Error('Hubo un error al obtener los datos');
        }

        const registros = await response.json();
        console.log('Registros recibidos:', registros);

        const tbody = document.querySelector('#tablaTurnosFinalizados tbody');
        tbody.innerHTML = ''; // Limpiar contenido previo

        registros
            .forEach(registro => {
                const fila = `
                    <tr>
                        <td><input type="text" class="form-control" value="${registro.nombres}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.apellido}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.diaYhora}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.ubicacion}" readonly></td>
                        <td>
                            <a href="javascript:void(0)" onclick="VerTurnoFinalizado(${registro.id_turno})" class="btn btn-primary btn-sm btn-editar">✏️ Ver Turno</a>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', fila);
            });
    } catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}

async function VerTurno(id_recibido) {
    try {
        const response = await fetch(`https://localhost:7138/api/Turno/${id_recibido}`);
        if (!response.ok) throw new Error('Hubo un error al obtener los datos');

        const turnoRecibido = await response.json();
        console.log('Datos del paciente:', turnoRecibido);

        //Aca llamo una funcion que llena la tabla con los datos del turno
        llenarModalTurno(turnoRecibido);

    }
    catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}

async function VerTurnoFinalizado(id_recibido) {
    try {
        const response = await fetch(`https://localhost:7138/api/Turno/${id_recibido}`);
        if (!response.ok) throw new Error('Hubo un error al obtener los datos');

        const turnoRecibido = await response.json();
        console.log('Datos del paciente:', turnoRecibido);

        //Aca llamo una funcion que llena la tabla con los datos del turno
        llenarModalTurnoFinalizado(turnoRecibido);

    }
    catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}

async function llenarModalTurno(turnoRecibido) {
    document.getElementById('turnoId').value = turnoRecibido.id_turno;
    document.getElementById('editNombresT').value = turnoRecibido.nombres;
    document.getElementById('editApellidoT').value = turnoRecibido.apellido;
    document.getElementById('editDocumentoT').value = turnoRecibido.documento;
    document.getElementById('editTelefonoT').value = turnoRecibido.telefono
    document.getElementById('editDiaHoraT').value = turnoRecibido.diaYhora;
    document.getElementById('editUbicacionT').value = turnoRecibido.ubicacion;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById('modalEditarTurno'));
    modal.show();
}

async function llenarModalTurnoFinalizado(turnoRecibido) {
    document.getElementById('turnoId').value = turnoRecibido.id_turno;
    document.getElementById('editNombresT').value = turnoRecibido.nombres;
    document.getElementById('editApellidoT').value = turnoRecibido.apellido;
    document.getElementById('editDocumentoT').value = turnoRecibido.documento;
    document.getElementById('editTelefonoT').value = turnoRecibido.telefono
    document.getElementById('editDiaHoraT').value = turnoRecibido.diaYhora;
    document.getElementById('editUbicacionT').value = turnoRecibido.ubicacion;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById('modalVerTurnoFinalizado'));
    modal.show();
}


async function eliminarTurno() {
    const idEliminar = parseInt(document.getElementById("turnoId").value.trim());

    try {
        const response = await fetch(`https://localhost:7138/api/Turno/eliminarTurno/${idEliminar}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Hubo un error al eliminar el turno');

        const result = await response.json(); // Captura el mensaje del servidor
        alert(result.mensaje); // Muestra el mensaje devuelto por el servidor

        location.reload();

    } catch (error) {
        console.error('Error al eliminar el turno:', error);
        alert("Error al eliminar el turno. Intenta nuevamente.");
    }
}

async function finalizarTurno() {
    const idFinalizarT = parseInt(document.getElementById("turnoId").value.trim());

    try {
        const response = await fetch(`https://localhost:7138/api/Turno/FinalizarTurno/${idFinalizarT}`, {
            method: 'PUT'
        });

        if (!response.ok) throw new Error('Hubo un error al finalizar el turno');

        const result = await response.json(); // Captura el mensaje del servidor
        alert(result.mensaje); // Muestra el mensaje devuelto por el servidor

        location.reload();

    } catch (error) {
        console.error('Error al finalizar el turno:', error);
        alert("Error al finalizar el turno. Intenta nuevamente.");
    }
}

async function buscarPorNombreOubicacion() {
    const inputBusqueda = document.getElementById("buscarTurnoFinalizado");
    const tabla = document.getElementById("tablaTurnosFinalizados").getElementsByTagName("tbody")[0];

    inputBusqueda.addEventListener("keyup", function () {
        const filtro = inputBusqueda.value.toLowerCase();
        const filas = tabla.getElementsByTagName("tr");

        for (let fila of filas) {
            const nombre = fila.cells[0].querySelector("input").value.toLowerCase();
            const apellido = fila.cells[1].querySelector("input").value.toLowerCase();
            const ubicacion = fila.cells[3].querySelector("input").value.toLowerCase();

            if (nombre.includes(filtro) || apellido.includes(filtro) || ubicacion.includes(filtro)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    });
}