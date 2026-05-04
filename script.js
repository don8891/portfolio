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

// Hide logo on down scroll
const navLogo = document.querySelector('.logo');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navLogo.style.opacity = '0';
    navLogo.style.pointerEvents = 'none';
  } else {
    navLogo.style.opacity = '1';
    navLogo.style.pointerEvents = 'auto';
  }
});

// Contact Form Modal Logic
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalCloseBtn = document.querySelector('.modal-close-btn');

function handleFormSubmit(event, form) {
  // Prevent default logic is not strictly needed because target="hidden_iframe"
  // but we can show the modal immediately
  successModal.style.display = 'flex';
  
  // Reset the form after a short delay
  setTimeout(() => {
    form.reset();
  }, 500);
}

// Close modal when X is clicked
closeModalBtn.addEventListener('click', () => {
  successModal.style.display = 'none';
});

// Close modal when Awesome button is clicked
modalCloseBtn.addEventListener('click', () => {
  successModal.style.display = 'none';
});

// Close modal if user clicks outside of it
window.addEventListener('click', (e) => {
  if (e.target === successModal) {
    successModal.style.display = 'none';
  }
});
