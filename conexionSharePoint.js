// ======================================================
// CONEXIÓN MICROSOFT LISTS + SHAREPOINT
// Automatización de Inspecciones
// ======================================================


// URL DEL FLUJO POWER AUTOMATE
// Reemplazar cuando se cree el flujo real

const POWER_AUTOMATE_URL = 
"https://TU_FLUJO_POWER_AUTOMATE";




// ======================================================
// CREAR REGISTRO EN MICROSOFT LISTS
// ======================================================


async function crearRegistroSharePoint(datos){


try{


const respuesta = await fetch(
POWER_AUTOMATE_URL,
{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:
JSON.stringify(datos)


});



const resultado =
await respuesta.json();



return resultado;



}

catch(error){


console.error(
"Error creando registro:",
error
);


throw error;


}



}






// ======================================================
// CONSULTAR INSPECCIONES
// ======================================================


async function consultarInspecciones(){


try{


const respuesta =
await fetch(
POWER_AUTOMATE_URL,
{

method:"GET"

}
);



const datos =
await respuesta.json();



return datos;



}


catch(error){


console.error(
"Error consultando información:",
error
);



return [];

}


}







// ======================================================
// ACTUALIZAR ESTADO DE INSPECCIÓN
// ======================================================


async function actualizarRegistroSharePoint(
id,
estado
){



const datos={


ID:id,


Estado:estado,


FechaActualizacion:
new Date()
.toISOString()


};




return await crearRegistroSharePoint(
datos
);



}







// ======================================================
// REGISTRAR HALLAZGO
// ======================================================


async function registrarHallazgo(
idInspeccion,
hallazgo
){



const datos={


IDInspeccion:
idInspeccion,


Descripcion:
hallazgo.descripcion,


Prioridad:
hallazgo.prioridad,


Responsable:
hallazgo.responsable,


FechaCompromiso:
hallazgo.fechaCompromiso,


Estado:
"Pendiente"


};



return await crearRegistroSharePoint(
datos
);



}







// ======================================================
// SUBIR EVIDENCIA
// SHAREPOINT DOCUMENT LIBRARY
// ======================================================


async function subirEvidencia(
archivo,
idInspeccion
){



let formulario =
new FormData();



formulario.append(
"archivo",
archivo
);



formulario.append(
"IDInspeccion",
idInspeccion
);




try{


const respuesta =
await fetch(
POWER_AUTOMATE_URL,
{

method:"POST",

body:
formulario


});



return await respuesta.json();



}



catch(error){


console.error(
"Error subiendo evidencia:",
error
);


}



}








// ======================================================
// CONVERTIR INFORMACIÓN DEL FORMULARIO
// A ESTRUCTURA MICROSOFT LISTS
// ======================================================


function prepararRegistro(datos){



return {


Title:
"Inspección - "
+
datos.area,


Area:
datos.area,


Inspector:
datos.inspector,


Fecha:
datos.fecha,


Tipo:
datos.tipo,


Estado:
datos.estado,


Hallazgo:
datos.hallazgo,


Prioridad:
datos.prioridad,


Responsable:
datos.responsable,


FechaCompromiso:
datos.fechaCompromiso,


Observaciones:
datos.observaciones,


Checklist:
JSON.stringify(
datos.checklist
),


FechaRegistro:
new Date()
.toISOString()



};



}








// ======================================================
// VALIDACIÓN DE CONEXIÓN
// ======================================================


async function validarConexion(){


try{


const respuesta =
await fetch(
POWER_AUTOMATE_URL
);



if(respuesta.ok){


console.log(
"Conexión Microsoft 365 activa"
);



return true;


}


return false;



}


catch(error){


console.error(error);


return false;


}



}
