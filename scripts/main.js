const listaEventos = document.querySelector('.eventosLista');
const semEventos = document.querySelector('.sem-eventos');
const formulario = document.querySelector('.salvarEditarEvento-form');
const eventoNome = formulario.querySelector('#salvarEditarEventoNome');
const eventoData = formulario.querySelector('#salvarEditarEventoData');
const botaoForm = document.querySelector('[data-action]');
const divMensagem = document.querySelector('.mensagem');

// -------------------------- //

let eventos = PegarLocalStorage('eventos') ?? [];
let eventosId = PegarLocalStorage('eventosId') ?? 0;
let eventoEditadoObjeto = '';
let countdown;

montarListaEventos();

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const acao = botaoForm.getAttribute('data-action');

  if (acao == 'adicionar') {
    adicionarEvento();
    mostrarMensagem("adicionar");
  } else if (acao == 'editar') {
    salvarEventoEditado(eventoEditadoObjeto);
    mostrarMensagem("editar");
  }
});

// -------------------------- //

function PegarLocalStorage(campo) {
  if(localStorage.hasOwnProperty(campo)) {
    return JSON.parse(localStorage.getItem(campo));
  }
}

function verificarListaVazia() {
  if (eventos.length == 0) {
    semEventos.classList.remove('esconder');
  } else {
    semEventos.classList.add('esconder');
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
  listaItemCronometro.innerHTML = construirTimerHTML();

  let listaItemOpcoes = document.createElement('div');
  listaItemOpcoes.classList.add("evento-opcoes");

  let listaItemEditar = document.createElement('button');
  listaItemEditar.classList.add("editarEvento");
  let listaItemEditarIcon = document.createElement('i');
  listaItemEditarIcon.classList.add("icon","fa-solid","fa-pencil");
  listaItemEditar.appendChild(listaItemEditarIcon);
  editarEvento(listaItemEditar);

  let listaItemDelete = document.createElement('button');
  listaItemDelete.classList.add("deletarEvento");
  let listaItemDeletarIcon = document.createElement('i');
  listaItemDeletarIcon.classList.add("icon","fa-regular","fa-trash-can");
  listaItemDelete.appendChild(listaItemDeletarIcon);
  deletarEvento(listaItemDelete);

  listaItemCabecalho.appendChild(listaItemNome);
  listaItemCabecalho.appendChild(listaItemData);
  
  listaItemOpcoes.appendChild(listaItemEditar);
  listaItemOpcoes.appendChild(listaItemDelete);
  
  listaItemCorpo.appendChild(listaItemCronometro);
  listaItemCorpo.appendChild(listaItemOpcoes);

  listaItem.appendChild(listaItemCabecalho);
  listaItem.appendChild(listaItemCorpo);

  return listaItem;
}

function montarListaEventos() {
  verificarListaVazia()

  eventos.forEach(evento => {
    listaEventos.appendChild(montarEvento(evento));
    contagemRegressiva(evento);
  })
}

function deletarEvento(botao) {
  botao.addEventListener('click', (event) => {
    event.preventDefault();
    let liEvento = botao.closest('[data-id]');
    let liEventoId = liEvento.dataset.id;

    let eventosAtualizados = eventos.filter(evento => evento.id != liEventoId);
    eventos = eventosAtualizados;
    liEvento.remove();
    mostrarMensagem("excluir");

    localStorage.setItem('eventos', JSON.stringify(eventosAtualizados));

    verificarListaVazia()
  })
}

function adicionarEvento() {

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

  listaEventos.appendChild(montarEvento(evento));
  
  contagemRegressiva(evento);
  verificarListaVazia();
}

function editarEvento(botao) {
  botao.addEventListener('click', (event) => {
    event.preventDefault();

    let eventoEditadoId = botao.closest('[data-id]').dataset.id;
    eventoEditadoObjeto = eventos.find(evento => evento.id == eventoEditadoId);

    eventoNome.value = eventoEditadoObjeto.nome;
    eventoData.value = eventoEditadoObjeto.data;

    botaoForm.setAttribute('data-action', 'editar');
    botaoForm.textContent = 'Salvar';
  })
}

function salvarEventoEditado(eventoObjeto) {

  const eventoItemEditado = document.querySelector(`[data-id="${eventoObjeto.id}"]`);
  const eventoItemEditadoNome = eventoItemEditado.querySelector('.eventoLista-item__nome');
  const eventoItemEditadoData = eventoItemEditado.querySelector('.eventoLista-item__data');

  eventoItemEditadoNome.textContent = eventoNome.value;
  eventoItemEditadoData.textContent = converterData(eventoData.value);

  eventoObjeto.nome = eventoNome.value;
  eventoObjeto.data = eventoData.value;

  // Esse if deveria estar dentro da função contagemRegressiva, mas não sei como fazer
  if(countdown) {
    clearInterval(countdown);
  }
  contagemRegressiva(eventoObjeto);

  let eventosAtualizados = eventos.map(evento => {
    if (evento.id == eventoObjeto.id) {
      return {...evento, ...eventoObjeto};
    }
    return evento;
  })

  eventos = eventosAtualizados;
  localStorage.setItem('eventos', JSON.stringify(eventos));

  eventoNome.value = '';
  eventoData.value = '';

  botaoForm.setAttribute('data-action', 'adicionar');
  botaoForm.textContent = 'Adicionar';
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

const mensagensParaUsuario = {
  'adicionar' : 'Seu evento foi adicionado!',
  'editar' : 'Seu evento foi editado!',
  'excluir' : 'Seu evento foi excluído!'
}

function mostrarMensagem(acao) {
  divMensagem.textContent = ""

  let mensagemParaMostrar = mensagensParaUsuario[acao];
  
  divMensagem.textContent = mensagemParaMostrar;
  divMensagem.style.bottom = "0";
  
  setTimeout(() => {
    divMensagem.style.bottom = "-64px";
  },1500);
}