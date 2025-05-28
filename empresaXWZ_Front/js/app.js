document.addEventListener('DOMContentLoaded', function() {
    console.log("app.js: DOMContentLoaded disparado.");

    try {
        if (typeof initializeSampleData === 'function') {
            initializeSampleData();
        } else {
            console.warn("app.js: Função 'initializeSampleData' não está definida. Verifique se ela está neste arquivo ou importada.");
        }
    } catch (e) {
        console.error("app.js: Erro ao tentar chamar initializeSampleData:", e);
    }

    try {
        if (typeof ui !== 'undefined' && typeof ui.mostrarVeiculos === 'function' && typeof storage !== 'undefined' && typeof storage.obterVeiculos === 'function') {
            console.log("app.js: Carregando e mostrando veículos iniciais...");
            ui.mostrarVeiculos(storage.obterVeiculos());
        } else {
            console.warn("app.js: 'ui.mostrarVeiculos' ou 'storage.obterVeiculos' não estão definidos. A lista inicial de veículos pode não ser carregada.");
        }

        if (typeof eventManager !== 'undefined' && typeof eventManager.inicializar === 'function') {
            console.log("app.js: Inicializando EventManager...");
            eventManager.inicializar();
        } else {
            console.error("app.js: Objeto 'eventManager' ou 'eventManager.inicializar' não está definido. Verifique a ordem dos scripts e a instanciação em events.js.");
        }

    } catch (e) {
        console.error("app.js: Erro durante a inicialização da UI ou EventManager:", e);
    }

    console.log("app.js: Inicialização do aplicativo concluída.");
});

function initializeSampleData() {
    console.log("app.js: Chamando initializeSampleData...");
    try {
        if (typeof Storage === 'undefined' ||
            (typeof storage === 'undefined' ||
             typeof storage.obterVeiculos !== 'function' ||
             typeof storage.adicionarVeiculo !== 'function') ||
            typeof Carro === 'undefined' ||
            typeof Moto === 'undefined') {
            console.error("app.js: initializeSampleData - Dependências (Storage, Carro, Moto) não estão definidas. Verifique a ordem dos scripts e o conteúdo dos arquivos.");
            return;
        }

        const veiculos = storage.obterVeiculos();
        console.log("app.js: initializeSampleData - Veículos atuais no storage:", veiculos.length);

        if (veiculos.length === 0) {
            console.log("app.js: Nenhum veículo no storage, adicionando dados de exemplo...");
            const exemplos = [
                new Carro(null, 'Civic', 'Honda', 2023, 150000, 'Prata', 4, 'flex'),
                new Carro(null, 'Onix', 'Chevrolet', 2022, 92000, 'Preto', 4, 'flex'),
                new Moto(null, 'CB 500', 'Honda', 2021, 45000, 'Vermelha', 500),
                new Carro(null, 'Ranger', 'Ford', 2023, 210000, 'Branco', 4, 'diesel'),
                new Moto(null, 'XJ6', 'Yamaha', 2020, 55000, 'Azul', 600)
            ];

            exemplos.forEach(veiculo => {
                storage.adicionarVeiculo(veiculo);
            });
            console.log("app.js: Dados de exemplo inicializados no localStorage.");
        } else {
            console.log("app.js: Dados já existem no localStorage, não foram adicionados dados de exemplo.");
        }
    } catch (e) {
        console.error("app.js: Erro dentro de initializeSampleData:", e);
    }
}
