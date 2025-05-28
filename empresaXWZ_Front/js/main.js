document.addEventListener('DOMContentLoaded', async () => {
    console.log("main.js: DOMContentLoaded (Conteúdo do DOM Carregado).");

    if (typeof ui === 'undefined' || 
        typeof eventManager === 'undefined' || 
        typeof ApiService === 'undefined') {
        console.error("main.js: Dependências críticas (ui, eventManager, ApiService) não definidas! Verifique a ordem dos scripts e suas instanciações.");
        document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top: 50px;'>Erro Crítico na Inicialização do Aplicativo. Verifique o console do navegador.</h1>";
        return;
    }
    
    if (typeof eventManager.inicializar === 'function') {
        eventManager.inicializar();
    } else {
        console.error("main.js: eventManager.inicializar não é uma função. Não foi possível configurar os eventos.");
        ui.mostrarNotificacao("Erro crítico: Não foi possível configurar os eventos da página.", "erro", 0);
        return;
    }

    console.log("main.js: Carregando veículos iniciais do BACKEND...");
    try {
        await eventManager.recarregarErenderizarVeiculosDaAPI();

        const veiculosAtuaisNaTela = document.querySelectorAll('.card-veiculo').length;
        if (veiculosAtuaisNaTela === 0 && typeof storage !== 'undefined' && storage.obterVeiculos && storage.obterVeiculos().length === 0) {
            if (typeof ui.inicializarDadosExemplo === 'function') {
                console.log("main.js: Backend e localStorage parecem vazios. Tentando inicializar dados de exemplo no localStorage (se implementado).");
                ui.inicializarDadosExemplo(); 
            }
        }

    } catch (erro) {
        console.error("main.js: Erro durante o carregamento inicial dos veículos.", erro);
        ui.mostrarNotificacao("Falha ao carregar dados iniciais dos veículos. Verifique a conexão com o servidor.", "erro", 0);
    }

    console.log("main.js: Inicialização do aplicativo concluída.");
});