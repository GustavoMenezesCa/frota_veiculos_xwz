// js/apiService.js

const API_BASE_URL = 'http://localhost:8080'; 

async function buscarTodosVeiculos() {
    try {
        console.log("ApiService: Buscando todos os veículos...");
        const resposta = await axios.get(`${API_BASE_URL}/veiculo/consultar/todos`);
        console.log("ApiService: Veículos recebidos:", resposta.data);
        return resposta.data || []; 
    } catch (erro) {
        console.error("ApiService: Erro ao buscar todos os veículos:", erro.response || erro.message);
        if (typeof ui !== 'undefined' && ui.mostrarNotificacao) {
            ui.mostrarNotificacao("Falha ao carregar lista de veículos do servidor.", "erro");
        } else {
            alert("Falha ao carregar lista de veículos do servidor.");
        }
        return [];
    }
}

async function buscarVeiculosFiltrados(filtros) {
    try {
        console.log("ApiService: Buscando veículos filtrados com filtros:", filtros);
        const params = new URLSearchParams();
        
        if (filtros.tipo) {
            params.append('tipo', filtros.tipo.toUpperCase()); 
        }
        if (filtros.modelo) {
            params.append('modelo', filtros.modelo);
        }
        if (filtros.cor) {
            params.append('cor', filtros.cor);
        }
        if (filtros.ano) {
            params.append('ano', filtros.ano);
        }

        const resposta = await axios.get(`${API_BASE_URL}/veiculo/consultar?${params.toString()}`);
        console.log("ApiService: Veículos filtrados recebidos:", resposta.data);
        return resposta.data || [];
    } catch (erro) {
        console.error("ApiService: Erro ao buscar veículos filtrados:", erro.response || erro.message);
        if (typeof ui !== 'undefined' && ui.mostrarNotificacao) {
            ui.mostrarNotificacao("Falha ao aplicar filtros e carregar veículos.", "erro");
        } else {
            alert("Falha ao aplicar filtros e carregar veículos.");
        }
        return [];
    }
}

async function buscarVeiculoPorId(idVeiculo) { 

    console.log(`ApiService: Tentando buscar veículo com ID [${idVeiculo}] (tipo: ${typeof idVeiculo}) via endpoint genérico...`);
    try {
        const endpoint = `${API_BASE_URL}/veiculo/consultar/${idVeiculo}`;

        console.log(`ApiService: URL construída para GET por ID: [${endpoint}]`);

        const resposta = await axios.get(endpoint);
        console.log(`ApiService: Veículo com ID ${idVeiculo} recebido:`, resposta.data);
        
        const dadosVeiculo = resposta.data;
        
        if (dadosVeiculo && dadosVeiculo.tipo_veiculo) {
            dadosVeiculo.tipo = dadosVeiculo.tipo_veiculo.toLowerCase(); 
        } else if (dadosVeiculo) {
            console.warn(`ApiService: Campo 'tipo_veiculo' não encontrado nos dados do veículo ID ${idVeiculo}. A UI pode ter dificuldades em determinar o tipo.`);

            if (dadosVeiculo.quantPortas !== undefined || dadosVeiculo.tipCombustivel !== undefined) {
                dadosVeiculo.tipo = 'carro';
            } else if (dadosVeiculo.cilindradas !== undefined) {
                dadosVeiculo.tipo = 'moto';
            } else {
                dadosVeiculo.tipo = '';
            }
        }
        
        return dadosVeiculo;
    } catch (erro) {
        console.error(`ApiService: Erro ao buscar veículo com ID ${idVeiculo}. URL tentada: ${API_BASE_URL}/veiculo/consultar/${idVeiculo}`, erro.response || erro.message);
        throw erro; 
    }
}

window.ApiService = {
    BASE_URL: API_BASE_URL,
    buscarTodosVeiculos,
    buscarVeiculosFiltrados,
    buscarVeiculoPorId
};