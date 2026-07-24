/* gids-matcher.js — herbruikbaar keuzeblok onderaan gidspagina's.
   Config via data-attributen op .ghm:
     data-land   = "Turkije" (of "Griekenland,Spanje")  → harde filter
     data-adults = "true" | "false"                      → harde filter (weglaten = geen filter)
   De trips-data (/trips.js) wordt PAS geladen bij de eerste labelklik → interactie-gated,
   dus Google indexeert de commerciële hotels niet.
   NB: trips.js declareert `const trips`, wat NIET op window komt. We lezen daarom de bare
   global `trips` via een typeof-guard, niet window.trips. */
(function () {
  "use strict";

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
  function vluchtUren(v){ if(!v) return 99; var m=String(v).match(/(\d+)u(\d+)?/); if(!m) return 99; return parseInt(m[1],10)+(m[2]?parseInt(m[2],10)/60:0); }
  function plaats(dest){ return (dest||'').split(',')[0].trim(); }

  var SFEER = [
    { id:'rustig',      label:'Rustig & intiem',   w:3, test:function(t){return t.sfeer.indexOf('rustig')>-1;},  why:'rustig' },
    { id:'levendig',    label:'Levendig',          w:3, test:function(t){return t.sfeer.indexOf('rustig')===-1;}, why:'levendig' },
    { id:'resort',      label:'Groot resort',      w:3, test:function(t){return t.sfeer.indexOf('resort')>-1;},  why:'groot resort' },
    { id:'natuur',      label:'Natuur & rust',     w:3, test:function(t){return t.sfeer.indexOf('natuur')>-1;},  why:'natuur' },
    { id:'actief',      label:'Actief',            w:3, test:function(t){return t.sfeer.indexOf('actief')>-1||t.sfeer.indexOf('avontuur')>-1;}, why:'actief' },
    { id:'wellness',    label:'Wellness',          w:2, test:function(t){return t.sfeer.indexOf('rustig')>-1||t.sfeer.indexOf('resort')>-1;}, why:'wellness' },
    { id:'allin',       label:'Alles inclusief',   w:4, test:function(t){return t.boardType==='All-inclusive'||t.boardType==='Ultra all-inclusive';}, why:'all-inclusive' },
    { id:'kortvliegen', label:'Kort vliegen',      w:3, test:function(t){return vluchtUren(t.vluchtduur)<=4;}, why:'korte vlucht' }
  ];
  var BUDGET = [
    { id:'b700',  label:'Tot €700 p.p.',  cap:700 },
    { id:'b1000', label:'Tot €1000 p.p.', cap:1000 },
    { id:'any',   label:'Maakt niet uit',      cap:99999 }
  ];
  var MONTH_ORDER = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];

  // ---- trips lazy-loader (1x per pagina) ----
  var tripsPromise = null;
  function currentTrips(){ return (typeof trips !== 'undefined' && Array.isArray(trips)) ? trips : null; }
  function loadTrips(){
    var t = currentTrips(); if (t) return Promise.resolve(t);
    if (tripsPromise) return tripsPromise;
    tripsPromise = new Promise(function(resolve, reject){
      var s=document.createElement('script'); s.src='/trips.js';
      s.onload=function(){ resolve(currentTrips()||[]); };
      s.onerror=function(){ reject(new Error('trips.js kon niet laden')); };
      document.head.appendChild(s);
    });
    return tripsPromise;
  }

  function initBlock(root){
    var lands = (root.dataset.land||'').split(',').map(function(x){return x.trim();}).filter(Boolean);
    var adults = root.dataset.adults; // "true" | "false" | undefined
    var state = { sfeer:{}, budget:null, maand:{} };
    var monthsBuilt = false;

    var labelsWrap = root.querySelector('.ghm-labels');
    var goBtn = root.querySelector('.ghm-go');
    var resBox = root.querySelector('.ghm-results');

    function chip(label, cls){ var b=document.createElement('button'); b.type='button'; b.className='ghm-chip '+(cls||''); b.textContent=label; b.setAttribute('aria-pressed','false'); return b; }
    function group(title){ var g=document.createElement('div'); g.className='ghm-group'; var h=document.createElement('span'); h.className='ghm-glabel'; h.textContent=title; g.appendChild(h); var row=document.createElement('div'); row.className='ghm-row'; g.appendChild(row); g._row=row; return g; }

    // sfeer (multi)
    var gS=group('Sfeer');
    SFEER.forEach(function(w){ var b=chip(w.label); b.addEventListener('click',function(){ ensureTrips(); toggle(state.sfeer,w.id,b); }); gS._row.appendChild(b); });
    labelsWrap.appendChild(gS);

    // budget (single)
    var gB=group('Budget'); var bBtns=[];
    BUDGET.forEach(function(w){ var b=chip(w.label,'ghm-budget'); bBtns.push(b);
      b.addEventListener('click',function(){ ensureTrips(); var on=state.budget===w.id; bBtns.forEach(function(x){x.setAttribute('aria-pressed','false');}); state.budget=on?null:w.id; b.setAttribute('aria-pressed',on?'false':'true'); enableGo(); });
      gB._row.appendChild(b); });
    labelsWrap.appendChild(gB);

    // maand (multi) — dynamisch gevuld zodra trips geladen zijn (echte maanden uit dit aanbod)
    var gM=group('Wanneer'); var monthRow=gM._row;
    monthRow.innerHTML='<span class="ghm-mhint">Kies hierboven iets — dan verschijnen de beschikbare maanden.</span>';
    labelsWrap.appendChild(gM);

    function buildMonths(allTrips){
      if(monthsBuilt) return;
      var subset=allTrips.filter(function(t){
        if(lands.length && !lands.some(function(l){return (t.destination||'').indexOf(l)>-1;})) return false;
        if(adults==='true' && t.adultsOnly!==true) return false;
        if(adults==='false' && t.adultsOnly===true) return false;
        return true;
      });
      var found={};
      subset.forEach(function(t){(t.variants||[]).forEach(function(v){found[v.maand]=1;});});
      var months=MONTH_ORDER.filter(function(m){return found[m];});
      monthRow.innerHTML='';
      if(!months.length){ monthRow.innerHTML='<span class="ghm-mhint">Voor deze bestemming maakt de maand weinig uit.</span>'; monthsBuilt=true; return; }
      months.forEach(function(m){ var b=chip(cap(m),'ghm-sm'); b.addEventListener('click',function(){ toggle(state.maand,m,b); }); monthRow.appendChild(b); });
      monthsBuilt=true;
    }

    function ensureTrips(){ loadTrips().then(function(all){ buildMonths(all); }).catch(function(){}); }

    function toggle(bag,key,btn){ if(bag[key]){delete bag[key];btn.setAttribute('aria-pressed','false');} else {bag[key]=true;btn.setAttribute('aria-pressed','true');} enableGo(); }
    function count(){ return Object.keys(state.sfeer).length + (state.budget?1:0) + Object.keys(state.maand).length; }
    function enableGo(){ goBtn.disabled = count()===0; }
    enableGo();

    goBtn.addEventListener('click', function(){
      goBtn.disabled=true; goBtn.textContent='Even zoeken…';
      loadTrips().then(function(all){
        buildMonths(all);
        goBtn.textContent='Toon passende hotels'; goBtn.disabled=false;
        render(all);
      }).catch(function(){ resBox.hidden=false; resBox.innerHTML='<p class="ghm-empty">De hotels konden even niet laden. Probeer het zo nog eens.</p>'; goBtn.textContent='Toon passende hotels'; goBtn.disabled=false; });
    });

    function bestVariant(t){
      var maand=Object.keys(state.maand);
      var vs=(t.variants||[]).filter(function(v){ return !maand.length || maand.indexOf(v.maand)>-1; });
      if(!vs.length) return null;
      vs=vs.slice().sort(function(a,b){return a.prijs-b.prijs;});
      return vs[0];
    }

    function match(allTrips){
      var cap = state.budget ? (BUDGET.filter(function(b){return b.id===state.budget;})[0].cap) : 99999;
      var sfeerSel = SFEER.filter(function(w){ return state.sfeer[w.id]; });
      var out=[];
      allTrips.forEach(function(t){
        if(lands.length && !lands.some(function(l){ return (t.destination||'').indexOf(l)>-1; })) return;
        if(adults==='true' && t.adultsOnly!==true) return;
        if(adults==='false' && t.adultsOnly===true) return;
        var v=bestVariant(t); if(!v) return;
        if(v.prijs>cap) return;
        var score=0, why=[];
        sfeerSel.forEach(function(w){ if(w.test(t)){ score+=w.w; why.push(w.why); } });
        var rate=parseFloat(String(t.highlights&&t.highlights.join(' ')||'').replace(',','.').match(/(\d+\.\d)/)?RegExp.$1:'0');
        out.push({ t:t, v:v, score:score, rate:rate, why:why });
      });
      out.sort(function(a,b){ return b.score-a.score || b.rate-a.rate || a.v.prijs-b.v.prijs; });
      var per={}, res=[];
      out.forEach(function(s){ var p=plaats(s.t.destination); per[p]=(per[p]||0)+1; if(per[p]<=2) res.push(s); });
      return res;
    }

    function advies(top){
      var w=top[0], t=w.t, v=w.v;
      var naam=esc(t.hotelName||t.title), pl=esc(plaats(t.destination));
      var zin='Op basis van jullie keuzes zou ik voor <strong>'+naam+'</strong> in '+pl+' gaan — '+esc(t.boardType).toLowerCase()+', '+esc(t.vluchtduur)+' vliegen, vanaf €'+(Number(v.prijs)||0)+' p.p.';
      var cheap=top.reduce(function(a,b){ return a.v.prijs<b.v.prijs?a:b; });
      if(cheap.t.id!==t.id){ zin+=' Wil je scherper geprijsd? Kijk naar <strong>'+esc(cheap.t.hotelName||cheap.t.title)+'</strong> (vanaf €'+(Number(cheap.v.prijs)||0)+').'; }
      return zin;
    }

    function render(allTrips){
      var res=match(allTrips);
      resBox.hidden=false;
      if(!res.length){ resBox.innerHTML='<p class="ghm-empty">Met deze combinatie vonden we niks. Laat een label of maand los — dan tonen we de dichtstbijzijnde matches.</p>'; resBox.scrollIntoView({behavior:'smooth',block:'nearest'}); return; }
      var top=res.slice(0,3);
      var html='<div class="ghm-advies">'+advies(top)+'</div>';
      top.forEach(function(s){
        var t=s.t, v=s.v, vIdx=t.variants.indexOf(v);
        var why=s.why.filter(function(x,idx,a){return a.indexOf(x)===idx;}).slice(0,4).map(function(x){return '<span>'+esc(x)+'</span>';}).join('');
        html+='<div class="ghm-card">'+
          (t.imageUrl?'<img src="'+esc(t.imageUrl)+'" alt="'+esc(t.hotelName||t.title)+'" loading="lazy" width="120" height="120">':'')+
          '<div class="ghm-cbody">'+
            '<p class="ghm-cname">'+esc(t.hotelName||t.title)+'</p>'+
            '<p class="ghm-cmeta">'+esc(plaats(t.destination))+' · '+esc(t.boardType)+' · '+esc(t.vluchtduur)+' vliegen</p>'+
            (why?'<p class="ghm-why"><em>past omdat:</em> '+why+'</p>':'')+
            '<div class="ghm-cbot">'+
              '<span class="ghm-price">€'+(Number(v.prijs)||0)+' <small>p.p. · '+esc(cap(v.maand))+'</small></span>'+
              '<a class="ghm-go-link" href="/api/go?id='+encodeURIComponent(t.id)+'&v='+encodeURIComponent(vIdx>=0?vIdx:0)+'" target="_blank" rel="sponsored noopener">Bekijk bij '+esc(t.aanbieder)+' →</a>'+
            '</div>'+
          '</div>'+
        '</div>';
      });
      html+='<p class="ghm-foot">Prijzen en beschikbaarheid staan bij de aanbieder. Wij verdienen een kleine commissie als je boekt via onze link — jij betaalt niet meer.</p>';
      resBox.innerHTML=html;
      resBox.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    var blocks=document.querySelectorAll('.ghm');
    for(var i=0;i<blocks.length;i++){ initBlock(blocks[i]); }
  });
})();
