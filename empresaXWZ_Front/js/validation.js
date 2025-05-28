const Validation = (function() {
    const ERROR_MESSAGES = {
        required: 'Este campo é obrigatório',
        minLength: (min) => `Deve ter pelo menos ${min} carroacteres`,
        maxLength: (max) => `Deve ter no máximo ${max} carroacteres`,
        minValue: (min) => `O valor deve ser pelo menos ${min}`,
        maxValue: (max) => `O valor deve ser no máximo ${max}`,
        pattern: (pattern) => `Formato inválido`,
        anoRange: 'O ano deve estar entre 1900 e 2099'
    };

    /**
     * @param {HTMLElement} field 
     * @param {Object} rules 
     * @returns {string|null} 
     */
    function validateField(field, rules) {
        const value = field.value.trim();
        
        
        if (rules.required && !value) {
            return ERROR_MESSAGES.required;
        }
        
        
        if (!value && !rules.required) {
            return null;
        }
        
        
        if (rules.minLength && value.length < rules.minLength) {
            return ERROR_MESSAGES.minLength(rules.minLength);
        }
        
        
        if (rules.maxLength && value.length > rules.maxLength) {
            return ERROR_MESSAGES.maxLength(rules.maxLength);
        }
        
        
        if (rules.pattern && !rules.pattern.test(value)) {
            return ERROR_MESSAGES.pattern(rules.pattern);
        }
        
        
        if (field.type === 'number') {
            const numValue = parseFloat(value);
            
            
            if (rules.min !== undefined && numValue < rules.min) {
                return ERROR_MESSAGES.minValue(rules.min);
            }
            
            
            if (rules.max !== undefined && numValue > rules.max) {
                return ERROR_MESSAGES.maxValue(rules.max);
            }
            
            
            if (field.id.includes('ano')) {
                const ano = parseInt(value);
                if (ano < 1900 || ano > 2099) {
                    return ERROR_MESSAGES.anoRange;
                }
            }
        }
        
        return null;
    }
    /**
     * @param {string} fieldId 
     * @param {string|null} errorMessage 
     */
    function displayError(fieldId, errorMessage) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = errorMessage || '';
            
            if (errorMessage) {
                inputElement.classList.add('error');
            } else {
                inputElement.classList.remove('error');
            }
        }
    }
    
    /**
     * @param {string} formId 
     * @param {Object} validationRules 
     * @returns {boolean} 
     */
    function validateForm(formId, validationRules) {
        const form = document.getElementById(formId);
        let isValid = true;
        
        for (const fieldId in validationRules) {
            const field = document.getElementById(fieldId);
            const rules = validationRules[fieldId];
            
            const errorMessage = validateField(field, rules);
            displayError(fieldId, errorMessage);
            
            if (errorMessage) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    
    function setupLiveValidation(formId, validationRules) {
        const form = document.getElementById(formId);
        
        if (!form) return;
        
        for (const fieldId in validationRules) {
            const field = document.getElementById(fieldId);
            const rules = validationRules[fieldId];
            
            field.addEventListener('blur', function() {
                const errorMessage = validateField(this, rules);
                displayError(fieldId, errorMessage);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    const errorMessage = validateField(this, rules);
                    displayError(fieldId, errorMessage);
                }
            });
        }
    }
    
    
    return {
        validatecarroForm: function() {
            const rules = {
                'carro-model': { required: true, minLength: 2, maxLength: 50 },
                'carro-fabricante': { required: true, minLength: 2, maxLength: 50 },
                'carro-ano': { required: true, min: 1900, max: 2099 },
                'carro-color': { required: true },
                'carro-preco': { required: true, min: 0 },
                'carro-portas': { required: true, min: 2, max: 5 },
                'carro-combustivel': { required: true }
            };
            
            return validateForm('carro-form', rules);
        },
        
        validatemotoForm: function() {
            const rules = {
                'moto-model': { required: true, minLength: 2, maxLength: 50 },
                'moto-fabricante': { required: true, minLength: 2, maxLength: 50 },
                'moto-ano': { required: true, min: 1900, max: 2099 },
                'moto-color': { required: true },
                'moto-preco': { required: true, min: 0 },
                'moto-engine': { required: true, min: 50 }
            };
            
            return validateForm('moto-form', rules);
        },
        
        setupcarroFormValidation: function() {
            const rules = {
                'carro-model': { required: true, minLength: 2, maxLength: 50 },
                'carro-fabricante': { required: true, minLength: 2, maxLength: 50 },
                'carro-ano': { required: true, min: 1900, max: 2099 },
                'carro-color': { required: true },
                'carro-preco': { required: true, min: 0 },
                'carro-portas': { required: true, min: 2, max: 5 },
                'carro-combustivel': { required: true }
            };
            
            setupLiveValidation('carro-form', rules);
        },
        
        setupmotoFormValidation: function() {
            const rules = {
                'moto-model': { required: true, minLength: 2, maxLength: 50 },
                'moto-fabricante': { required: true, minLength: 2, maxLength: 50 },
                'moto-ano': { required: true, min: 1900, max: 2099 },
                'moto-color': { required: true },
                'moto-preco': { required: true, min: 0 },
                'moto-engine': { required: true, min: 50 }
            };
            
            setupLiveValidation('moto-form', rules);
        }
    };
})();