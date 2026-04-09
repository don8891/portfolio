console.log("Portfolio loaded with new theme.");

// Smooth scrolling functionality
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Project Filtering logic
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // remove active class from all
    filterBtns.forEach(b => b.classList.remove('active'));
    // add active class to clicked
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      if (filter === 'all') {
        card.style.display = 'block';
      } else {
        const categories = card.getAttribute('data-category').split(' ');
        if (categories.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      }
    });
  });
});
