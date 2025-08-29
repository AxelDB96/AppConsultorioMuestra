async function verificarTelefonoO(num) {
    try {
        const response = await fetch(`https://localhost:7138/api/Colega/verificarTelefono?telefono=${num}`);
        const result = await response.json();
        return result.existe; // El servidor debe devolver un objeto con { existe: true/false }
    } catch (error) {
        console.error('Error al verificar el telefono', error);
        return false;
    }
}

async function verificarTelefonoActualizacion(telefono, colegaId) {
    try {
        // Llamar al endpoint para verificar si el teléfono ya existe en la base de datos
        const response = await fetch(`https://localhost:7138/api/Colega/verificarTelefonoActualizacion?telefono=${telefono}&colegaId=${colegaId}`);
        const result = await response.json();
        return result.existe; // Devuelve true si el teléfono ya está en uso por otro colega
    } catch (error) {
        console.error("Error al verificar el teléfono", error);
        return false;
    }
}

async function CrearColega() {
    const nombres = document.getElementById('inputNombresNC').value;
    const apellido = document.getElementById('inputApellidoNC').value;
    const profesion = document.getElementById('inputProfesionNC').value;
    const ubicacion = document.getElementById('inputUbicacionNC').value;
    const telefono = document.getElementById('inputTelefonoNC').value;
    const email = document.getElementById('inputEmailNC').value;

    // Validar campos
    if (!nombres || !telefono) {
        alert("El nombre y telefono son obligatorios.");
        return;
    }

    // Verificar si el telefono ya está registrado
    const telefonoExistente = await verificarTelefonoO(telefono);
    if (telefonoExistente) {
        alert("El telefono ya está registrado.");
        return;
    }

    const formData = {
        nombres: nombres,
        apellido: apellido,
        profesion: profesion,
        telefono: telefono,
        email: email,
        ubicacion: ubicacion,
    };

    try {
        const response = await fetch('https://localhost:7138/api/Colega/crearColega', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            //alert("Contacto creado correctamente.");
            const toast = document.getElementById('toast');
            toast.textContent = 'Contacto creado correctamente';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();// se recarga la pagina
            }, 3000); // 3 segundos visible
        } else {
            alert("Error: " + result.message || "El número de telefono ya está registrado en la base de datos.");
        }
    } catch (error) {
        console.error('Error al enviar el formulario', error);
        alert("Error al enviar el formulario.");
    } finally {
        // Limpiar los campos
        document.getElementById('inputNombresNC').value = '';
        document.getElementById('inputApellidoNC').value = '';
        document.getElementById('inputProfesionNC').value = '';
        document.getElementById('inputUbicacionNC').value = '';
        document.getElementById('inputTelefonoNC').value = '';
        document.getElementById('inputEmailNC').value = '';
    }
}

async function mostrarColegas() {
    try {
        const response = await fetch('https://localhost:7138/api/Colega/obtenerTodos');
        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            throw new Error('Hubo un error al obtener los datos');
        }

        const registros = await response.json();
        console.log('Registros recibidos:', registros);

        const tbody = document.querySelector('#tablaColegas tbody');
        tbody.innerHTML = ''; // Limpiar contenido previo

        registros
            .forEach(registro => {
                const fila = `
                    <tr>
                        <td><input type="text" class="form-control" value="${registro.nombres}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.apellido}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.profesion}" readonly></td>
                        <td>
                            <a href="javascript:void(0)" onclick="editarColega(${registro.id_colega})" class="btn btn-primary btn-sm btn-editar">✏️ Ver Contactos</a>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', fila);
            });
    } catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}

async function editarColega(id_recibido) {
    try {
        const response = await fetch(`https://localhost:7138/api/Colega/${id_recibido}`);
        if (!response.ok) throw new Error('Hubo un error al obtener los datos');

        const contactoRecibido = await response.json();
        console.log('Datos del paciente:', contactoRecibido);

        //Aca llamo una funcion que llena la tabla con los datos del Colega
        llenarModalColega(contactoRecibido);

    }
    catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}

async function llenarModalColega(contactoRecibido) {
    document.getElementById('colegaId').value = contactoRecibido.id_colega;
    document.getElementById('editNombresC').value = contactoRecibido.nombres;
    document.getElementById('editApellidoC').value = contactoRecibido.apellido;
    document.getElementById('editProfesionC').value = contactoRecibido.profesion;
    document.getElementById('editUbicacionC').value = contactoRecibido.ubicacion;
    document.getElementById('editTelefonoC').value = contactoRecibido.telefono;
    document.getElementById('editEmailC').value = contactoRecibido.email;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById('modalEditarColega'));
    modal.show();
}

async function actualizarColega() {
    // Obtener los campos del formulario
    const campos = [
        "colegaId", "editNombresC", "editApellidoC", "editProfesionC", "editUbicacionC",
        "editTelefonoC", "editEmailC"
    ];

    // Crear objeto con los valores del formulario
    const colegaActualizado = {};
    campos.forEach(id => {
        const valor = document.getElementById(id).value.trim();
        colegaActualizado[id] = valor;
    });

    // Verificar si el telefono ya está en uso antes de hacer la actualización
    const telefonoExistente = await verificarTelefonoActualizacion(colegaActualizado.editTelefonoC, colegaActualizado.colegaId);
    if (telefonoExistente) {
        alert("El teléfono ya está registrado en otro contacto.");
        return;  // Detener la actualización si el teléfono ya está en uso
    }

    try {
        const response = await fetch("https://localhost:7138/api/Colega/actualizar", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_colega: colegaActualizado.colegaId,
                nombres: colegaActualizado.editNombresC,
                apellido: colegaActualizado.editApellidoC,
                telefono: colegaActualizado.editTelefonoC,
                ubicacion: colegaActualizado.editUbicacionC,
                email: colegaActualizado.editEmailC,
                profesion: colegaActualizado.editProfesionC
            })
        });

        const resultado = await response.json();

        if (response.ok) {
            //alert("Contacto actualizado correctamente");
            const toast = document.getElementById('toast');
            toast.textContent = 'Contacto actualizado correctamente';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();// se recarga la pagina
            }, 3000); // 3 segundos visible
        } else {
            alert("Error al actualizar: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error en la actualización.");
    }
}


async function buscarPorNombreOProfesion() {
    const inputBusqueda = document.getElementById("buscarColega");
    const tabla = document.getElementById("tablaColegas").getElementsByTagName("tbody")[0];

    inputBusqueda.addEventListener("keyup", function () {
        const filtro = inputBusqueda.value.toLowerCase();
        const filas = tabla.getElementsByTagName("tr");

        for (let fila of filas) {
            const nombre = fila.cells[0].querySelector("input").value.toLowerCase();
            const apellido = fila.cells[1].querySelector("input").value.toLowerCase();
            const profesion = fila.cells[2].querySelector("input").value.toLowerCase();

            if (nombre.includes(filtro) || apellido.includes(filtro) || profesion.includes(filtro)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    });
}

async function eliminarColega() {
    const idEliminar = parseInt(document.getElementById("colegaId").value.trim());

    try {
        const response = await fetch(`https://localhost:7138/api/Colega/eliminarContacto/${idEliminar}`, {
            method: 'DELETE' 
        });

        if (!response.ok) throw new Error('Hubo un error al eliminar el contacto');

        const result = await response.json(); // Captura el mensaje del servidor
        alert(result.mensaje); // Muestra el mensaje devuelto por el servidor

        location.reload();

    } catch (error) {
        console.error('Error al eliminar el contacto:', error);
        alert("Error al eliminar el contacto. Intenta nuevamente.");
    }
}