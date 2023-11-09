import { getNotes, createNote, deleteNote } from "./services/notes.js";

const refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', function() {
      location.reload();
    });
    

    
document.addEventListener('DOMContentLoaded', function () {
  
  const agregarNotaBtn = document.getElementById('nueva-nota')
  agregarNotaBtn.addEventListener('click', async ( ) => {

    const nota = document.getElementById('nota').value

    const nuevaNota = {
      note: nota
    }

    await createNote(nuevaNota)
  } )

  getNotes()
      .then((response) => {
          const data = response.data;
          mostrarNotas(data);
      })
      .catch((error) => {
          console.error(error);
          // Manejar el error según sea necesario
      });

  function mostrarNotas(data) {
      const container = document.querySelector('.notes-list');

      // Limpia el contenedor antes de agregar nuevas notas para evitar duplicados
      container.innerHTML = '';

      data.forEach(nota => {
          const divNota = document.createElement('div');
          divNota.classList.add('nota');

          const divNota1 = document.createElement('div');
          divNota1.classList.add('note-in-note');

          const notaElement = document.createElement('p');
          notaElement.textContent = nota.note;

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
          boton.addEventListener('click', (event) => {
              const id = event.currentTarget.dataset.noteId;
              console.log(id)
              deleteNote(id);
          });
      });
  }


});