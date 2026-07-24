(function(){
  "use strict";
  var TRIPS = (typeof trips !== 'undefined') ? trips : [];

  // ---------- helpers ----------
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function vluchtUren(v){ // "3u30" -> 3.5
    if(!v) return 99; var m=String(v).match(/(\d+)u(\d+)?/); if(!m) return 99;
    return parseInt(m[1],10) + (m[2]?parseInt(m[2],10)/60:0);
  }
  function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }

  // ---------- woordenlijst → signaal ----------
  // type: ko = knock-out, r = ranking. eval(trip, ranking-context) -> bool of score-bijdrage
  var SMAAK = [
    { id:'rustig',      label:'Rustig aan',                 type:'r',  w:3, test:function(t){return t.sfeer.indexOf('rustig')>-1;} },
    { id:'levendig',    label:'Lekker levendig',            type:'r',  w:3, test:function(t){return t.sfeer.indexOf('rustig')===-1;} },
    { id:'romantisch',  label:"Romantisch met z'n tweeën",  type:'r',  w:3, test:function(t){return t.adultsOnly || t.sfeer.indexOf('rustig')>-1;} },
    { id:'adultsonly',  label:'Adults only',                type:'ko', ko:function(t){return t.adultsOnly===true;} },
    { id:'allin',       label:'Geen omkijken (all-in)',     type:'r',  w:5, test:function(t){return t.boardType==='All-inclusive'||t.boardType==='Ultra all-inclusive';} },
    { id:'ontdekken',   label:'Zelf uit eten / ontdekken',  type:'r',  w:5, test:function(t){return ['Ontbijt','Logies','Halfpension'].indexOf(t.boardType)>-1;} },
    { id:'kleinbudget', label:'Klein budget',               type:'ko', ko:function(t){return t.__v && t.__v.prijs<=600;} },
    { id:'magkosten',   label:'Mag wat kosten',             type:'r',  w:2, test:function(t){return t.boardType==='Ultra all-inclusive'||t.sfeer.indexOf('resort')>-1;} },
    { id:'kortvliegen', label:'Kort vliegen',               type:'r',  w:3, test:function(t){return vluchtUren(t.vluchtduur)<=4;} },
    { id:'verweg',      label:'Ver weg mag',                type:'r',  w:3, test:function(t){return vluchtUren(t.vluchtduur)>=6;} },
    { id:'actief',      label:'Actief / avontuur',          type:'r',  w:3, test:function(t){return t.sfeer.indexOf('actief')>-1||t.sfeer.indexOf('avontuur')>-1;} },
    { id:'natuur',      label:'Natuur',                     type:'r',  w:3, test:function(t){return t.sfeer.indexOf('natuur')>-1;} },
    { id:'resort',      label:'Groot resort',               type:'r',  w:3, test:function(t){return t.sfeer.indexOf('resort')>-1;} },
    { id:'wellness',    label:'Wellness / ontspanning',     type:'r',  w:2, test:function(t){return t.sfeer.indexOf('rustig')>-1||t.sfeer.indexOf('resort')>-1;} },
    { id:'goedeten',    label:'Goed eten',                  type:'r',  w:2, test:function(t){return t.boardType==='Ultra all-inclusive'||/Itali|Griekenland/.test(t.destination);} }
  ];
  // korte "past omdat"-labels per woord
  var WHY = { rustig:'rustig', levendig:'levendig', romantisch:'romantisch', adultsonly:'adults only',
    allin:'all-inclusive', ontdekken:'zelf ontdekken', kleinbudget:'binnen klein budget', magkosten:'wat meer luxe',
    kortvliegen:'korte vlucht', verweg:'verre bestemming', actief:'actief', natuur:'natuur', resort:'groot resort',
    wellness:'wellness', goedeten:'goed eten' };

  var LANDEN = ['Turkije','Griekenland','Spanje','Egypte','Bulgarije','Portugal','Italië','Curaçao','Kaapverdië','Bonaire'];

  // maanden uit echte feed, in kalendervolgorde
  var MONTH_ORDER = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  var monthsInFeed = (function(){
    var s={}; TRIPS.forEach(function(t){(t.variants||[]).forEach(function(v){s[v.maand]=1;});});
    return MONTH_ORDER.filter(function(m){return s[m];});
  })();

  // ---------- state ----------
  var state = { smaak:{}, land:{}, maand:{} };

  // ---------- render chips ----------
  function chip(label, cls, pressed){
    var b=document.createElement('button');
    b.className='chip '+cls; b.type='button'; b.textContent=label;
    b.setAttribute('aria-pressed', pressed?'true':'false');
    return b;
  }
  var cloudSmaak=document.getElementById('cloudSmaak');
  SMAAK.forEach(function(w){
    var b=chip(w.label, w.type==='ko'?'chip-ko':'', false);
    b.addEventListener('click',function(){ toggle(state.smaak,w.id,b); });
    cloudSmaak.appendChild(b);
  });
  var cloudLand=document.getElementById('cloudLand');
  LANDEN.forEach(function(l){
    var b=chip(l,'chip-land chip-sm',false);
    b.addEventListener('click',function(){ toggle(state.land,l,b); });
    cloudLand.appendChild(b);
  });
  var cloudMaand=document.getElementById('cloudMaand');
  monthsInFeed.forEach(function(m){
    var b=chip(cap(m),'chip-sm',false);
    b.addEventListener('click',function(){ toggle(state.maand,m,b); });
    cloudMaand.appendChild(b);
  });

  function toggle(bag,key,btn){
    if(bag[key]){ delete bag[key]; btn.setAttribute('aria-pressed','false'); }
    else { bag[key]=true; btn.setAttribute('aria-pressed','true'); }
    updateWens();
  }

  // ---------- wens-bevestiging ----------
  function updateWens(){
    var smaak=Object.keys(state.smaak), land=Object.keys(state.land), maand=Object.keys(state.maand);
    var parts=[];
    if(smaak.length){
      var words=smaak.map(function(id){var w=SMAAK.filter(function(x){return x.id===id;})[0];return (WHY[id]||w.label).toLowerCase();});
      parts.push('een vakantie die <strong>'+words.join(' &middot; ')+'</strong> is');
    }
    if(land.length) parts.push('in <strong>'+land.join(' of ')+'</strong>');
    if(maand.length) parts.push('in <strong>'+maand.map(cap).join(' of ')+'</strong>');
    var el=document.getElementById('wensZin');
    if(!parts.length){ el.textContent='Nog niks gekozen — tik hierboven wat woorden aan.'; }
    else { el.innerHTML='Jullie zoeken '+parts.join(', ')+'.'; }
    document.getElementById('btnMatch').disabled = (smaak.length+land.length+maand.length)===0;
  }

  // ---------- matching ----------
  function bestVariant(trip){
    // kies variant: filter op maand indien gekozen; anders alle. pak goedkoopste (AMS-voorkeur bij gelijk).
    var maand=Object.keys(state.maand);
    var vs=(trip.variants||[]).filter(function(v){ return !maand.length || maand.indexOf(v.maand)>-1; });
    if(!vs.length) return null;
    vs=vs.slice().sort(function(a,b){ return a.prijs-b.prijs; });
    return vs[0];
  }

  function match(){
    var smaakIds=Object.keys(state.smaak), lands=Object.keys(state.land);
    var koWords=SMAAK.filter(function(w){ return w.type==='ko' && state.smaak[w.id]; });
    var rankWords=SMAAK.filter(function(w){ return w.type==='r' && state.smaak[w.id]; });

    var scored=[];
    TRIPS.forEach(function(t){
      // knock-out: land
      if(lands.length){
        var hit=lands.some(function(l){ return (t.destination||'').indexOf(l)>-1; });
        if(!hit) return;
      }
      // knock-out: maand (variant moet bestaan)
      var v=bestVariant(t);
      if(!v) return;
      var tt=Object.assign({},t,{__v:v});
      // knock-out: smaak-ko's (adults-only, klein budget)
      var koPass=koWords.every(function(w){ return w.ko(tt); });
      if(!koPass) return;

      // ranking
      var score=0, why=[];
      rankWords.forEach(function(w){
        if(w.test(tt)){ score+=w.w; if(WHY[w.id]) why.push(WHY[w.id]); }
      });
      // ko-woorden ook als "past omdat" tonen
      koWords.forEach(function(w){ if(WHY[w.id]) why.push(WHY[w.id]); });
      // tie-break: lichte bonus goede reviewscore
      var rate=parseFloat(String(t.highlights&&t.highlights.join(' ')||'').replace(',','.').match(/(\d+\.\d)/)?RegExp.$1:'0');
      scored.push({ trip:t, v:v, score:score, reviewBonus:rate, why:why });
    });

    scored.sort(function(a,b){
      if(b.score!==a.score) return b.score-a.score;
      if(b.reviewBonus!==a.reviewBonus) return b.reviewBonus-a.reviewBonus;
      return a.v.prijs-b.v.prijs;
    });
    // bestemmingsdiversiteit: max 2 per land
    var perLand={}, out=[];
    scored.forEach(function(s){
      var land=(s.trip.destination||'').split(',').pop().trim();
      perLand[land]=(perLand[land]||0)+1;
      if(perLand[land]<=2) out.push(s);
    });
    return out;
  }

  // ---------- render results ----------
  function renderResults(){
    var res=match();
    var box=document.getElementById('results');
    box.hidden=false;
    if(!res.length){
      box.innerHTML='<div class="empty"><strong>Niks gevonden met deze combinatie.</strong> Probeer een woord of maand los te laten — de knock-outs (adults only, klein budget, maand, land) zijn streng.</div>';
      box.scrollIntoView({behavior:'smooth',block:'start'}); return;
    }
    var top=res.slice(0,8);
    var html='<p class="res-head">Dit past het best bij jullie</p><p class="res-sub">'+res.length+' passende vakanties gevonden. De eerste drie zijn de sterkste match.</p>';
    top.forEach(function(s,i){
      var t=s.trip, v=s.v, vIdx=t.variants.indexOf(v);
      var img=esc(t.imageUrl||'');
      var why=s.why.slice(0,4).map(function(w){return '<span>'+esc(w)+'</span>';}).join('');
      html+='<div class="res-card'+(i<3?' top':'')+'">'+
        (img?'<img src="'+img+'" alt="'+esc(t.hotelName||t.title)+'" loading="lazy" width="132" height="150">':'')+
        '<div class="rc-in">'+
          (i<3?'<span class="rc-rank">#'+(i+1)+' match</span>':'')+
          '<p class="rc-name">'+esc(t.hotelName||t.title)+'</p>'+
          '<p class="rc-dest">'+esc(t.destination)+' &middot; '+esc(t.boardType)+' &middot; '+esc(t.vluchtduur)+' vliegen</p>'+
          (why?'<p class="rc-why"><em style="color:var(--stone);font-size:var(--text-sm);font-style:normal">past omdat:</em> '+why+'</p>':'')+
          '<div class="rc-bot">'+
            '<span class="rc-price">&euro;'+(Number(v.prijs)||0)+' <small>p.p. &middot; '+esc(cap(v.maand))+'</small></span>'+
            '<a class="rc-go" href="/api/go?id='+encodeURIComponent(t.id)+'&v='+encodeURIComponent(vIdx>=0?vIdx:0)+'" target="_blank" rel="noopener">Bekijk bij '+esc(t.aanbieder)+' &rarr;</a>'+
          '</div>'+
        '</div>'+
      '</div>';
    });
    box.innerHTML=html;
    box.scrollIntoView({behavior:'smooth',block:'start'});
  }

  document.getElementById('btnMatch').addEventListener('click', renderResults);
  document.getElementById('btnReset').addEventListener('click', function(){
    state={smaak:{},land:{},maand:{}};
    document.querySelectorAll('.chip').forEach(function(b){b.setAttribute('aria-pressed','false');});
    document.getElementById('results').hidden=true;
    updateWens();
    window.scrollTo({top:0,behavior:'smooth'});
  });

  updateWens();
})();
