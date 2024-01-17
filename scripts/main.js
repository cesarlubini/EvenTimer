const listaEventos = document.querySelector('.eventosLista');
const formulario = document.querySelector('.novoEvento-form');
const eventoNome = formulario.querySelector('#novoEventoNome');
const eventoData = formulario.querySelector('#novoEventoData');
const botaoAdicionar = document.querySelector('.novoEventoAdicionar');

// -------------------------- //

let eventos = PegarLocalStorage('eventos') ?? [];
let eventosId = PegarLocalStorage('eventosId') ?? 0;

montarListaEventos();
// teste
converterData('2024-01-27');

botaoAdicionar.addEventListener('click', (e) => adicionarEvento(e));
formulario.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    adicionarEvento(e);
  }
});

// -------------------------- //

function PegarLocalStorage(campo) {
  if(localStorage.hasOwnProperty(campo)) {
    return JSON.parse(localStorage.getItem(campo));
  }
}

function montarEvento(evento) {

  let listaItem = document.createElement('li');
  listaItem.classList.add("eventoLista-item");
  listaItem.dataset.id = evento.id;

  let listaItemCabecalho = document.createElement('div');
  listaItemCabecalho.classList.add('eventoLista-item__cabecalho');

  let listaItemNome = document.createElement('div');
  listaItemNome.classList.add("eventoLista-item__nome");
  listaItemNome.textContent = evento.nome;

  let listaItemData = document.createElement('div');
  listaItemData.classList.add("eventoLista-item__data");
  listaItemData.textContent = converterData(evento.data);

  let listaItemCorpo = document.createElement('div');
  listaItemCorpo.classList.add('eventoLista-item__corpo');

  let listaItemCronometro = document.createElement('div');
  listaItemCronometro.classList.add('cronometro');
  listaItemCronometro.textContent = "00d : 00h : 00m : 00s";

  let listaItemEditar = document.createElement('div');
  listaItemEditar.classList.add("editarEvento");
  listaItemEditar.style.background = "url(../assets/icons/editar.svg) no-repeat center";

  let listaItemDelete = document.createElement('div');
  listaItemDelete.classList.add("deletarEvento");
  listaItemDelete.style.background = "url(../assets/icons/deletar.svg) no-repeat center";
  botaoDeletarEvento(listaItemDelete);

  listaItemCabecalho.appendChild(listaItemNome);
  listaItemCabecalho.appendChild(listaItemData);

  listaItemCorpo.appendChild(listaItemCronometro);
  listaItemCorpo.appendChild(listaItemEditar);
  listaItemCorpo.appendChild(listaItemDelete);

  listaItem.appendChild(listaItemCabecalho);
  listaItem.appendChild(listaItemCorpo);

  return listaItem;
}

function montarListaEventos() {
  if (eventos.length == 0) {
    listaEventos.innerHTML = 'Nenhum evento cadastrado.';
  } else {
    listaEventos.innerHTML = '';
  }

  eventos.forEach(evento => {
    listaEventos.appendChild(montarEvento(evento));
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

function adicionarEvento(e) {
  e.preventDefault();

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
  
  //ajuste para adicionar placeholder no <input type="data"/>
  eventoData.type = 'text';
  
  listaEventos.appendChild(montarEvento(evento));
}

function converterData(dataEvento) {

  let dataEventoArray = dataEvento.split('-');
  const data = new Date(dataEventoArray[0], dataEventoArray[1] - 1, dataEventoArray[2]);

  let dataConvertida = [];
  dataConvertida.push(
    ("0" + data.getDate()).slice(-2),
    ("0" + (data.getMonth() + 1)).slice(-2),
    (data.getFullYear()).toString().slice(-2)
  );
  
  let dataConvertidaRetorno = dataConvertida.join('/');

  return dataConvertidaRetorno;
}