// js/ui.js

class UI {
  constructor() {
    this.listaVeiculos = document.querySelector('.lista-veiculos');
    this.modalFormulario = document.getElementById('modal-formulario');
    this.modalConfirmacao = document.getElementById('modal-confirmacao');
    this.formVeiculo = document.getElementById('form-veiculo');
    this.idVeiculoInput = document.getElementById('id-veiculo');
    this.tipoVeiculoSelect = document.getElementById('tipo-veiculo');
    this.camposCarroDiv = document.getElementById('campos-carro');
    this.camposMotoDiv = document.getElementById('campos-moto');
    this.tituloFormularioH2 = document.getElementById('titulo-formulario');

    this.filtroTipoSelect = document.getElementById('filtro-tipo');
    this.filtroModeloInput = document.getElementById('filtro-modelo');
    this.filtroCorInput = document.getElementById('filtro-cor');
    this.filtroAnoInput = document.getElementById('filtro-ano');

    this.notificationElement = document.getElementById('notification');
    this.notificationMessageElement = document.getElementById('notification-message');
    this.closeNotificationButton = this.notificationElement ? this.notificationElement.querySelector('.close-notification') : null;

    if (this.closeNotificationButton) {
      this.closeNotificationButton.addEventListener('click', () => {
        if (this.notificationElement) this.notificationElement.classList.remove('active');
      });
    }
    console.log("UI: Instanciada. Elemento listaVeiculos:", this.listaVeiculos);
  }

  mostrarVeiculos(veiculos) {
    if (!this.listaVeiculos) {
      console.error("UI.mostrarVeiculos: Elemento .lista-veiculos não encontrado no DOM.");
      return;
    }
    this.listaVeiculos.innerHTML = '';
    if (!veiculos || veiculos.length === 0) {
      this.listaVeiculos.innerHTML = `<div class="sem-veiculos" style="text-align:center; padding: 20px;"><p>Nenhum veículo encontrado.</p></div>`;
      return;
    }
    veiculos.forEach(veiculo => {
      if (veiculo && (veiculo.id !== undefined && veiculo.id !== null)) {
        const card = this.criarCardVeiculo(veiculo);
        this.listaVeiculos.appendChild(card);
      } else {
        console.warn("UI.mostrarVeiculos: Item inválido ou sem ID na lista de veículos:", veiculo);
      }
    });
  }

  criarCardVeiculo(veiculo) {
    const card = document.createElement('div');
    card.className = 'card-veiculo';
    card.dataset.id = veiculo.id; 

    const formatarMoeda = (valor) => (typeof valor === 'number' && !isNaN(valor)) ? `R$ ${valor.toFixed(2).replace('.', ',')}` : 'N/A';
    const formatarCombustivel = (comb) => comb ? comb.charAt(0).toUpperCase() + comb.slice(1).toLowerCase() : 'N/A';
    const formatarCilindrada = (cc) => (typeof cc === 'number' && !isNaN(cc)) ? `${cc} cc` : 'N/A';

    let tipoVeiculoReal = '';
    let emojiDoVeiculo = '❓';

    let tipoOrigem = null;
    if (veiculo.tipo_veiculo) {
        tipoOrigem = String(veiculo.tipo_veiculo).toLowerCase();
    } else if (veiculo.tipo) {
        tipoOrigem = String(veiculo.tipo).toLowerCase();
    }

    if (tipoOrigem === 'carro') {
        tipoVeiculoReal = 'carro';
    } else if (tipoOrigem === 'moto') {
        tipoVeiculoReal = 'moto';
    }

    if (!tipoVeiculoReal) {
        if (veiculo.quantPortas !== undefined || veiculo.tipCombustivel !== undefined) {
            tipoVeiculoReal = 'carro';
        } else if (veiculo.cilindradas !== undefined) {
            tipoVeiculoReal = 'moto';
        }
    }

    if (tipoVeiculoReal === 'carro') emojiDoVeiculo = '🚗';
    else if (tipoVeiculoReal === 'moto') emojiDoVeiculo = '🏍️';
    
    card.dataset.tipo = tipoVeiculoReal;

    const tipoDisplay = tipoVeiculoReal ? tipoVeiculoReal.charAt(0).toUpperCase() + tipoVeiculoReal.slice(1) : 'Veículo';

    let infoEspecifica = '';
    if (tipoVeiculoReal === 'carro') {
      infoEspecifica = `
        <div class="card-info"><span class="rotulo">Portas:</span><span class="valor">${veiculo.quantPortas || 'N/A'}</span></div>
        <div class="card-info"><span class="rotulo">Combustível:</span><span class="valor">${formatarCombustivel(veiculo.tipCombustivel)}</span></div>`;
    } else if (tipoVeiculoReal === 'moto') {
      infoEspecifica = `
        <div class="card-info"><span class="rotulo">Cilindrada:</span><span class="valor">${formatarCilindrada(veiculo.cilindradas)}</span></div>`;
    }
    
    const corHtml = (veiculo.cor && veiculo.cor.trim() !== '') ? `<div class="card-info"><span class="rotulo">Cor:</span><span class="valor">${veiculo.cor}</span></div>` : '';

    card.innerHTML = `
      <div class="card-cabecalho">
        <h3><span class="emoji">${emojiDoVeiculo}</span> ${veiculo.modelo || 'N/A'}</h3>
        <span class="tipo">${tipoDisplay}</span>
      </div>
      <div class="card-conteudo">
        <div class="card-info"><span class="rotulo">Fabricante:</span><span class="valor">${veiculo.fabricante || 'N/A'}</span></div>
        <div class="card-info"><span class="rotulo">Ano:</span><span class="valor">${veiculo.ano || 'N/A'}</span></div>
        <div class="card-info"><span class="rotulo">Preço:</span><span class="valor">${formatarMoeda(veiculo.preco)}</span></div>
        ${corHtml}
        ${infoEspecifica}
      </div>
      <div class="card-acoes">
        <button class="btn btn-primario btn-editar">Editar</button>
        <button class="btn btn-perigo btn-excluir">Excluir</button>
      </div>`;
    return card;
  }

  prepararFormularioAdicao() {
    if (!this.modalFormulario || !this.formVeiculo || !this.tituloFormularioH2 || !this.idVeiculoInput || !this.tipoVeiculoSelect) {
      console.error("UI.prepararFormularioAdicao: Elementos do formulário não encontrados."); return;
    }
    this.tituloFormularioH2.textContent = 'Cadastrar Veículo';
    this.formVeiculo.reset();
    this.idVeiculoInput.value = '';
    this.tipoVeiculoSelect.value = '';
    this.tipoVeiculoSelect.disabled = false;
    this.alternarCamposPorTipo('');
    this.abrirModal(this.modalFormulario);
  }

  prepararFormularioEdicao(veiculo) {
    if (!this.modalFormulario || !this.formVeiculo || !this.tituloFormularioH2 || !this.idVeiculoInput || !this.tipoVeiculoSelect) {
      console.error("UI.prepararFormularioEdicao: Elementos do formulário não encontrados."); return;
    }
    this.tituloFormularioH2.textContent = 'Editar Veículo';
    this.formVeiculo.reset();

    this.idVeiculoInput.value = veiculo.id || '';
    
    const tipoParaForm = veiculo.tipo || ''; 

    if (!tipoParaForm) {
        console.warn("UI.prepararFormularioEdicao: Tipo do veículo não determinado a partir dos dados da API.", veiculo);
    }

    this.tipoVeiculoSelect.value = tipoParaForm;
    this.tipoVeiculoSelect.disabled = true; 

    document.getElementById('modelo').value = veiculo.modelo || '';
    document.getElementById('fabricante').value = veiculo.fabricante || '';
    document.getElementById('ano').value = veiculo.ano || '';
    document.getElementById('preco').value = veiculo.preco || '';
    document.getElementById('cor').value = veiculo.cor || '';

    this.alternarCamposPorTipo(tipoParaForm);

    if (tipoParaForm === 'carro') {
      document.getElementById('portas').value = veiculo.quantPortas || ''; 
      document.getElementById('combustivel').value = veiculo.tipCombustivel || ''; 
    } else if (tipoParaForm === 'moto') {
      document.getElementById('cilindrada').value = veiculo.cilindradas || '';
    }
    this.abrirModal(this.modalFormulario);
  }

  alternarCamposPorTipo(tipo) {
    if (!this.camposCarroDiv || !this.camposMotoDiv) {
      console.error("UI.alternarCamposPorTipo: Divs de campos específicos não encontradas."); return;
    }
    const portasInput = document.getElementById('portas');
    const combustivelSelect = document.getElementById('combustivel');
    const cilindradaInput = document.getElementById('cilindrada');

    this.camposCarroDiv.style.display = (tipo === 'carro') ? 'block' : 'none';
    this.camposMotoDiv.style.display = (tipo === 'moto') ? 'block' : 'none';

    if (portasInput) portasInput.required = (tipo === 'carro');
    if (combustivelSelect) combustivelSelect.required = (tipo === 'carro');
    if (cilindradaInput) cilindradaInput.required = (tipo === 'moto');
  }

  prepararConfirmacaoExclusao(id, tipoVeiculoCard = 'veículo') {
    const btnConfirmar = document.getElementById('confirmar-exclusao');
    const pMensagem = this.modalConfirmacao ? this.modalConfirmacao.querySelector('p#mensagem-confirmacao') || this.modalConfirmacao.querySelector('p') : null;
    
    if (!btnConfirmar || !this.modalConfirmacao || !pMensagem) {
      console.error("UI.prepararConfirmacaoExclusao: Elementos do modal de confirmação não encontrados."); return;
    }
    btnConfirmar.dataset.id = id;
    const tipoDisplay = tipoVeiculoCard ? tipoVeiculoCard.charAt(0).toUpperCase() + tipoVeiculoCard.slice(1) : "Veículo";
    pMensagem.textContent = `Tem certeza que deseja excluir este ${tipoDisplay.toLowerCase()} (ID: ${id})?`;
    this.abrirModal(this.modalConfirmacao);
  }

  abrirModal(modal) {
    if (modal) {
      modal.style.display = 'flex'; 
      setTimeout(() => modal.classList.add('ativo'), 10); 
      document.body.style.overflow = 'hidden';
    } else { console.warn("UI.abrirModal: Tentativa de abrir modal nulo."); }
  }

  fecharModal(modal) {
    if (modal) {
      modal.classList.remove('ativo');
      setTimeout(() => {
          if (!modal.classList.contains('ativo')) { 
            modal.style.display = 'none';
          }
      }, 300); 
      document.body.style.overflow = 'auto';
    } else { console.warn("UI.fecharModal: Tentativa de fechar modal nulo."); }
  }

  obterFiltros() {
    return {
      tipo: this.filtroTipoSelect ? this.filtroTipoSelect.value : '',
      modelo: this.filtroModeloInput ? this.filtroModeloInput.value.trim() : '',
      cor: this.filtroCorInput ? this.filtroCorInput.value.trim() : '',
      ano: this.filtroAnoInput && this.filtroAnoInput.value ? parseInt(this.filtroAnoInput.value) : ''
    };
  }

  limparFiltros() {
    if (this.filtroTipoSelect) this.filtroTipoSelect.value = '';
    if (this.filtroModeloInput) this.filtroModeloInput.value = '';
    if (this.filtroCorInput) this.filtroCorInput.value = '';
    if (this.filtroAnoInput) this.filtroAnoInput.value = '';
    console.log("UI: Filtros limpos no formulário.");
  }

  mostrarNotificacao(mensagem, tipo = 'info', duracao = 3500) {
    console.log(`UI: mostrarNotificacao chamada com: "${mensagem}", tipo: ${tipo}`);
    if (this.notificationElement && this.notificationMessageElement) {
      this.notificationMessageElement.textContent = mensagem;
      this.notificationElement.className = 'notification'; 
      this.notificationElement.classList.add(tipo); 
      
      this.notificationElement.style.display = 'block'; 
      void this.notificationElement.offsetWidth; 

      this.notificationElement.classList.add('active');

      if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
      
      if (duracao > 0) {
        this.notificationTimeout = setTimeout(() => {
          if (this.notificationElement) this.notificationElement.classList.remove('active');
        }, duracao);
      }
    } else {
      console.warn("UI: Elementos de notificação não encontrados no DOM. Usando alert como fallback.");
      alert(`${tipo.toUpperCase()}: ${mensagem}`);
    }
  }

  inicializarDadosExemplo() {
    console.log("UI: inicializarDadosExemplo chamada.");
  }
}

const ui = new UI();