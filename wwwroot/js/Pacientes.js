
async function obtenerTotalPacientesActivos() {
    try {
        const response = await fetch('https://localhost:7138/api/Paciente/totalPacientesActivos');
        if (!response.ok) {
            throw new Error('Error al obtener el total de pacientes');
        }
        const total = await response.json();
        const totalPacientesElement = document.getElementById('totalPacientes');
        if (totalPacientesElement) {
            totalPacientesElement.textContent = total;
        }
    } catch (error) {
        console.error('Error al obtener el total de pacientes:', error);
        const totalPacientesElement = document.getElementById('totalPacientes');
        if (totalPacientesElement) {
            totalPacientesElement.textContent = 'Error';
        }
    }
}

// Llamar la función cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", obtenerTotalPacientesActivos);


async function verificarDNI(dni) {
    try {
        const response = await fetch(`https://localhost:7138/api/Paciente/verificarDNI?dni=${dni}`);
        const result = await response.json();
        return result.existe; // El servidor debe devolver un objeto con { existe: true/false }
    } catch (error) {
        console.error('Error al verificar el DNI', error);
        return false;
    }
}

async function CrearPacientes() {
    const nombres = document.getElementById('inputNombresNP').value;
    const apellido = document.getElementById('inputApellidoNP').value;
    const documento = document.getElementById('inputDNINP').value;
    const fechaDeNacimiento = document.getElementById('inputFechaNacimientoNP').value;
    const fechaDeAdmision = document.getElementById('inputFechaAdmisionNP').value;
    const ubicacion = document.getElementById('inputUbicacionNP').value;
    const adultoResponsable = document.getElementById('inputAdultoResponsableNP').value;
    const nombresResponsable = document.getElementById('inputNombresdelResponsableNP').value;
    const telefonoResponsable = document.getElementById('inputTelefonodelResponsableNP').value;
    const emailResponsable = document.getElementById('inputEmaildelResponsableNP').value;
    //1 activado, 2 inactivo
    const activo = 1;

    // Validar campos
    if (!nombres || !apellido || !documento || !fechaDeNacimiento || !fechaDeAdmision || !ubicacion || !adultoResponsable || !nombresResponsable || !telefonoResponsable || !emailResponsable) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Verificar si el DNI ya está registrado
    const dniExistente = await verificarDNI(documento);
    if (dniExistente) {
        alert("El DNI ya está registrado.");
        return;
    }

    const formData = {
        nombres: nombres,
        apellido: apellido,
        documento: documento,
        fechaDeNacimiento: fechaDeNacimiento,
        fechaDeAdmision: fechaDeAdmision,
        ubicacion: ubicacion,
        adultoResponsable: adultoResponsable,
        nombresResponsable: nombresResponsable,
        telefonoResponsable: telefonoResponsable,
        emailResponsable: emailResponsable,
        activo: activo,
    };

    try {
        const response = await fetch('https://localhost:7138/api/Paciente/crearPaciente', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            //alert("Paciente creado correctamente.");
            const toast = document.getElementById('toast');
            toast.textContent = 'Paciente creado correctamente';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();// se recarga la pagina
            }, 3000); // 5 segundos visible
        } else {
            alert("Error: " + result.message || "El número de DNI ya está registrado en la base de datos.");
        }
    } catch (error) {
        console.error('Error al enviar el formulario', error);
        alert("Error al enviar el formulario.");
    } finally {
        // Limpiar los campos
        document.getElementById('inputNombresNP').value = '';
        document.getElementById('inputApellidoNP').value = '';
        document.getElementById('inputDNINP').value = '';
        document.getElementById('inputFechaNacimientoNP').value = '';
        document.getElementById('inputFechaAdmisionNP').value = '';
        document.getElementById('inputUbicacionNP').value = '';
        document.getElementById('inputAdultoResponsableNP').value = '';
        document.getElementById('inputNombresdelResponsableNP').value = '';
        document.getElementById('inputTelefonodelResponsableNP').value = '';
        document.getElementById('inputEmaildelResponsableNP').value = '';
    }
}

async function mostrarPacientes() {
    try {
        const response = await fetch('https://localhost:7138/api/Paciente/obtenerTodos');
        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            throw new Error('Hubo un error al obtener los datos');
        }

        const registros = await response.json();
        console.log('Registros recibidos:', registros);

        const tbody = document.querySelector('#tablaPacientes tbody');
        tbody.innerHTML = ''; // Limpiar contenido previo

        registros
            .filter(registro => registro.activo == 1)
            .forEach(registro => {
                const fila = `
                    <tr>
                        <td><input type="text" class="form-control" value="${registro.nombres}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.apellido}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.documento}" readonly></td>
                        <td>
                            <a href="javascript:void(0)" onclick="editarPacientee(${registro.id_paciente})" class="btn btn-primary btn-sm btn-editar">✏️ Editar</a>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', fila);
            });
    } catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}


async function editarPacientee(id_recibido) {
    try {
        const response = await fetch(`https://localhost:7138/api/Paciente/${id_recibido}`);
        if (!response.ok) throw new Error('Hubo un error al obtener los datos');

        const pacienteRecibido = await response.json();
        console.log('Datos del paciente:', pacienteRecibido);

        //Aca llamo una funcion que llena la tabla con los datos del paciente
        llenarModalPaciente(pacienteRecibido);
        
    }
    catch (error) {
            console.error('Error al mostrar los registros:', error);
    }
}

async function llenarModalPaciente(pacienteRecibido) {
    document.getElementById('pacienteId').value = pacienteRecibido.id_paciente;
    document.getElementById('editNombres').value = pacienteRecibido.nombres;
    document.getElementById('editApellido').value = pacienteRecibido.apellido;
    document.getElementById('editDocumento').value = pacienteRecibido.documento;
    document.getElementById('editFechaNac').value = pacienteRecibido.fechaDeNacimiento;
    document.getElementById('editUbicacion').value = pacienteRecibido.ubicacion;
    document.getElementById('editAdultRespon').value = pacienteRecibido.adultoResponsable;
    document.getElementById('editNombreResponsable').value = pacienteRecibido.nombresResponsable;
    document.getElementById('editTelefonoResponsable').value = pacienteRecibido.telefonoResponsable;
    document.getElementById('editEmailResponsable').value = pacienteRecibido.emailResponsable;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById('modalEditarPaciente'));
    modal.show();
}

async function actualizarPaciente() {
    // Obtener los campos del formulario
    const campos = [
        "pacienteId", "editNombres", "editApellido", "editDocumento", "editFechaNac",
        "editUbicacion", "editAdultRespon", "editNombreResponsable", "editTelefonoResponsable", "editEmailResponsable"
    ];

    let camposVacios = false; // Bandera para detectar si hay campos vacíos

    // Limpiar estilos previos
    campos.forEach(id => {
        document.getElementById(id).classList.remove("is-invalid");
    });

    // Crear objeto con los valores del formulario
    const pacienteActualizado = {};
    campos.forEach(id => {
        const valor = document.getElementById(id).value.trim();
        pacienteActualizado[id] = valor;

        // Si el campo está vacío, marcarlo en rojo
        if (valor === "") {
            document.getElementById(id).classList.add("is-invalid");
            camposVacios = true;
        }
    });

    // Si hay campos vacíos, mostrar alerta y detener el envío
    if (camposVacios) {
        alert("Todos los campos son obligatorios. Por favor, complete todos los datos.");
        return;
    }

    try {
        const response = await fetch("https://localhost:7138/api/Paciente/actualizar", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_paciente: pacienteActualizado.pacienteId,
                nombres: pacienteActualizado.editNombres,
                apellido: pacienteActualizado.editApellido,
                documento: pacienteActualizado.editDocumento,
                fechaDeNacimiento: pacienteActualizado.editFechaNac,
                ubicacion: pacienteActualizado.editUbicacion,
                adultoResponsable: pacienteActualizado.editAdultRespon,
                nombresResponsable: pacienteActualizado.editNombreResponsable,
                telefonoResponsable: pacienteActualizado.editTelefonoResponsable,
                emailResponsable: pacienteActualizado.editEmailResponsable
            })
        });

        const resultado = await response.json();

        if (response.ok) {
            //alert("Paciente actualizado correctamente");
            const toast = document.getElementById('toast');
            toast.textContent = 'se actualizaron los datos del paciente';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();
            }, 3000); // 5 segundos visible
            //location.reload(); // Recargar la página para ver los cambios
        } else {
            alert("Error al actualizar: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error en la actualización.");
    }
}

async function historiaClinicaPaciente(id_recibido) {
    try {
        const response = await fetch(`https://localhost:7138/api/Paciente/${id_recibido}`);
        if (!response.ok) throw new Error('Hubo un error al obtener los datos');

        const pacienteRecibido = await response.json();
        console.log('Datos del paciente:', pacienteRecibido);

        //Aca llamo una funcion que llena la tabla con los datos del paciente
        iraHistoriaClinica(pacienteRecibido);

    }
    catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}
async function iraHistoriaClinica(pacienteRecibido) {

    localStorage.setItem("paciente", JSON.stringify(pacienteRecibido));
    window.location.href = "/Vistas/historiaClinica";

}
async function llenarHistoriaClinica() {

    const pacienteData = localStorage.getItem("paciente");

        const paciente = JSON.parse(pacienteData);

        document.getElementById("nombreH").value = paciente.nombres;
        document.getElementById("apellidoH").value = paciente.apellido;
        document.getElementById("dniH").value = paciente.documento;

    if (paciente.historiaClinica == null) {

        document.getElementById("textoHistoria").value = "No hay Historia Clinica cargada";
    } else {

        document.getElementById("textoHistoria").value = paciente.historiaClinica;
    }

        // Limpiar los datos después de cargarlos
        //localStorage.removeItem("paciente");
}

async function actualizarHistoriaClinicaPaciente() {
    const historiaClinicaNEW = document.getElementById("textoHistoria").value.trim();

    //aca obtengo los datos del paciente que ingresa al formulario
    const pacienteData = localStorage.getItem("paciente");
    if (!pacienteData) {
        alert("No se encontró informacion del paciente...");
        return;
    }

    const pacienteACT = JSON.parse(pacienteData);
    if (!pacienteACT.id_paciente) {
        alert("Falta el ID del paciente.");
        return;
    }

    //creacion del objeto con los datos del paciente para actualizarlo
    const datosActualizados = {
        id_paciente: pacienteACT.id_paciente,
        nombres: pacienteACT.nombres,
        apellido: pacienteACT.apellido,
        documento: pacienteACT.documento,
        historiaClinica: historiaClinicaNEW
    };

    console.log("Datos que se enviarán:", datosActualizados);

    try {
        const response = await fetch("https://localhost:7138/api/Paciente/historiaClinica", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datosActualizados) //aca estoy enviando el obj con los datos del paciente
        });

        const resultado = await response.json();
        console.log("Respuesta completa:", response.status, resultado);

        if (response.ok) {
            //alert("Se cargó correctamente la historia clinica.");
            const toast = document.getElementById('toast');
            toast.textContent = 'Se cargó correctamente la historia clinica.';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload(); // Recargar la página para ver los cambios
            }, 3000); // 5 segundos visible
        } else {
            alert("Error al actualizar: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error en la actualizacion.");
    }
}

async function seguimientoEvaluacionPaciente(id_recibido) {
    try {
        const response = await fetch(`https://localhost:7138/api/Paciente/${id_recibido}`);
        if (!response.ok) throw new Error('Hubo un error al obtener los datos');

        const pacienteRecibido = await response.json();
        console.log('Datos del paciente:', pacienteRecibido);

        //Aca llamo una funcion que llena la tabla con los datos del paciente
        iraSeguimientoEvaluacion(pacienteRecibido);

    }
    catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}
async function iraSeguimientoEvaluacion(pacienteRecibido) {

    localStorage.setItem("paciente", JSON.stringify(pacienteRecibido));
    window.location.href = "/Vistas/seguimientoEvaluacion";

}

async function llenarSeguimientoEvaluacion() {

    const pacienteData = localStorage.getItem("paciente");

    const paciente = JSON.parse(pacienteData);

    document.getElementById("nombreE").value = paciente.nombres;
    document.getElementById("apellidoE").value = paciente.apellido;
    document.getElementById("dniE").value = paciente.documento;

    if (paciente.seguimientoEvaluacion == null) {

        document.getElementById("textoSeguimientoEvaluacion").value = "No hay un seguimiento de Evaluacion cargado";
    } else {

        document.getElementById("textoSeguimientoEvaluacion").value = paciente.seguimientoEvaluacion;
    }

    // Limpiar los datos después de cargarlos
    //localStorage.removeItem("paciente");
}

async function actualizarSeguimientoEvaluacion() {
    const seguimientoEVANEW = document.getElementById("textoSeguimientoEvaluacion").value.trim();

    //aca obtengo los datos del paciente que ingresa al formulario
    const pacienteData = localStorage.getItem("paciente");
    if (!pacienteData) {
        alert("No se encontró informacion del paciente...");
        return;
    }

    const pacienteACT = JSON.parse(pacienteData);
    if (!pacienteACT.id_paciente) {
        alert("Falta el ID del paciente.");
        return;
    }

    //creacion del objeto con los datos del paciente para actualizarlo
    const datosActualizados = {
        id_paciente: pacienteACT.id_paciente,
        nombres: pacienteACT.nombres,
        apellido: pacienteACT.apellido,
        documento: pacienteACT.documento,
        seguimientoEvaluacion: seguimientoEVANEW
    };

    console.log("Datos que se enviarán:", datosActualizados);

    try {
        const response = await fetch("https://localhost:7138/api/Paciente/seguimientoEvaluacion", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datosActualizados) //aca estoy enviando el obj con los datos del paciente
        });

        const resultado = await response.json();
        console.log("Respuesta completa:", response.status, resultado);

        if (response.ok) {
            //alert("Se cargó correctamente el seguimiento de evaluacion.");
            const toast = document.getElementById('toast');
            toast.textContent = 'Se cargó correctamente el seguimiento de evaluacion';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();// se recarga la pagina
            }, 3000); // 5 segundos visible
        } else {
            alert("Error al actualizar: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error en la actualizacion.");
    }
}

async function seguimientoTratamientoPaciente(id_recibido) {
    try {
        const response = await fetch(`https://localhost:7138/api/Paciente/${id_recibido}`);
        if (!response.ok) throw new Error('Hubo un error al obtener los datos');

        const pacienteRecibido = await response.json();
        console.log('Datos del paciente:', pacienteRecibido);

        //Aca llamo una funcion que llena la tabla con los datos del paciente
        iraSeguimientoTratamientp(pacienteRecibido);

    }
    catch (error) {
        console.error('Error al mostrar los registros:', error);
    }
}
async function iraSeguimientoTratamientp(pacienteRecibido) {

    localStorage.setItem("paciente", JSON.stringify(pacienteRecibido));
    window.location.href = "/Vistas/seguimientoTratamiento";

}

async function llenarSeguimientoTratamiento() {

    const pacienteData = localStorage.getItem("paciente");

    const paciente = JSON.parse(pacienteData);

    document.getElementById("nombreT").value = paciente.nombres;
    document.getElementById("apellidoT").value = paciente.apellido;
    document.getElementById("dniT").value = paciente.documento;

    if (paciente.seguimientoTratamiento == null) {

        document.getElementById("textoSeguimientoTratamiento").value = "No hay un seguimiento de Tratamiento cargado";
    } else {

        document.getElementById("textoSeguimientoTratamiento").value = paciente.seguimientoTratamiento;
    }

    // Limpiar los datos después de cargarlos
    //localStorage.removeItem("paciente");
}

async function actualizarSeguimientoTratamiento() {
    const seguimientoTRANEW = document.getElementById("textoSeguimientoTratamiento").value.trim();

    //aca obtengo los datos del paciente que ingresa al formulario
    const pacienteData = localStorage.getItem("paciente");
    if (!pacienteData) {
        alert("No se encontró informacion del paciente...");
        return;
    }

    const pacienteACT = JSON.parse(pacienteData);
    if (!pacienteACT.id_paciente) {
        alert("Falta el ID del paciente.");
        return;
    }

    //creacion del objeto con los datos del paciente para actualizarlo
    const datosActualizados = {
        id_paciente: pacienteACT.id_paciente,
        nombres: pacienteACT.nombres,
        apellido: pacienteACT.apellido,
        documento: pacienteACT.documento,
        seguimientoTratamiento: seguimientoTRANEW
    };

    console.log("Datos que se enviarán:", datosActualizados);

    try {
        const response = await fetch("https://localhost:7138/api/Paciente/seguimientoTratamiento", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datosActualizados) //aca estoy enviando el obj con los datos del paciente
        });

        const resultado = await response.json();
        console.log("Respuesta completa:", response.status, resultado);

        if (response.ok) {
            //alert("Se cargó correctamente el seguimiento de tratamiento.");
            const toast = document.getElementById('toast');
            toast.textContent = 'Se cargó correctamente el seguimiento de tratamiento';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();// se recarga la pagina
            }, 3000); // 5 segundos visible
        } else {
            alert("Error al actualizar: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error en la actualizacion.");
    }
}

async function BotondesactivarPaciente() {
    const idParaDesactivar = document.getElementById("pacienteId").value.trim();
    const nombresParaDesactivar = document.getElementById("editNombres").value.trim();
    const apellidoParaDesactivar = document.getElementById("editApellido").value.trim();
    const documentoParaDesactivar = document.getElementById("editDocumento").value.trim();


    const datosParaDesactivar = {
        id_paciente: idParaDesactivar,
        nombres: nombresParaDesactivar,
        apellido: apellidoParaDesactivar,
        documento: documentoParaDesactivar
    };

    console.log("Datos para desactivar:", datosParaDesactivar);


    try {
        const response = await fetch("https://localhost:7138/api/Paciente/desactivarPaciente", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datosParaDesactivar) //envio el obj con los datos del paciente que se va a desactivar
        });

        const resultado = await response.json();
        console.log("Respuesta completa:", response.status, resultado);

        if (response.ok) {
            //alert("Se desactivo correctamente el paciente");
            const toast = document.getElementById('toast');
            toast.textContent = 'Se desactivo correctamente el paciente';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();// se recarga la pagina
            }, 3000); // 5 segundos visible
        } else {
            alert("Error al intentar desactivar el paciente" + resultado.mensaje)
        }

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error en la actualizacion.");
    }
}

async function mostrarPacientesInactivos() {
    try {
        const response = await fetch('https://localhost:7138/api/Paciente/obtenerTodos');
        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            throw new Error('Hubo un error al obtener los datos');
        }

        const registros = await response.json();
        console.log('Registros recibidos:', registros);

        const tbody = document.querySelector('#tablaPacientesInactivos tbody');
        tbody.innerHTML = ''; // Limpiar contenido previo

        registros
            .filter(registro => registro.activo == 2)
            .forEach(registro => {
                const fila = `
                    <tr>
                        <td><input type="text" class="form-control" value="${registro.nombres}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.apellido}" readonly></td>
                        <td><input type="text" class="form-control" value="${registro.documento}" readonly></td>
                        <td>
                            <a href="javascript:void(0)" onclick="botonActivarPaciente(${registro.id_paciente},'${registro.nombres}','${registro.apellido}','${registro.documento}')" class="btn btn-primary btn-sm btn-editar">activar</a>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', fila);
            });
    } catch (error) {
        console.error('Error al mostrar los datos del paciente:', error);
    }
}

async function botonActivarPaciente(id_pacienteI,nombrePacienteI,apellidoPacienteI,documentoPacienteI) {
    const idParaActivar = id_pacienteI;
    const nombresParaActivar = nombrePacienteI;
    const apellidoParaActivar = apellidoPacienteI;
    const documentoParaActivar = documentoPacienteI;


    const datosParaActivar = {
        id_paciente: idParaActivar,
        nombres: nombresParaActivar,
        apellido: apellidoParaActivar,
        documento: documentoParaActivar
    };

    console.log("Datos para desactivar:", datosParaActivar);


    try {
        const response = await fetch("https://localhost:7138/api/Paciente/activarPaciente", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datosParaActivar) //envio el obj con los datos del paciente que se va a desactivar
        });

        const resultado = await response.json();
        console.log("Respuesta completa:", response.status, resultado);

        if (response.ok) {
            //alert("Se activo correctamente el paciente");
            const toast = document.getElementById('toast');
            toast.textContent = 'Se activo correctamente el paciente';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                location.reload();// se recarga la pagina
            }, 3000); // 3 segundos visible
        } else {
            alert("Error al intentar activar el paciente" + resultado.mensaje)
        }

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error en la actualizacion.");
    }
}



async function editarPaciente() {
    const editarPacienteUrl = "/Vistas/editarPaciente";
    window.location.href = editarPacienteUrl;
}
async function buscarPorNombreOdni() {
    const inputBusqueda = document.getElementById("buscarPaciente");
    const tabla = document.getElementById("tablaPacientes").getElementsByTagName("tbody")[0];

    inputBusqueda.addEventListener("keyup", function () {
        const filtro = inputBusqueda.value.toLowerCase();
        const filas = tabla.getElementsByTagName("tr");

        for (let fila of filas) {
            const nombre = fila.cells[0].querySelector("input").value.toLowerCase();
            const apellido = fila.cells[1].querySelector("input").value.toLowerCase();
            const dni = fila.cells[2].querySelector("input").value.toLowerCase();

            if (nombre.includes(filtro) || apellido.includes(filtro) || dni.includes(filtro)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    });
}

async function buscarPorNombreOdniInactivos() {
    const inputBusqueda = document.getElementById("buscarPacienteI");
    const tabla = document.getElementById("tablaPacientesInactivos").getElementsByTagName("tbody")[0];

    inputBusqueda.addEventListener("keyup", function () {
        const filtro = inputBusqueda.value.toLowerCase();
        const filas = tabla.getElementsByTagName("tr");

        for (let fila of filas) {
            const nombre = fila.cells[0].querySelector("input").value.toLowerCase();
            const apellido = fila.cells[1].querySelector("input").value.toLowerCase();
            const dni = fila.cells[2].querySelector("input").value.toLowerCase();

            if (nombre.includes(filtro) || apellido.includes(filtro) || dni.includes(filtro)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    });
}


