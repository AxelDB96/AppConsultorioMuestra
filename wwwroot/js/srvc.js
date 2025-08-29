async function BuscarPorDNIInquilinoFILTRO() {
    // Obtener el valor del input
    var dni = document.getElementById('inputDNIingresoI').value;

    console.log(dni); // Log del valor ingresado
    try {
        const response = await fetch(`https://localhost:5000/api/inquilino/obtener/${dni}`);
        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            throw new Error('Hubo un error al obtener los datos');
        }

        const datosPorDNI = await response.json();
        console.log('Registros recibidos:', datosPorDNI);

        // filtro para ver si no es una visita
        if (datosPorDNI.estado === 2) {
            alert("Este DNI pertenece a un visitante, no a un inquilino.");
            inputIdInquilinoIngresoI.value = "";
            inputNombreIngresoI.value = "";
            inputApellidoIngresoI.value = "";
        } else if (datosPorDNI.estado === 1) {
            inputIdInquilinoIngresoI.value = datosPorDNI.id_visitante_inquilino;
            inputNombreIngresoI.value = datosPorDNI.nombre;
            inputApellidoIngresoI.value = datosPorDNI.apellido;
            alert("El inquilino se encuentra en el registro.");
        } else {
            alert("El estado del registro es desconocido.");
            inputIdInquilinoIngresoI.value = "";
            inputNombreIngresoI.value = "";
            inputApellidoIngresoI.value = "";
        }
    } catch (error) {
        alert("El número de DNI no está asociado a ningún inquilino registrado.");
        console.error('Error al mostrar los registros:', error);
        inputIdInquilinoIngresoI.value = "";
        inputNombreIngresoI.value = "";
        inputApellidoIngresoI.value = "";
    }
}