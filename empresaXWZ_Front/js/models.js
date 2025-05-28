class Veiculo {
  constructor(id, modelo, fabricante, ano, preco, cor, tipo) {
    this.id = id || `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Gera ID se não fornecido
    this.modelo = modelo;
    this.fabricante = fabricante;
    this.ano = parseInt(ano) || 0;
    this.preco = parseFloat(preco) || 0;
    this.cor = cor;
    this.tipo = tipo; 
    this.dataCadastro = new Date();
    this.emoji = tipo === 'carro' ? '🚗' : (tipo === 'moto' ? '🏍️' : '❓');
  }
}

class Carro extends Veiculo {
  constructor(id, modelo, fabricante, ano, preco, cor, portas, combustivel) {
    super(id, modelo, fabricante, ano, preco, cor, 'carro');
    this.portas = parseInt(portas) || 0;
    this.combustivel = combustivel;
  }
}

class Moto extends Veiculo {
  constructor(id, modelo, fabricante, ano, preco, cor, cilindrada) {
    super(id, modelo, fabricante, ano, preco, cor, 'moto');
    this.cilindrada = parseInt(cilindrada) || 0;
  }
}