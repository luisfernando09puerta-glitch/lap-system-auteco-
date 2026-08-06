// ======================================
// SISTEMA DE AUTOMATIZACIÓN DE INSPECCIONES
// Lógica principal de funcionamiento
// ======================================


// Base de datos local inicial

let inspecciones = JSON.parse(localStorage.getItem("inspecciones")) || [];

let inspeccionActual = null;



// ======================================
// CREAR INSPECCIÓN
// ======================================

function crearInspeccion(){


    let area = document.getElementById("area").value;
    let inspector = document.getElementById("inspector").value;
    let fecha = document.getElementById("fecha").value;
    let tipo = document.getElementById("tipo").value;



    if(area === "" || inspector === "" || fecha === ""){

        mostrarNotificacion(
            "Complete todos los campos obligatorios"
        );

        return;

    }



    let nuevaInspeccion = {


        id: Date.now(),

        area:area,

        inspector:inspector,

        fecha:fecha,

        tipo:tipo,


        estado:"Pendiente",


        checklist:[],


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


        evidencias:0,


        fechaCreacion:new Date().toLocaleString()

    };




    // Capturar checklist


    let criterios =
    document.querySelectorAll(".criterio");



    criterios.forEach(item=>{


        nuevaInspeccion.checklist.push({

            criterio:item.parentElement.innerText,

            cumplimiento:item.checked

        });


    });




    inspecciones.push(nuevaInspeccion);



    guardarDatos();



    cargarTabla();



    actualizarIndicadores();



    limpiarFormulario();



    mostrarNotificacion(
        "Inspección creada correctamente"
    );


}





// ======================================
// GUARDAR DATOS LOCAL STORAGE
// ======================================


function guardarDatos(){

    localStorage.setItem(
        "inspecciones",
        JSON.stringify(inspecciones)
    );

}





// ======================================
// MOSTRAR TABLA
// ======================================


function cargarTabla(){


    let tabla =
    document.getElementById(
        "tablaInspecciones"
    );



    tabla.innerHTML="";



    inspecciones.forEach(ins=>{


        let fila=document.createElement("tr");



        fila.innerHTML=`

        <td>${ins.id}</td>

        <td>${ins.area}</td>

        <td>${ins.inspector}</td>

        <td>${ins.fecha}</td>

        <td>${ins.tipo}</td>


        <td>

        <button onclick="verDetalle(${ins.id})">

        ${ins.estado}

        </button>


        </td>

        `;



        tabla.appendChild(fila);


    });



}






// ======================================
// DETALLE INSPECCIÓN
// ======================================


function verDetalle(id){


    let inspeccion =
    inspecciones.find(
        x=>x.id===id
    );



    inspeccionActual=id;



    let contenido =
    document.getElementById(
        "detalleContenido"
    );



    contenido.innerHTML=`


    <h3>
    Área:
    ${inspeccion.area}
    </h3>


    <p>
    Inspector:
    ${inspeccion.inspector}
    </p>


    <p>
    Tipo:
    ${inspeccion.tipo}
    </p>


    <p>
    Estado:
    ${inspeccion.estado}
    </p>



    <h4>
    Checklist
    </h4>


    ${

    inspeccion.checklist.map(c=>`

    <p>
    ${c.criterio}
    :
    ${c.cumplimiento ? "✔ Cumple":"✘ No cumple"}

    </p>

    `).join("")

    }



    <button onclick="cerrarInspeccion()">

    Cerrar Inspección

    </button>


    `;



    document.getElementById(
        "modalDetalle"
    ).style.display="flex";


}





// ======================================
// CERRAR INSPECCIÓN
// ======================================


function cerrarInspeccion(){


    let inspeccion =
    inspecciones.find(
        x=>x.id===inspeccionActual
    );



    if(inspeccion){


        inspeccion.estado="Completada";


        guardarDatos();


        cargarTabla();


        actualizarIndicadores();


        cerrarModal();


        mostrarNotificacion(
            "Inspección cerrada"
        );


    }


}






// ======================================
// FINALIZAR INSPECCIÓN
// ======================================


function finalizarInspeccion(){


    let criterios =
    document.querySelectorAll(".criterio");



    let completos=0;



    criterios.forEach(c=>{

        if(c.checked){

            completos++;

        }

    });



    if(completos===criterios.length){

        mostrarNotificacion(
            "Checklist completo"
        );

    }

    else{

        mostrarNotificacion(
            "Hay criterios pendientes"
        );

    }



}






// ======================================
// INDICADORES
// ======================================


function actualizarIndicadores(){



    let total =
    inspecciones.length;



    let completas =
    inspecciones.filter(
        x=>x.estado==="Completada"
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
    ).innerText=total;



    document.getElementById(
        "inspeccionesCompletadas"
    ).innerText=completas;



    document.getElementById(
        "inspeccionesPendientes"
    ).innerText=pendientes;



    document.getElementById(
        "porcentajeCumplimiento"
    ).innerText=porcentaje+"%";



    document.getElementById(
        "textoCumplimiento"
    ).innerText=porcentaje+"%";



    document.getElementById(
        "barraCumplimiento"
    ).style.width=porcentaje+"%";



}





// ======================================
// EXPORTAR A EXCEL CSV
// ======================================


function exportarExcel(){


    let csv =
    "ID,Area,Inspector,Fecha,Tipo,Estado\n";



    inspecciones.forEach(i=>{


        csv +=
        `${i.id},${i.area},${i.inspector},${i.fecha},${i.tipo},${i.estado}\n`;


    });



    let blob =
    new Blob(
        [csv],
        {
            type:"text/csv"
        }
    );



    let url =
    URL.createObjectURL(blob);



    let enlace =
    document.createElement("a");



    enlace.href=url;


    enlace.download=
    "inspecciones.csv";



    enlace.click();


}





// ======================================
// REPORTE SIMPLE
// ======================================


function generarReporte(){


    alert(

    "Reporte generado con "+
    inspecciones.length+
    " inspecciones registradas"

    );


}






// ======================================
// LIMPIAR FORMULARIO
// ======================================


function limpiarFormulario(){


document.getElementById("area").value="";

document.getElementById("inspector").value="";

document.getElementById("fecha").value="";

document.getElementById("hallazgo").value="";

document.getElementById("responsable").value="";

document.getElementById("observaciones").value="";


document.querySelectorAll(".criterio")
.forEach(c=>c.checked=false);



}







// ======================================
// MODAL
// ======================================


function cerrarModal(){

document.getElementById(
"modalDetalle"
).style.display="none";


}







// ======================================
// NOTIFICACIONES
// ======================================


function mostrarNotificacion(texto){


let caja =
document.getElementById(
"notificacion"
);



caja.innerText=texto;


caja.style.display="block";



setTimeout(()=>{


caja.style.display="none";


},3000);



}






// ======================================
// CARGA INICIAL
// ======================================


window.onload=function(){


    cargarTabla();

    actualizarIndicadores();


};
