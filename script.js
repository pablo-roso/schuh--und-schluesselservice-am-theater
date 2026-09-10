/* ============================================================
   Schuh- und Schlüsselservice am Theater — Seitenlogik
   Mobilmenü und Öffnungsstatus. Für Express-Aufträge ist die
   Restzeit die wichtigste Zahl, deshalb weist der Status in der
   letzten Stunde ausdrücklich darauf hin.
   ============================================================ */
(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  var HOURS = { 1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 15] };
  var DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  function fmt(v) {
    var h = Math.floor(v), m = Math.round((v - h) * 60);
    return h + ':' + (m < 10 ? '0' + m : m);
  }

  var now = new Date();
  var day = now.getDay();
  var dec = now.getHours() + now.getMinutes() / 60;
  var today = HOURS[day];
  var open = !!(today && dec >= today[0] && dec < today[1]);

  var label;
  if (open) {
    var rest = Math.round((today[1] - dec) * 60);
    label = rest <= 60
      ? 'Noch ' + rest + ' Minuten offen — für Express jetzt vorbeikommen'
      : 'Jetzt geöffnet — bis ' + fmt(today[1]) + ' Uhr';
  } else {
    label = 'Gerade geschlossen';
    for (var i = 0; i < 8; i++) {
      var d = (day + i) % 7;
      var slot = HOURS[d];
      if (!slot) continue;
      if (i === 0 && dec >= slot[0]) continue;
      var when = i === 0 ? 'heute' : i === 1 ? 'morgen' : 'am ' + DAYS[d];
      label = 'Gerade geschlossen — wieder ' + when + ' ab ' + fmt(slot[0]) + ' Uhr';
      break;
    }
  }

  var badge = document.getElementById('statusBadge');
  var text = document.getElementById('statusText');
  if (badge && text) {
    badge.hidden = false;
    badge.classList.add(open ? 'is-open' : 'is-closed');
    text.textContent = label;
  }

  var headerStatus = document.getElementById('headerStatus');
  if (headerStatus) {
    headerStatus.hidden = false;
    headerStatus.textContent = open ? 'offen bis ' + fmt(today[1]) : 'gerade zu';
    if (open) headerStatus.classList.add('is-open');
  }

  var list = document.getElementById('hoursList');
  if (list) {
    var row = list.querySelector('[data-day="' + day + '"]');
    if (row && HOURS[day]) row.classList.add('is-today');
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
