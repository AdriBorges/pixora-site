(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const isOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', isOpen);
    menuButton.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', isOpen);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const progress = document.querySelector('.scroll-progress');
  let scrolling = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max ? Math.min(1, scrollY / max) : 0})`;
    document.querySelector('.site-header').classList.toggle('has-scrolled', scrollY > 16);
    scrolling = false;
  };
  addEventListener('scroll', () => { if (!scrolling) { requestAnimationFrame(updateScroll); scrolling = true; } }, { passive: true });
  updateScroll();

  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
    targets.forEach(el => observer.observe(el));
  } else targets.forEach(el => el.classList.add('visible'));

  const fieldType = document.getElementById('tipo');
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    fieldType.value = link.dataset.service;
  }));
  document.getElementById('year').textContent = new Date().getFullYear();

  const form = document.getElementById('quote-form');
  const feedback = document.getElementById('form-feedback');
  const escapeHtml = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'PEDIDO DE ORÇAMENTO — PIXORA',
      '',
      `Nome: ${data.get('nome').trim()}`,
      `E-mail: ${data.get('email').trim()}`,
      `Serviço: ${data.get('tipo')}`,
      `Previsão: ${data.get('prazo') || 'Ainda não definida'}`,
      '',
      'Sobre o projeto:',
      data.get('mensagem').trim()
    ].join('\n');
    feedback.hidden = false;
    feedback.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = 'Seu resumo está pronto.';
    const description = document.createElement('p');
    description.textContent = 'Este formulário ainda não envia pedidos. Copie o texto abaixo para guardar os detalhes enquanto configuramos o canal de contato.';
    const pre = document.createElement('pre');
    pre.textContent = message;
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'btn btn-outline copy-btn';
    copyButton.textContent = 'Copiar resumo';
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(message);
        copyButton.textContent = 'Resumo copiado ✓';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pre);
        selection.removeAllRanges();
        selection.addRange(range);
        copyButton.textContent = 'Selecione e copie o texto acima';
      }
    });
    feedback.append(title, description, pre, copyButton);
    feedback.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'nearest'});
  });
})();

