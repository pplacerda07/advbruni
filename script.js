/* ============================================================
   Advocacia Trabalhista — interações da página
   ============================================================ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- WhatsApp ----------
     Para trocar o número, altere aqui E nos href="https://wa.me/..."
     do index.html (o href é o que funciona se o JS não carregar).
  ------------------------------------------------------------ */
  const WA_NUMERO = '5511945837302';
  const WA_ABERTURA = 'Olá! Vim pelo site.';
  const WA_PADRAO = 'Gostaria de apresentar uma questão para verificar a possibilidade de atendimento.';

  const linkWa = (mensagem) =>
    `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(`${WA_ABERTURA} ${mensagem || WA_PADRAO}`)}`;

  // cada link com data-wa ganha a mensagem já escrita
  $$('[data-wa]').forEach((el) => {
    el.href = linkWa(el.dataset.wa);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- Ano no rodapé ---------- */
  const ano = $('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const burger = $('.burger');
  const menu = $('#menu-mobile');
  if (burger && menu) {
    const fecharMenu = () => {
      burger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };

    burger.addEventListener('click', () => {
      const aberto = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!aberto));
      menu.hidden = aberto;
    });

    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') fecharMenu();
    });

    // fecha ao tocar fora, ao apertar Esc ou ao voltar para o layout desktop
    document.addEventListener('click', (e) => {
      if (menu.hidden) return;
      if (!menu.contains(e.target) && !burger.contains(e.target)) fecharMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fecharMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) fecharMenu();
    });
  }

  /* ---------- Carrossel de áreas (arraste + setas) ---------- */
  const carousel = $('[data-carousel="root"]');
  const track = $('[data-carousel="track"]');

  if (carousel && track) {
    const passo = () => {
      const card = track.firstElementChild;
      if (!card) return 320;
      const gap = parseFloat(getComputedStyle(track).columnGap || '20');
      return card.getBoundingClientRect().width + gap;
    };

    $('[data-carousel="prev"]').addEventListener('click', () => {
      track.scrollBy({ left: -passo(), behavior: 'smooth' });
    });
    $('[data-carousel="next"]').addEventListener('click', () => {
      track.scrollBy({ left: passo(), behavior: 'smooth' });
    });

    // arraste com mouse / caneta (touch usa o scroll nativo)
    let arrastando = false, xInicial = 0, scrollInicial = 0, moveu = 0;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      arrastando = true;
      moveu = 0;
      xInicial = e.clientX;
      scrollInicial = track.scrollLeft;
      track.classList.add('is-dragging');
    });

    track.addEventListener('pointermove', (e) => {
      if (!arrastando) return;
      const delta = e.clientX - xInicial;
      moveu = Math.abs(delta);
      track.scrollLeft = scrollInicial - delta;
    });

    const soltar = () => {
      if (!arrastando) return;
      arrastando = false;
      // devolve o clique aos links só depois do frame atual
      requestAnimationFrame(() => track.classList.remove('is-dragging'));
    };
    track.addEventListener('pointerup', soltar);
    track.addEventListener('pointercancel', soltar);
    track.addEventListener('pointerleave', soltar);
    track.addEventListener('dragstart', (e) => e.preventDefault());

    // esconde a dica "arraste" no primeiro uso
    const esconderDica = () => carousel.classList.add('is-touched');
    track.addEventListener('scroll', esconderDica, { once: true });
    track.addEventListener('pointerdown', esconderDica, { once: true });
  }

  /* ---------- Formulário: perfil trabalhador / empresa ---------- */
  const segBtns = $$('.seg-btn');
  const campoEmpresa = $('[data-campo="empresa"]');
  const inputEmpresa = $('#empresa');

  segBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      segBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      const ehEmpresa = btn.dataset.perfil === 'empresa';
      if (campoEmpresa) campoEmpresa.hidden = !ehEmpresa;
      if (inputEmpresa) {
        inputEmpresa.required = ehEmpresa;
        if (!ehEmpresa) inputEmpresa.value = '';
      }
    });
  });

  /* ---------- Contador de caracteres ---------- */
  const resumo = $('#resumo');
  const counter = $('[data-counter]');
  if (resumo && counter) {
    const atualizar = () => {
      counter.textContent = `${resumo.value.length} / ${resumo.maxLength}`;
    };
    resumo.addEventListener('input', atualizar);
    atualizar();
  }

  /* ---------- Envio do formulário ----------
     Não há backend: o formulário monta a mensagem e abre a
     conversa no WhatsApp com tudo já escrito.
  ------------------------------------------------------------ */
  const form = $('.contact-form');
  const status = $('[data-status]');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const obrigatorios = $$('input, select, textarea', form)
        .filter((el) => el.required && !el.closest('[hidden]'));

      let valido = true;
      obrigatorios.forEach((el) => {
        const ok = el.checkValidity() && el.value.trim() !== '';
        el.classList.toggle('is-invalid', !ok);
        if (!ok && valido) {
          valido = false;
          el.focus();
        }
      });

      if (!valido) {
        status.textContent = 'Revise os campos destacados antes de enviar.';
        status.className = 'form-status err';
        return;
      }

      const perfil = $('.seg-btn.is-active')?.dataset.perfil === 'empresa'
        ? 'Represento uma empresa'
        : 'Sou trabalhador';

      const mensagem = [
        `${perfil}.`,
        `Nome: ${$('#nome').value.trim()}`,
        `Assunto: ${$('#assunto').value}`,
        `Resumo: ${$('#resumo').value.trim()}`
      ].join('\n');

      window.open(linkWa(mensagem), '_blank', 'noopener');

      status.textContent = 'Conversa aberta no WhatsApp com as informações preenchidas.';
      status.className = 'form-status ok';
    });

    form.addEventListener('input', (e) => {
      e.target.classList.remove('is-invalid');
    });
  }

  /* ---------- Revelação suave ao rolar ---------- */
  const alvos = $$([
    '.hero-copy', '.hero-figure', '.hero-card', '.hero-strip',
    '.sec-head', '.journey-card', '.about-left', '.about-right',
    '.steps li', '.table-row', '.faq details', '.contact-left', '.contact-form'
  ].join(','));

  alvos.forEach((el) => el.setAttribute('data-reveal', ''));

  const revelarTudo = () => alvos.forEach((el) => el.classList.add('is-visible'));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });

    alvos.forEach((el) => obs.observe(el));

    // rede de segurança: se algo impedir o observer, o conteúdo aparece assim mesmo
    setTimeout(revelarTudo, 3000);
  } else {
    revelarTudo();
  }

  /* ---------- Pop-up flutuante do WhatsApp ---------- */
  const waToggle = $('[data-wa-toggle]');
  const waCard = $('#wa-card');

  if (waToggle && waCard) {
    const abrirWa = (abrir) => {
      waCard.hidden = !abrir;
      waToggle.setAttribute('aria-expanded', String(abrir));
    };

    waToggle.addEventListener('click', () => abrirWa(waCard.hidden));
    $('[data-wa-close]').addEventListener('click', () => abrirWa(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') abrirWa(false);
    });
    document.addEventListener('click', (e) => {
      if (!waCard.hidden && !$('[data-wa-widget]').contains(e.target)) abrirWa(false);
    });

    // abre sozinho uma vez, depois que a pessoa já leu um pedaço da página
    let jaAbriu = false;
    window.addEventListener('scroll', () => {
      if (jaAbriu || window.scrollY < window.innerHeight * 1.2) return;
      jaAbriu = true;
      abrirWa(true);
    }, { passive: true });
  }

  /* ---------- Fallback para navegadores sem :has() ---------- */
  if (!CSS.supports('selector(:has(img))')) {
    $$('.slot').forEach((slot) => {
      if (slot.querySelector('img')) slot.classList.add('is-filled');
    });
  }
})();
