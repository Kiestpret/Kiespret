/* Gids-dropdown: klik om te openen/sluiten. Werkt op touch en desktop.
   De 'Gids'-knop toggelt het menu; 'Alle gidsen' in het menu gaat naar /gids/. */
(function () {
  var dd = document.querySelector('.nav-dropdown');
  if (!dd) return;
  var trigger = dd.querySelector('.nav-gids');
  if (!trigger) return;

  trigger.setAttribute('role', 'button');
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('tabindex', '0');

  function open() { dd.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
  function close() { dd.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }
  function toggle(e) {
    if (e) e.preventDefault();
    if (dd.classList.contains('open')) close(); else open();
  }

  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
  document.addEventListener('click', function (e) { if (!dd.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
