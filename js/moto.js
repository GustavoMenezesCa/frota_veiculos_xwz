const MotorcyclesModule = (function() {
    const motorcyclesContainer = document.getElementById('motorcycles-container');
    const motorcycleModal = document.getElementById('motorcycle-modal');
    const motorcycleForm = document.getElementById('motorcycle-form');
    const motorcycleModalTitle = document.getElementById('motorcycle-modal-title');
    const motorcycleIdInput = document.getElementById('motorcycle-id');
    const motorcycleModelInput = document.getElementById('motorcycle-model');
    const motorcycleManufacturerInput = document.getElementById('motorcycle-manufacturer');
    const motorcycleYearInput = document.getElementById('motorcycle-year');
    const motorcycleColorInput = document.getElementById('motorcycle-color');
    const motorcyclePriceInput = document.getElementById('motorcycle-price');
    const motorcycleEngineInput = document.getElementById('motorcycle-engine');
    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(price);
    }
    function formatColor(color) {
        return `<span class="vehicle-color-indicator" style="background-color: ${color};"></span>${color}`;
    }
    function createMotorcycleCard(motorcycle) {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.dataset.id = motorcycle.id;
        card.innerHTML = `
            <div class="vehicle-header">
                <div class="vehicle-model">${motorcycle.model}</div>
                <div class="vehicle-year">${motorcycle.year}</div>
            </div>
            <div class="vehicle-body">
                <div class="vehicle-detail">
                    <span class="detail-label">Manufacturer:</span>
                    <span class="detail-value">${motorcycle.manufacturer}</span>
                </div>
                <div class="vehicle-detail">
                    <span class="detail-label">Color:</span>
                    <span class="detail-value">${formatColor(motorcycle.color)}</span>
                </div>
                <div class="vehicle-detail">
                    <span class="detail-label">Price:</span>
                    <span class="detail-value price-value">${formatPrice(motorcycle.price)}</span>
                </div>
                <div class="vehicle-detail">
                    <span class="detail-label">Engine:</span>
                    <span class="detail-value">${motorcycle.engine} cc</span>
                </div>
            </div>
            <div class="vehicle-actions">
                <button class="edit-btn" data-id="${motorcycle.id}">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </button>
                <button class="delete-btn" data-id="${motorcycle.id}">
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
        return card;
    }
    function renderMotorcycles(motorcycles) {
        motorcyclesContainer.innerHTML = '';
        if (motorcycles.length === 0) {
            motorcyclesContainer.innerHTML = `
                <div class="no-vehicles">
                    <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" stroke-width="1" fill="none">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                    <h3>No motorcycles found</h3>
                    <p>Add your first motorcycle by clicking the "Add Motorcycle" button</p>
                </div>
            `;
            return;
        }
        motorcycles.forEach(motorcycle => {
            const motorcycleCard = createMotorcycleCard(motorcycle);
            motorcyclesContainer.appendChild(motorcycleCard);
        });
    }
    function resetForm() {
        motorcycleForm.reset();
        motorcycleIdInput.value = '';
        motorcycleModalTitle.textContent = 'Add New Motorcycle';
        const errorElements = motorcycleForm.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
        const inputElements = motorcycleForm.querySelectorAll('input, select');
        inputElements.forEach(el => el.classList.remove('error'));
    }
    function openAddMotorcycleModal() {
        resetForm();
        motorcycleModal.classList.add('active');
        motorcycleModelInput.focus();
    }
    function openEditMotorcycleModal(id) {
        resetForm();
        const motorcycle = Storage.getMotorcycleById(id);
        if (motorcycle) {
            motorcycleIdInput.value = motorcycle.id;
            motorcycleModelInput.value = motorcycle.model;
            motorcycleManufacturerInput.value = motorcycle.manufacturer;
            motorcycleYearInput.value = motorcycle.year;
            motorcycleColorInput.value = motorcycle.color;
            motorcyclePriceInput.value = motorcycle.price;
            motorcycleEngineInput.value = motorcycle.engine;
            motorcycleModalTitle.textContent = 'Edit Motorcycle';
            motorcycleModal.classList.add('active');
            motorcycleModelInput.focus();
        } else {
            Notification.error('Motorcycle not found');
        }
    }
    function closeMotorcycleModal() {
        motorcycleModal.classList.remove('active');
    }
    function handleMotorcycleFormSubmit(e) {
        e.preventDefault();
        if (!Validation.validateMotorcycleForm()) {
            return;
        }
        const motorcycleId = motorcycleIdInput.value;
        const isEditing = !!motorcycleId;
        const motorcycle = {
            model: motorcycleModelInput.value,
            manufacturer: motorcycleManufacturerInput.value,
            year: parseInt(motorcycleYearInput.value),
            color: motorcycleColorInput.value,
            price: parseFloat(motorcyclePriceInput.value),
            engine: parseInt(motorcycleEngineInput.value)
        };
        if (isEditing) {
            motorcycle.id = motorcycleId;
            const success = Storage.updateMotorcycle(motorcycle);
            if (success) {
                Notification.success('Motorcycle updated successfully');
                renderMotorcycles(Storage.getMotorcycles());
                closeMotorcycleModal();
            } else {
                Notification.error('Failed to update motorcycle');
            }
        } else {
            const newMotorcycle = Storage.addMotorcycle(motorcycle);
            Notification.success('Motorcycle added successfully');
            renderMotorcycles(Storage.getMotorcycles());
            closeMotorcycleModal();
        }
    }
    function init() {
        renderMotorcycles(Storage.getMotorcycles());
        Validation.setupMotorcycleFormValidation();
        document.getElementById('add-motorcycle-btn').addEventListener('click', openAddMotorcycleModal);
        motorcycleForm.addEventListener('submit', handleMotorcycleFormSubmit);
        motorcycleModal.querySelector('.close-btn').addEventListener('click', closeMotorcycleModal);
        motorcycleModal.querySelector('.cancel-btn').addEventListener('click', closeMotorcycleModal);
        motorcyclesContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.edit-btn, .delete-btn');
            if (!target) return;
            const id = target.dataset.id;
            if (target.classList.contains('edit-btn')) {
                openEditMotorcycleModal(id);
            } else if (target.classList.contains('delete-btn')) {
                UI.openConfirmModal('motorcycle', id);
            }
        });
    }
    return {
        init,
        renderMotorcycles,
        closeMotorcycleModal
    };
})();