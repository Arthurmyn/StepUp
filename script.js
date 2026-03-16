document.addEventListener('DOMContentLoaded', () => {
  // ===== Navigation =====
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  burger?.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Scroll Reveal =====
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Counter Animation =====
  const numberItems = document.querySelectorAll('.number-item');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    numberItems.forEach(item => {
      const valueEl = item.querySelector('.number-item__value');
      const suffixEl = item.querySelector('.number-item__suffix');
      const target = parseFloat(valueEl.dataset.target || 0);
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = target * eased;

        if (target % 1 !== 0) {
          valueEl.textContent = current.toFixed(1);
        } else {
          valueEl.textContent = Math.round(current);
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          valueEl.textContent = target % 1 !== 0 ? target.toFixed(1) : target;
        }
      };

      requestAnimationFrame(update);
    });
    countersAnimated = true;
  };

  const numbersSection = document.getElementById('numbers');
  if (numbersSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateCounters();
      });
    }, { threshold: 0.3 });

    counterObserver.observe(numbersSection);
  }

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq__item').forEach(item => {
    const question = item.querySelector('.faq__question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ===== Order Modal (тарифы) =====
  const WHATSAPP_NUMBER = '77001234567'; // Замените на реальный номер (без +)
  const modal = document.getElementById('orderModal');
  const modalOverlay = modal?.querySelector('.modal__overlay');
  const modalClose = modal?.querySelector('.modal__close');
  const modalTariffName = document.getElementById('modalTariffName');
  const orderForm = document.getElementById('orderForm');

  let currentTariff = '';

  function openModal(tariff) {
    currentTariff = tariff;
    modalTariffName.textContent = tariff;
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.price-card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tariff = btn.dataset.tariff || '';
      openModal(tariff);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);

  orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = orderForm.querySelector('#orderName').value.trim();
    const countryCode = orderForm.querySelector('#orderCountryCode').value;
    const phone = orderForm.querySelector('#orderPhone').value.replace(/\D/g, '');
    const fullPhone = countryCode + phone;
    const text = encodeURIComponent(
      `Здравствуйте! Меня зовут ${name}. Хочу записаться на тариф «${currentTariff}». Мой телефон: +${fullPhone}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    closeModal();
    orderForm.reset();
  });

  // Закрытие модалки по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
  });

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
