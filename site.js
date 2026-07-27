(() => {
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
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

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
