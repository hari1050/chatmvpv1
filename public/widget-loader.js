// public/widget-loader.js
(function() {
  window.__ChatWidget = {
    init: function(config) {
      // Get base URL from the script tag that loaded this file
      const scriptTag = document.currentScript || document.querySelector('script[src*="widget-loader.js"]');
      const baseUrl = scriptTag.src.split('/widget-loader.js')[0];
      
      // Create widget button
      const button = document.createElement('button');
      button.id = '__chat-widget-button';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
      
      // Create widget container
      const container = document.createElement('div');
      container.id = '__chat-widget-container';
      
      // Add styles
      const styles = document.createElement('style');
      styles.textContent = `
        #__chat-widget-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background-color: ${config.settings?.primaryColor || '#ffc107'};
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s;
          z-index: 9999;
        }
        #__chat-widget-button:hover {
          transform: scale(1.05);
        }
        #__chat-widget-button svg {
          color: white;
        }
        #__chat-widget-container {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 400px;
          height: 600px;
          background: transparent;
          z-index: 9999;
          display: none;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.2);
        }
        #__chat-widget-container.visible {
          display: block;
        }
        #__chat-widget-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `;
      
      document.head.appendChild(styles);
      
      // Create iframe using the same origin as the script
      const iframe = document.createElement('iframe');
      iframe.src = `${baseUrl}/widget/${config.chatbotId}`;
      container.appendChild(iframe);
      
      // Toggle widget visibility
      button.addEventListener('click', function() {
        container.classList.toggle('visible');
      });
      
      // Close widget when clicking outside
      document.addEventListener('click', function(e) {
        if (!container.contains(e.target) && !button.contains(e.target)) {
          container.classList.remove('visible');
        }
      });
      
      // Add elements to page
      document.body.appendChild(button);
      document.body.appendChild(container);
    }
  };
})();