const carrosModule = (function() {
    const carrosContainer = document.getElementById('carros-container');
    const carroModal = document.getElementById('carro-modal');
    const carroForm = document.getElementById('carro-form');
    const carroModalTitle = document.getElementById('carro-modal-title');
    const carroIdInput = document.getElementById('carro-id');
    const carroModelInput = document.getElementById('carro-model');
    const carrofabricanteInput = document.getElementById('carro-fabricante');
    const carroanoInput = document.getElementById('carro-ano');
    const carroColorInput = document.getElementById('carro-color');
    const carroprecoInput = document.getElementById('carro-preco');
    const carroportasInput = document.getElementById('carro-portas');
    const carrocombustivelInput = document.getElementById('carro-combustivel');
    function formatpreco(preco) {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(preco);
    }
    function formatColor(color) {
        return `<span class="vehicle-color-indicator" style="background-color: ${color};"></span>${color}`;
    }
    function getcombustivelTypeDisplay(combustivelType) {
        const combustivelTypes = {
            'gasolina': 'gasolina',
            'Etanol': 'Etanol',
            'diesel': 'Diesel',
            'flex': 'Flex'
        };
        return combustivelTypes[combustivelType] || combustivelType;
    }
    function createcarrocarrod(carro) {
        const carrod = document.createElement('div');
        carrod.className = 'vehicle-carrod';
        carrod.dataset.id = carro.id;
        carrod.innerHTML = `
            <div class="vehicle-header">
                <div class="vehicle-model">${carro.model}</div>
                <div class="vehicle-ano">${carro.ano}</div>
            </div>
            <div class="vehicle-body">
                <div class="vehicle-detail">
                    <span class="detail-label">fabricante:</span>
                    <span class="detail-value">${carro.fabricante}</span>
                </div>
                <div class="vehicle-detail">
                    <span class="detail-label">Color:</span>
                    <span class="detail-value">${formatColor(carro.color)}</span>
                </div>
                <div class="vehicle-detail">
                    <span class="detail-label">preco:</span>
                    <span class="detail-value preco-value">${formatpreco(carro.preco)}</span>
                </div>
                <div class="vehicle-detail">
                    <span class="detail-label">portas:</span>
                    <span class="detail-value">${carro.portas}</span>
                </div>
                <div class="vehicle-detail">
                    <span class="detail-label">combustivel Type:</span>
                    <span class="detail-value">${getcombustivelTypeDisplay(carro.combustivel)}</span>
                </div>
            </div>
            <div class="vehicle-actions">
                <button class="edit-btn" data-id="${carro.id}">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </button>
                <button class="delete-btn" data-id="${carro.id}">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete
                </button>
            </div>
        `;
        return carrod;
    }
    function rendercarros(carros) {
        carrosContainer.innerHTML = '';
        if (carros.length === 0) {
            carrosContainer.innerHTML = `
                <div class="no-vehicles">
                    <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" stroke-width="1" fill="none">
                        <path d="M19 7H5c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM5 7V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2M8 16.5h8M12 14v5"></path>
                    </svg>
                    <h3>No carros found</h3>
                    <p>Add your first carro by clicking the "Add carro" button</p>
                </div>
            `;
            return;
        }
        carros.forEach(carro => {
            const carrocarrod = createcarrocarrod(carro);
            carrosContainer.appendChild(carrocarrod);
        });
    }
    function resetForm() {
        carroForm.reset();
        carroIdInput.value = '';
        carroModalTitle.textContent = 'Add New carro';
        const errorElements = carroForm.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
        const inputElements = carroForm.querySelectorAll('input, select');
        inputElements.forEach(el => el.classList.remove('error'));
    }
    function openAddcarroModal() {
        resetForm();
        carroModal.classList.add('active');
        carroModelInput.focus();
    }
    function openEditcarroModal(id) {
        resetForm();
        const carro = Storage.getcarroById(id);
        if (carro) {
            carroIdInput.value = carro.id;
            carroModelInput.value = carro.model;
            carrofabricanteInput.value = carro.fabricante;
            carroanoInput.value = carro.ano;
            carroColorInput.value = carro.color;
            carroprecoInput.value = carro.preco;
            carroportasInput.value = carro.portas;
            carrocombustivelInput.value = carro.combustivel;
            carroModalTitle.textContent = 'Edit carro';
            carroModal.classList.add('active');
            carroModelInput.focus();
        } else {
            Notification.error('carro not found');
        }
    }
    function closecarroModal() {
        carroModal.classList.remove('active');
    }
    function handlecarroFormSubmit(e) {
        e.preventDefault();
        if (!Validation.validatecarroForm()) {
            return;
        }
        const carroId = carroIdInput.value;
        const isEditing = !!carroId;
        const carro = {
            model: carroModelInput.value,
            fabricante: carrofabricanteInput.value,
            ano: parseInt(carroanoInput.value),
            color: carroColorInput.value,
            preco: parseFloat(carroprecoInput.value),
            portas: parseInt(carroportasInput.value),
            combustivel: carrocombustivelInput.value
        };
        if (isEditing) {
            carro.id = carroId;
            const success = Storage.updatecarro(carro);
            if (success) {
                Notification.success('carro updated successfully');
                rendercarros(Storage.getcarros());
                closecarroModal();
            } else {
                Notification.error('Failed to update carro');
            }
        } else {
            const newcarro = Storage.addcarro(carro);
            Notification.success('carro added successfully');
            rendercarros(Storage.getcarros());
            closecarroModal();
        }
    }
    function init() {
        rendercarros(Storage.getcarros());
        Validation.setupcarroFormValidation();
        document.getElementById('add-carro-btn').addEventListener('click', openAddcarroModal);
        carroForm.addEventListener('submit', handlecarroFormSubmit);
        carroModal.querySelector('.close-btn').addEventListener('click', closecarroModal);
        carroModal.querySelector('.cancel-btn').addEventListener('click', closecarroModal);
        carrosContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.edit-btn, .delete-btn');
            if (!target) return;
            const id = target.dataset.id;
            if (target.classList.contains('edit-btn')) {
                openEditcarroModal(id);
            } else if (target.classList.contains('delete-btn')) {
                UI.openConfirmModal('carro', id);
            }
        });
    }
    return {
        init,
        rendercarros,
        closecarroModal
    };
})();