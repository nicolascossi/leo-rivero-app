const url = 'http://localhost:4000/'

function generarIdUnico() {
    const max = 9999;
    const min = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  

  const nuevaNota = document.getElementById('nueva-nota')
  nuevaNota.addEventListener('click', guardarNotas);

  
  function guardarNotas() {
      const nota = document.getElementById('nota').value;
  
    
      const nuevoNota = {
      nota: nota,
      };
  
    
      const urlApi = `${url}notas`;
    
      fetch(urlApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoNota)
      })
        .then(response => response.json())
        .then(result => {
          console.error(result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
  
    }



document.addEventListener('DOMContentLoaded', function() {
    const url = 'http://localhost:4000/';
  
    consultarNotas();
  
    function consultarNotas() {
        const urlApi = `${url}notas`;
      
        fetch(urlApi)
          .then(respuesta => {
            if (!respuesta.ok) {
              console.error('Error en la solicitud:', respuesta.status);
              return [];
            }
            return respuesta.json();
          })
          .then(resultado => {
            console.log('Datos recibidos:', resultado);
            if (resultado && resultado.length > 0) {
              mostrarNotas(resultado);
            } else {
              console.error('No se encontraron notas o los datos son inválidos.');
            }
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
          });
    }
    

    
    function eliminarNota(id) {
        const urlApi = `${url}notas/${id}`;
        console.log(`Eliminando la nota ${id}`);
        fetch(urlApi, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log(`Nota con ID ${id} eliminada correctamente.`);
                // Puedes realizar otras acciones aquí después de eliminar con éxito.
            } else {
                console.error(`Error al eliminar la nota con ID ${id}.`);
            }
        })
        .catch(error => {
            console.error('Error al eliminar la nota:', error);
        });
    }
  
    function mostrarNotas(notas) {
        const container = document.querySelector('.notes-list');
    
        // Limpia el contenedor antes de agregar nuevas notas para evitar duplicados
        container.innerHTML = '';
    
        notas.forEach(nota => {
            const divNota = document.createElement('div');
            divNota.classList.add('nota');
    
            const divNota1 = document.createElement('div');
            divNota1.classList.add('note-in-note');
    
            const notaElement = document.createElement('p');
            notaElement.textContent = nota.nota;
    
            const divButtonNota = document.createElement('div');
            divButtonNota.classList.add('button-eliminar-nota');
    
            const deleteNote = document.createElement('button');
            deleteNote.classList.add('client-button');
            deleteNote.classList.add('BorrarNota'); // Asegúrate de que la clase se llama "BorrarNota"
            deleteNote.textContent = 'X';
            deleteNote.setAttribute('data-note-id', nota.id);
    
            divNota.appendChild(divNota1);
            divNota1.appendChild(notaElement);
    
            divNota.appendChild(divButtonNota);
            divButtonNota.appendChild(deleteNote);
    
            container.appendChild(divNota);
        });

        // Seleccionar todos los botones de eliminación por la clase "BorrarNota" después de agregarlos
        const botonesEliminar = document.querySelectorAll('.BorrarNota');
    
        // Asociar la función eliminarNota a cada botón
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', () => {
                const id = boton.getAttribute('data-note-id');
                eliminarNota(id);
            });
        });
    }
});

