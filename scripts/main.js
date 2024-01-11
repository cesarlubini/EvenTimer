const listaEventos = document.querySelector('.eventosLista');
const botaoAdicionar = document.querySelector('.novoEventoAdicionar');

let eventos = [];

if(localStorage.hasOwnProperty('eventos')) {
  eventos = JSON.parse(localStorage.getItem('eventos'));
}

function montarListaEventos() {
  listaEventos.innerHTML = '';

  eventos.forEach(evento => {

    let html = `
      <li class="eventoLista-item">
        <div class="eventoLista-item__nome">${evento.nome}</div>
        <div class="eventoLista-item__data">${evento.data}</div>
      </li>
    `;

    listaEventos.innerHTML += html;
  })
}
// montarListaEventos();


botaoAdicionar.addEventListener('click', () => {
  const formulario = document.querySelector('.novoEvento-form');
  const eventoNome = formulario.querySelector('#novoEventoNome');
  const eventoData = formulario.querySelector('#novoEventoData');

  let evento = {
    nome: eventoNome.value,
    data: eventoData.value
  };

  eventos.push(evento);
  localStorage.setItem('eventos', JSON.stringify(eventos));

  eventoNome.value = '';
  eventoData.value = '';
  
  montarListaEventos();
})