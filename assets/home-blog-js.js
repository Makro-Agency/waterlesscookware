// Home-Blog Post section by customize select blog and recepies direct.

document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.home-blog-posts .tab-titles li');
    const panels = document.querySelectorAll('.home-blog-posts .tab-panel');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        // Remove active class from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
    
        // Add active class to the clicked tab and corresponding panel
        this.classList.add('active');
        var tab_id = this.querySelector('a').getAttribute('data-tab');
        document.getElementById(tab_id).classList.add('active');
      });
    });
    });
    
    