class VeiculoStorage {
  constructor() {
    this.chave = 'xwz_veiculos_v2'; 

    this.veiculos = this._carregarDoLocalStorage();
    console.log("VeiculoStorage: Instanciado com", this.veiculos.length, "veículos do localStorage.");
  }

  _carregarDoLocalStorage() {
    const veiculosJSON = localStorage.getItem(this.chave);
    if (!veiculosJSON) return [];
    try {
      return JSON.parse(veiculosJSON).map(v => {
        if (v.tipo === 'carro' && typeof Carro !== 'undefined') {

          const dataCadastro = v.dataCadastro ? new Date(v.dataCadastro) : new Date();
          const carro = new Carro(v.id, v.modelo, v.fabricante, v.ano, v.preco, v.cor, v.portas, v.combustivel);
          carro.dataCadastro = dataCadastro;
          return carro;
        } else if (v.tipo === 'moto' && typeof Moto !== 'undefined') {
          const dataCadastro = v.dataCadastro ? new Date(v.dataCadastro) : new Date();
          const moto = new Moto(v.id, v.modelo, v.fabricante, v.ano, v.preco, v.cor, v.cilindrada);
          moto.dataCadastro = dataCadastro;
          return moto;
        }
        console.warn("VeiculoStorage: Tipo de veículo desconhecido ou classe não definida ao carregar:", v);
        return v; 
      });
    } catch (e) {
      console.error('VeiculoStorage: Erro ao carregar/parsear veículos do localStorage:', e);
      return [];
    }
  }

  salvarVeiculos() {
    localStorage.setItem(this.chave, JSON.stringify(this.veiculos));
    console.log("VeiculoStorage: Veículos salvos no localStorage.");
  }

  adicionarVeiculo(veiculo) {

    let novoVeiculo;
    if (veiculo.tipo === 'carro' && !(veiculo instanceof Carro) && typeof Carro !== 'undefined') {
        novoVeiculo = new Carro(veiculo.id, veiculo.modelo, veiculo.fabricante, veiculo.ano, veiculo.preco, veiculo.cor, veiculo.portas, veiculo.combustivel);
    } else if (veiculo.tipo === 'moto' && !(veiculo instanceof Moto) && typeof Moto !== 'undefined') {
        novoVeiculo = new Moto(veiculo.id, veiculo.modelo, veiculo.fabricante, veiculo.ano, veiculo.preco, veiculo.cor, veiculo.cilindrada);
    } else {
        novoVeiculo = veiculo; 
    }

  
    if (!novoVeiculo.id) {
        novoVeiculo.id = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!novoVeiculo.dataCadastro) {
        novoVeiculo.dataCadastro = new Date();
    }


    this.veiculos.push(novoVeiculo);
    this.salvarVeiculos();
    console.log("VeiculoStorage: Veículo adicionado:", novoVeiculo);
    return novoVeiculo;
  }

  atualizarVeiculo(veiculoAtualizado) {
    const index = this.veiculos.findIndex(v => v.id === veiculoAtualizado.id);
    if (index !== -1) {
      this.veiculos[index] = veiculoAtualizado;
      this.salvarVeiculos();
      console.log("VeiculoStorage: Veículo atualizado:", veiculoAtualizado);
      return true;
    }
    console.warn("VeiculoStorage: Veículo não encontrado para atualização, ID:", veiculoAtualizado.id);
    return false;
  }

  removerVeiculo(id) {
    const tamanhoOriginal = this.veiculos.length;
    this.veiculos = this.veiculos.filter(v => v.id !== id);
    if (this.veiculos.length < tamanhoOriginal) {
      this.salvarVeiculos();
      console.log("VeiculoStorage: Veículo removido, ID:", id);
      return true;
    }
    console.warn("VeiculoStorage: Veículo não encontrado para remoção, ID:", id);
    return false;
  }

  obterVeiculoPorId(id) {
    return this.veiculos.find(v => v.id === id);
  }

  obterVeiculos() {

    return [...this.veiculos];
  }

  filtrarVeiculos(filtros) {
    console.log("VeiculoStorage: Filtrando com:", filtros);
    return this.veiculos.filter(veiculo => {
      if (filtros.tipo && veiculo.tipo !== filtros.tipo) return false;
      if (filtros.modelo && !veiculo.modelo.toLowerCase().includes(filtros.modelo.toLowerCase())) return false;
      if (filtros.cor && !veiculo.cor.toLowerCase().includes(filtros.cor.toLowerCase())) return false;
      if (filtros.ano && veiculo.ano !== parseInt(filtros.ano)) return false;
      return true;
    });
  }
}

const storage = new VeiculoStorage();