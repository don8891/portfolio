console.log("Welcome to my portfolio!");

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document
      .querySelector(link.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});
