(() => {
  // Load the founder-approved mobile portrait correction when the page does not
  // already include it directly.
  if (!document.querySelector('link[href*="mobile-portrait-fix.css"]')) {
    const mobileFix = document.createElement('link');
    mobileFix.rel = 'stylesheet';
    mobileFix.href = 'mobile-portrait-fix.css?v=20260727.4';
    mobileFix.dataset.mobilePortraitFix = 'true';
    document.head.appendChild(mobileFix);
  }

  const menuButton = document.querySelector('.menu');
  const nav = document.querySelector('.navlinks');
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = '☰';
  };

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '✕' : '☰';
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // The fixed conversion button must never cover Melodie's face or name card.
  const portrait = document.querySelector('.portrait');
  const mobileCta = document.querySelector('.mobile-cta');
  if (portrait && mobileCta && 'IntersectionObserver' in window) {
    const mobileViewport = window.matchMedia('(max-width: 760px)');
    let portraitObserver;

    const configurePortraitGuard = () => {
      portraitObserver?.disconnect();
      mobileCta.classList.remove('cta-hidden');

      if (!mobileViewport.matches) return;

      portraitObserver = new IntersectionObserver(
        ([entry]) => {
          mobileCta.classList.toggle('cta-hidden', entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: '-84px 0px -8% 0px',
          threshold: 0.08
        }
      );

      portraitObserver.observe(portrait);
    };

    configurePortraitGuard();
    mobileViewport.addEventListener?.('change', configurePortraitGuard);
  }

  const share = async () => {
    const data = {
      title: 'M. Kathleen, LLC',
      text: 'Experienced, founder-led payroll operations support from Melodie Craig, CPP.',
      url: `${window.location.origin}${window.location.pathname}`
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      window.alert('Website link copied.');
    } catch (error) {
      if (error?.name !== 'AbortError') {
        window.location.href = `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`${data.text}\n\n${data.url}`)}`;
      }
    }
  };

  document.getElementById('share-site')?.addEventListener('click', share);
  document.getElementById('share-footer')?.addEventListener('click', share);
})();
