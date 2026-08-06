// ==============================================
// AUTOMATIZACIÓN DE INSPECCIONES
// Conexión preparada para Microsoft Lists
// ==============================================


// URL DEL FLUJO POWER AUTOMATE
// Este flujo será el intermediario hacia Microsoft Lists

const API_URL = "URL_POWER_AUTOMATE_AQUI";


// almacenamiento temporal de la sesión

let inspecciones = [];

let inspeccionSeleccionada = null;



// ==============================================
// CREAR INSPECCIÓN
// ==============================================


async function crearInspeccion(){


    const inspeccion = {


        area:
        document.getElementById("area").value,


        inspector:
        document.getElementById("inspector").value,


        fecha:
        document.getElementById("fecha").value,


        tipo:
        document.getElementById("tipo").value,


        estado:
        "Pendiente",


        hallazgo:
        document.getElementById("hallazgo").value,


        prioridad:
        document.getElementById("prioridad").value,


        responsable:
        document.getElementById("responsable").value,


        fechaCompromiso:
        document.getElementById("fechaCompromiso").value,


        observaciones:
        document.getElementById("observaciones").value,


        checklist:
        obtenerChecklist(),


        fechaRegistro:
        new Date().toISOString()

    };



    if(!inspeccion.area ||
       !inspeccion.inspector){


        mostrarNotificacion(
        "Complete los campos obligatorios"
        );

        return;

    }



    await enviarMicrosoftLists(inspeccion);



}





// ==============================================
// OBTENER CHECKLIST
// ==============================================


function obtenerChecklist(){


    let lista=[];


    document
    .querySelectorAll(".criterio")
    .forEach(item=>{


        lista.push({


            criterio:
            item.parentElement.innerText,


            resultado:
            item.checked
            ?
            "Cumple"
            :
            "No cumple"


        });


    });



    return lista;


}






// ==============================================
// ENVIAR DATOS A MICROSOFT LISTS
// MEDIANTE POWER AUTOMATE
// ==============================================


async function enviarMicrosoftLists(datos){



try{


    const respuesta =
    await fetch(API_URL,{


        method:"POST",


        headers:{


            "Content-Type":
            "application/json"


        },


        body:
        JSON.stringify(datos)


    });



    if(respuesta.ok){


        mostrarNotificacion(
        "Inspección registrada correctamente"
        );


        limpiarFormulario();



    }


    else{


        mostrarNotificacion(
        "Error al registrar información"
        );


    }



}

catch(error){


console.error(error);


mostrarNotificacion(
"Error de conexión"
);


}



}





// ==============================================
// CONSULTAR INSPECCIONES
// Microsoft Lists
// ==============================================


async function cargarInspecciones(){


try{


const respuesta =
await fetch(API_URL);



inspecciones =
await respuesta.json();



mostrarTabla();



actualizarIndicadores();



}


catch(error){


console.error(error);


}



}






// ==============================================
// MOSTRAR TABLA
// ==============================================


function mostrarTabla(){


const tabla =
document.getElementById(
"tablaInspecciones"
);



tabla.innerHTML="";



inspecciones.forEach(item=>{


tabla.innerHTML += `


<tr>


<td>
${item.ID}
</td>


<td>
${item.Area}
</td>


<td>
${item.Inspector}
</td>


<td>
${item.Fecha}
</td>


<td>
${item.Tipo}
</td>


<td>


<button onclick="verDetalle(${item.ID})">

${item.Estado}

</button>


</td>



</tr>


`;


});


}






// ==============================================
// DETALLE DE INSPECCIÓN
// ==============================================


function verDetalle(id){


inspeccionSeleccionada =
inspecciones.find(
x=>x.ID===id
);



document.getElementById(
"modalDetalle"
)
.style.display="flex";



document.getElementById(
"detalleContenido"
)
.innerHTML=`


<h3>
${inspeccionSeleccionada.Area}
</h3>


<p>
Inspector:
${inspeccionSeleccionada.Inspector}
</p>


<p>
Estado:
${inspeccionSeleccionada.Estado}
</p>


<p>
Hallazgo:
${inspeccionSeleccionada.Hallazgo}
</p>


`;



}






// ==============================================
// ACTUALIZAR ESTADO
// ==============================================


async function actualizarEstado(id,estado){



let datos={


ID:id,


Estado:estado


};



await enviarMicrosoftLists(datos);



}






// ==============================================
// INDICADORES BÁSICOS
// ==============================================


function actualizarIndicadores(){


let total =
inspecciones.length;



let completas =
inspecciones.filter(
x=>x.Estado==="Completada"
).length;



let pendientes =
total-completas;



let porcentaje =
total>0
?
Math.round(
(completas/total)*100
)
:
0;



document.getElementById(
"totalInspecciones"
)
.innerHTML=total;



document.getElementById(
"inspeccionesCompletadas"
)
.innerHTML=completas;



document.getElementById(
"inspeccionesPendientes"
)
.innerHTML=pendientes;



document.getElementById(
"porcentajeCumplimiento"
)
.innerHTML=porcentaje+"%";


}






// ==============================================
// LIMPIAR FORMULARIO
// ==============================================


function limpiarFormulario(){



document
.querySelectorAll(
"input,textarea"
)
.forEach(e=>{

e.value="";

});



document
.querySelectorAll(
".criterio"
)
.forEach(e=>{

e.checked=false;

});



}






// ==============================================
// EXPORTACIÓN SIMPLE
// (Mientras no se conecta Excel)
// ==============================================


function exportarExcel(){


let datos =
JSON.stringify(
inspecciones,
null,
2
);



let archivo =
new Blob(
[datos],
{
type:"application/json"
}
);



let url =
URL.createObjectURL(
archivo
);



let link =
document.createElement("a");



link.href=url;


link.download=
"Inspecciones_Historico.json";


link.click();


}






// ==============================================
// MODAL
// ==============================================


function cerrarModal(){


document.getElementById(
"modalDetalle"
)
.style.display="none";


}






// ==============================================
// NOTIFICACIONES
// ==============================================


function mostrarNotificacion(texto){


let caja =
document.getElementById(
"notificacion"
);



caja.innerHTML=texto;


caja.style.display="block";



setTimeout(()=>{


caja.style.display="none";


},3000);



}





// ==============================================
// INICIO
// ==============================================


window.onload=function(){


cargarInspecciones();


};
