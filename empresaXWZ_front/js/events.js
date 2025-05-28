// js/events.js

class EventManager {
  constructor() {
    this.btnCadastrar = document.getElementById('btn-cadastrar');
    this.btnFiltrar = document.getElementById('btn-filtrar');
    this.painelFiltros = document.querySelector('.filtros');
    this.listaVeiculos = document.querySelector('.lista-veiculos');

    this.filtroTipoSelect = document.getElementById('filtro-tipo');
    this.filtroModeloInput = document.getElementById('filtro-modelo');
    this.filtroCorInput = document.getElementById('filtro-cor');
    this.filtroAnoInput = document.getElementById('filtro-ano');
    this.btnLimparFiltros = document.getElementById('limpar-filtros');

    this.formVeiculo = document.getElementById('form-veiculo');
    this.tipoVeiculoSelectForm = document.getElementById('tipo-veiculo');
    this.btnCancelarForm = document.getElementById('cancelar-form');

    this.modalFormulario = document.getElementById('modal-formulario');
    this.modalConfirmacao = document.getElementById('modal-confirmacao');
    this.botoesFechaModal = document.querySelectorAll('.fechar-modal');

    this.btnConfirmarExclusao = document.getElementById('confirmar-exclusao');
    this.btnCancelarExclusao = document.getElementById('cancelar-exclusao');
    console.log("EventManager: Instanciado.");
  }

  inicializar() {
    console.log("EventManager: Inicializando ouvintes de eventos...");
    
    if (this.btnFiltrar && this.painelFiltros) this.btnFiltrar.addEventListener('click', () => this.painelFiltros.classList.toggle('ativo'));
    
    document.addEventListener('click', (e) => {
      if (this.painelFiltros && this.painelFiltros.classList.contains('ativo') &&
          !e.target.closest('.filtros-container') && !e.target.matches('#btn-filtrar')) {
        this.painelFiltros.classList.remove('ativo');
      }
    });

    if (this.btnCadastrar) this.btnCadastrar.addEventListener('click', () => ui.prepararFormularioAdicao());
    if (this.tipoVeiculoSelectForm) this.tipoVeiculoSelectForm.addEventListener('change', (e) => ui.alternarCamposPorTipo(e.target.value));
    if (this.formVeiculo) this.formVeiculo.addEventListener('submit', this.handleSubmitForm.bind(this));
    if (this.btnCancelarForm && this.modalFormulario) this.btnCancelarForm.addEventListener('click', () => ui.fecharModal(this.modalFormulario));
    
    const aplicarFiltrosDebounced = this.debounce(this.aplicarFiltros.bind(this), 400);
    if (this.filtroTipoSelect) this.filtroTipoSelect.addEventListener('change', aplicarFiltrosDebounced);
    if (this.filtroModeloInput) this.filtroModeloInput.addEventListener('input', aplicarFiltrosDebounced);
    if (this.filtroCorInput) this.filtroCorInput.addEventListener('input', aplicarFiltrosDebounced);
    if (this.filtroAnoInput) this.filtroAnoInput.addEventListener('input', aplicarFiltrosDebounced);
    
    if (this.btnLimparFiltros) this.btnLimparFiltros.addEventListener('click', () => {
      ui.limparFiltros(); 
      this.aplicarFiltros(); 
      if (this.painelFiltros) this.painelFiltros.classList.remove('ativo');
    });

    if (this.listaVeiculos) this.listaVeiculos.addEventListener('click', this.handleCardActions.bind(this));
    
    this.botoesFechaModal.forEach(btn => btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal'); 
      if (modal) ui.fecharModal(modal);
    }));

    if (this.btnConfirmarExclusao && this.modalConfirmacao) this.btnConfirmarExclusao.addEventListener('click', this.handleConfirmarExclusao.bind(this));
    if (this.btnCancelarExclusao && this.modalConfirmacao) this.btnCancelarExclusao.addEventListener('click', () => ui.fecharModal(this.modalConfirmacao));
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.ativo').forEach(modal => ui.fecharModal(modal));
        if (this.painelFiltros && this.painelFiltros.classList.contains('ativo')) {
            this.painelFiltros.classList.remove('ativo');
        }
      }
    });
    console.log("EventManager: Ouvintes de eventos inicializados.");
  }

  debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  async recarregarErenderizarVeiculosDaAPI() {
    console.log("EventManager: Recarregando e renderizando veículos do backend...");
    if (typeof ui !== 'undefined' && typeof ApiService !== 'undefined' && typeof ApiService.buscarTodosVeiculos === 'function') {
        try {
            const veiculos = await ApiService.buscarTodosVeiculos();
            ui.mostrarVeiculos(veiculos);
        } catch (erro) {
            console.error("EventManager: Erro ao recarregar e renderizar veículos da API.", erro);
        }
    } else {
        console.error("recarregarErenderizarVeiculosDaAPI: ui ou ApiService.buscarTodosVeiculos não definidos.");
        if (typeof ui !== 'undefined' && ui.mostrarNotificacao) {
            ui.mostrarNotificacao("Erro crítico ao tentar recarregar veículos. Verifique o console.", "erro");
        }
    }
  }

  async handleSubmitForm(e) {
    e.preventDefault();
    console.log("EventManager.handleSubmitForm: Formulário submetido.");

    if (!this.formVeiculo.checkValidity()) {
        this.formVeiculo.reportValidity();
        ui.mostrarNotificacao("Por favor, preencha todos os campos obrigatórios.", "aviso");
        return;
    }

    const tipoVeiculo = this.tipoVeiculoSelectForm.value;
    const idVeiculo = document.getElementById('id-veiculo').value;

    const dadosParaBackend = {
        modelo: document.getElementById('modelo').value,
        fabricante: document.getElementById('fabricante').value,
        ano: parseInt(document.getElementById('ano').value),
        preco: parseFloat(document.getElementById('preco').value),
        cor: document.getElementById('cor').value,
    };

    let endpointUrl = '';
    let tipoParaMensagem = '';
    let metodoHttp = idVeiculo ? 'PUT' : 'POST';

    if (tipoVeiculo === 'carro') {
      const quantidadePortasInput = document.getElementById('portas').value;
      let tipoCombustivel = document.getElementById('combustivel').value;
      
      if (!quantidadePortasInput || !tipoCombustivel) {
        ui.mostrarNotificacao("Para carros, preencha Quantidade de Portas e Tipo de Combustível.", "aviso"); return;
      }
      dadosParaBackend.quantidadePortas = parseInt(quantidadePortasInput);
      dadosParaBackend.tipoCombustivel = tipoCombustivel.toUpperCase();
      
      endpointUrl = idVeiculo ? `${ApiService.BASE_URL}/carro/atualizarVeiculo/${idVeiculo}` : `${ApiService.BASE_URL}/carro/cadastro`;
      tipoParaMensagem = 'Carro';
    } else if (tipoVeiculo === 'moto') {
      const cilindradaInput = document.getElementById('cilindrada').value;
      if (!cilindradaInput) {
        ui.mostrarNotificacao("Para motos, preencha a Cilindrada.", "aviso"); return;
      }
      dadosParaBackend.cilindradas = parseInt(cilindradaInput);

      endpointUrl = idVeiculo ? `${ApiService.BASE_URL}/moto/atualizarMoto/${idVeiculo}` : `${ApiService.BASE_URL}/moto/cadastro`;
      tipoParaMensagem = 'Moto';
    } else {
      ui.mostrarNotificacao("Tipo de veículo inválido. Por favor, selecione 'Carro' ou 'Moto'.", "erro"); return;
    }

    console.log(`EventManager: ${metodoHttp} para ${tipoParaMensagem} em ${endpointUrl} com dados:`, dadosParaBackend);

    try {
      let resposta;
      if (metodoHttp === 'POST') {
        resposta = await axios.post(endpointUrl, dadosParaBackend);
      } else { 
        resposta = await axios.put(endpointUrl, dadosParaBackend);
      }
      
      console.log(`EventManager: Resposta do backend (${metodoHttp} ${tipoParaMensagem}):`, resposta.data);
      ui.mostrarNotificacao(`${tipoParaMensagem} "${resposta.data.modelo || 'desconhecido'}" ${idVeiculo ? 'atualizado' : 'cadastrado'} com sucesso!`, 'sucesso');
      ui.fecharModal(this.modalFormulario);
      await this.recarregarErenderizarVeiculosDaAPI();

    } catch (erro) {
      this.handleApiError(erro, `${idVeiculo ? 'atualizar' : 'cadastrar'} ${tipoParaMensagem.toLowerCase()}`);
    }
  }

  async handleConfirmarExclusao(e) {
    const idParaDeletar = e.target.dataset.id;
    if (!idParaDeletar) {
      ui.mostrarNotificacao("Erro: ID do veículo não especificado para exclusão.", "erro"); return;
    }
    console.log(`EventManager: Confirmada exclusão para veículo ID: ${idParaDeletar}`);
    const urlDelecao = `${ApiService.BASE_URL}/veiculo/excluir/${idParaDeletar}`;

    try {
      const resposta = await axios.delete(urlDelecao);
      if (resposta.status === 204 || resposta.status === 200) {
        ui.mostrarNotificacao(`Veículo (ID: ${idParaDeletar}) deletado com sucesso!`, 'sucesso');
        await this.recarregarErenderizarVeiculosDaAPI();
      } else {
        ui.mostrarNotificacao(`Erro ao deletar veículo: ${resposta.statusText || 'Resposta inesperada do servidor.'}`, 'erro');
      }
    } catch (erro) {
      this.handleApiError(erro, `deletar veículo (ID: ${idParaDeletar})`);
    }
    ui.fecharModal(this.modalConfirmacao);
  }

  async handleCardActions(e) {
    const cardElement = e.target.closest('.card-veiculo');
    if (!cardElement) return;
    
    let veiculoIdBruto = cardElement.dataset.id;
    const tipoDoCard = cardElement.dataset.tipo; 

    if (e.target.classList.contains('btn-editar')) {
        if (!veiculoIdBruto) {
            ui.mostrarNotificacao("Não foi possível identificar o veículo para edição (ID não encontrado no card).", "aviso");
            console.warn("HandleCardActions (Editar): ID do card não encontrado.", cardElement.dataset);
            return;
        }

        const veiculoIdLimpo = String(veiculoIdBruto).split(':')[0];
        console.log(`HandleCardActions (Editar): ID bruto do card: "${veiculoIdBruto}", ID limpo: "${veiculoIdLimpo}"`);


        try {
            ui.mostrarNotificacao("Carregando dados do veículo para edição...", "info", 2000);
            const veiculoDaApi = await ApiService.buscarVeiculoPorId(veiculoIdLimpo); 
            
            if (veiculoDaApi && veiculoDaApi.tipo) {
                ui.prepararFormularioEdicao(veiculoDaApi);
            } else if (veiculoDaApi && !veiculoDaApi.tipo) {
                ui.mostrarNotificacao("Dados do veículo carregados, mas o tipo não pôde ser determinado. Formulário pode não estar correto.", "aviso");
                ui.prepararFormularioEdicao(veiculoDaApi);
            } else {
                 ui.mostrarNotificacao("Não foi possível carregar os dados do veículo para edição. Veículo não encontrado.", "erro");
            }
        } catch (erro) {
            console.error(`EventManager: Falha ao buscar veículo ID ${veiculoIdLimpo} para edição.`, erro.message);
            ui.mostrarNotificacao(`Erro ao carregar dados do veículo (ID: ${veiculoIdLimpo}) para edição. Verifique o console.`, "erro");
        }
    } else if (e.target.classList.contains('btn-excluir')) {
        const idLimpoParaExclusao = String(veiculoIdBruto).split(':')[0];
        const tipoParaMensagem = tipoDoCard || 'veículo';
        ui.prepararConfirmacaoExclusao(idLimpoParaExclusao, tipoParaMensagem);
    }
  }

  async aplicarFiltros() {
    console.log("EventManager: Aplicando filtros...");
    const filtros = ui.obterFiltros();
    let veiculosParaMostrar;
    const temFiltro = Object.values(filtros).some(valor => valor !== '' && valor !== null && valor !== undefined && String(valor).trim() !== '');

    try {
        if (temFiltro) {
            console.log("EventManager: Filtros aplicados:", filtros);
            veiculosParaMostrar = await ApiService.buscarVeiculosFiltrados(filtros);
        } else {
            console.log("EventManager: Nenhum filtro aplicado, buscando todos os veículos.");
            veiculosParaMostrar = await ApiService.buscarTodosVeiculos();
        }
        ui.mostrarVeiculos(veiculosParaMostrar);
        if (temFiltro && veiculosParaMostrar.length === 0) {
            ui.mostrarNotificacao("Nenhum veículo encontrado com os filtros aplicados.", "info");
        }
    } catch (erro) {
        console.error("EventManager: Erro ao aplicar filtros ou buscar todos os veículos.", erro);
    }
  }

  handleApiError(error, acao = "operação") {
    console.error(`EventManager: Erro ao ${acao}:`, error);
    let mensagemErro = `Falha ao ${acao}.`;
    if (error.response) {
        mensagemErro += ` Status: ${error.response.status}.`;
        if (error.response.data) {
            if (typeof error.response.data === 'string') mensagemErro += ` Detalhes: ${error.response.data}`;
            else if (error.response.data.message) mensagemErro += ` Detalhes: ${error.response.data.message}`;
            else if (error.response.data.error) mensagemErro += ` Erro: ${error.response.data.error}`;
            else if (error.response.statusText) mensagemErro += ` ${error.response.statusText}`;
        } else if (error.response.statusText) {
            mensagemErro += ` ${error.response.statusText}`;
        }
    } else if (error.request) {
        mensagemErro += ' Sem resposta do servidor. Verifique a conexão e se o backend está rodando.';
    } else {
        mensagemErro += ` Erro na requisição: ${error.message}`;
    }
    ui.mostrarNotificacao(mensagemErro, 'erro');
  }
}

const eventManager = new EventManager();