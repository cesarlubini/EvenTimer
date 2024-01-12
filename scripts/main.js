const listaEventos = document.querySelector('.eventosLista');
const botaoAdicionar = document.querySelector('.novoEventoAdicionar');

let eventos = PegarLocalStorage('eventos') ?? [];
let eventosId = PegarLocalStorage('eventosId') ?? 0;

function PegarLocalStorage(campo) {
  if(localStorage.hasOwnProperty(campo)) {
    return JSON.parse(localStorage.getItem(campo));
  }
}

montarListaEventos();
function montarListaEventos() {
  listaEventos.innerHTML = '';

  eventos.forEach(evento => {

    let listaItem = document.createElement('li');
    listaItem.classList.add("eventoLista-item");
    listaItem.dataset.id = evento.id;

    let listaItemNome = document.createElement('div');
    listaItemNome.classList.add("eventoLista-item__nome");
    listaItemNome.textContent = evento.nome;

    let listaItemData = document.createElement('div');
    listaItemData.classList.add("eventoLista-item__data");
    listaItemData.textContent = evento.data;

    let listaItemDelete = document.createElement('button');
    listaItemDelete.classList.add("deletarEvento");
    listaItemDelete.textContent = "Deletar";
    botaoDeletarEvento(listaItemDelete);

    listaItem.appendChild(listaItemNome);
    listaItem.appendChild(listaItemData);
    listaItem.appendChild(listaItemDelete);

    listaEventos.appendChild(listaItem);
  })
}

function botaoDeletarEvento(botao) {
  botao.addEventListener('click', (event) => {
    event.stopPropagation();
    let liEvento = botao.closest('[data-id]');
    let liEventoId = liEvento.dataset.id;

    let eventosAtualizados = eventos.filter(evento => evento.id != liEventoId);
    eventos = eventosAtualizados;
    liEvento.remove();

    localStorage.setItem('eventos', JSON.stringify(eventosAtualizados));
  })
}

botaoAdicionar.addEventListener('click', () => {
  const formulario = document.querySelector('.novoEvento-form');
  const eventoNome = formulario.querySelector('#novoEventoNome');
  const eventoData = formulario.querySelector('#novoEventoData');

  let evento = {
    id: eventosId,
    nome: eventoNome.value,
    data: eventoData.value
  };

  eventos.push(evento);
  eventosId++;
  localStorage.setItem('eventos', JSON.stringify(eventos));
  localStorage.setItem('eventosId', JSON.stringify(eventosId));

  eventoNome.value = '';
  eventoData.value = '';
  
  montarListaEventos();
})

