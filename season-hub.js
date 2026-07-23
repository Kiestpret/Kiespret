/* Seizoensbewuste hub — herschikt #seasonHub naar de huidige maand.
   Standaard-HTML blijft staan als JS uit is (SEO-veilig). */
(function () {
  var W = '/gids/winterzon-canarische-eilanden/';
  var CB = '/gids/curacao-of-bonaire/';
  var MV = '/gids/meivakantie-2027-zon/';
  var GOED = '/gids/goedkope-zonvakantie/';
  var HERFST = '/gids/herfstvakantie-zon/';
  function mnd(slug, label) { return [label, '/gids/zonvakantie-' + slug + '/']; }

  var M = {
    0:  { k: 'Zon in de winter — en alvast de zomer plannen', i: [['Winterzon op de Canarische Eilanden', W], ['Curaçao of Bonaire', CB], ['Meivakantie 2027 in de zon', MV]] },
    1:  { k: 'Winterzon en het voorjaar plannen', i: [['Winterzon op de Canarische Eilanden', W], mnd('mei', 'Zonvakantie in mei'), ['Meivakantie 2027 in de zon', MV]] },
    2:  { k: 'Op naar het voorjaar', i: [mnd('mei', 'Zonvakantie in mei'), ['Meivakantie 2027 in de zon', MV], mnd('juni', 'Zonvakantie in juni')] },
    3:  { k: 'Meivakantie en de vroege zomer', i: [['Meivakantie 2027 in de zon', MV], mnd('mei', 'Zonvakantie in mei'), mnd('juni', 'Zonvakantie in juni')] },
    4:  { k: 'Mei en juni: warm en nog rustig', i: [mnd('mei', 'Zonvakantie in mei'), mnd('juni', 'Zonvakantie in juni'), ['Goedkope zonvakantie', GOED]] },
    5:  { k: 'Volop zomer', i: [mnd('juni', 'Zonvakantie in juni'), mnd('juli', 'Zonvakantie in juli'), ['Goedkope zonvakantie', GOED]] },
    6:  { k: 'Hoogzomer', i: [mnd('juli', 'Zonvakantie in juli'), mnd('augustus', 'Zonvakantie in augustus'), ['Goedkope zonvakantie', GOED]] },
    7:  { k: 'Augustus en de nazomer', i: [mnd('augustus', 'Zonvakantie in augustus'), mnd('september', 'Zonvakantie in september'), ['Goedkope zonvakantie', GOED]] },
    8:  { k: 'Nazomer: warm water, minder druk', i: [mnd('september', 'Zonvakantie in september'), mnd('oktober', 'Zonvakantie in oktober'), ['Goedkope zonvakantie', GOED]] },
    9:  { k: 'Herfstzon', i: [mnd('oktober', 'Zonvakantie in oktober'), ['Herfstvakantie in de zon', HERFST], ['Winterzon op de Canarische Eilanden', W]] },
    10: { k: 'Winterzon komt eraan', i: [mnd('november', 'Zonvakantie in november'), ['Winterzon op de Canarische Eilanden', W], ['Curaçao of Bonaire', CB]] },
    11: { k: 'Winterzon — en alvast de zomer', i: [['Winterzon op de Canarische Eilanden', W], ['Curaçao of Bonaire', CB], ['Meivakantie 2027 in de zon', MV]] }
  };

  var el = document.getElementById('seasonHub');
  if (!el) return;
  var data = M[new Date().getMonth()];
  if (!data) return;

  var kop = document.querySelector('.season-hub-kop');
  if (kop) kop.textContent = data.k;

  el.innerHTML = data.i.map(function (item) {
    var a = document.createElement('a');
    a.href = item[1];
    a.textContent = item[0];
    return a.outerHTML;
  }).join('');
})();
