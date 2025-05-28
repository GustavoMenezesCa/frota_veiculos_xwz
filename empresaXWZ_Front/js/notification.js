const Notification = (function() {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeBtn = document.querySelector('.close-notification');
    
    let timeoutId = null;
    
    /**
      @param {string} message -
      @param {string} type 
      @param {number} duration 
     */
    function show(message, type, duration = 3000) {
        notificationMessage.textContent = message;
        
        
        notification.classList.remove('success', 'error');
        
        
        notification.classList.add(type);
        notification.classList.add('active');
        
        
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        
        timeoutId = setTimeout(() => {
            hide();
        }, duration);
    }
    
    function hide() {
        notification.classList.remove('active');
    }
    
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hide);
    }
    
    
    return {
        success: function(message, duration) {
            show(message, 'success', duration);
        },
        
        error: function(message, duration) {
            show(message, 'error', duration);
        }
    };
})();