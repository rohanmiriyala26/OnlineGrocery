document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav ul li a');
  
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'scale(1.1)';
      });
  
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'scale(1)';
      });
    });
  
    const logo = document.querySelector('.logo');
    
    logo.addEventListener('click', () => {
      window.location.href = '/';
    });
  });
  