(() => {
  const photo = 'data:image/webp;base64,' + (window.__mkPhotoParts || []).join('');
  document.querySelectorAll('[data-founder-photo]').forEach((img) => {
    img.src = photo;
  });
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.primary-nav');
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  };
  menuButton?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.getElementById('year').textContent = new Date().getFullYear();

  const share = async () => {
    const data = {
      title: 'M. Kathleen, LLC',
      text: 'Experienced, founder-led payroll operations support from Melodie Craig, CPP.',
      url: 'https://tsmithcode.github.io/mkathleen-llc/'
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
