(function(){
const CUR = '₽';
const DAY = 864e5;
const today = new Date(); today.setHours(0,0,0,0);
const T0 = +today;

const I = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.5 12h12L22 7H6.2"/>',
  chart:'<path d="M5 20V11M11 20V5M17 20v-7M3 20h18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  check:'<path d="M5 12.5 10 17l9-10"/>',
  truck:'<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  alert:'<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.01"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>'
};
const ic = (n,s=18)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

const nf1 = new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1});
const nf0 = new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0});
const fmt = n => nf1.format(n);
const money = n => nf0.format(Math.round(n))+' '+CUR;
const fdate = t => new Date(t).toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
const ftime = t => new Date(t).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const iso = t => { const d=new Date(t); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const plural = (n,f)=>{const a=Math.abs(n)%100,b=a%10;return f[a>10&&a<20?2:b>1&&b<5?1:b===1?0:2]};
const oid = id => 'ЗК-'+String(id).padStart(4,'0');
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

const SUP = {s1:'Молочная ферма «Луг»',s2:'Овощебаза «Зелёный ряд»',s3:'Мясной двор',s4:'Бакалея Опт',s5:'ПакСервис'};
const LOCS = ['Склад','Кухня','Кейтеринг'];
const CATS = ['Молочные','Овощи','Рыба и мясо','Бакалея','Напитки','Упаковка'];
const ST = {ok:'В норме',warn:'На исходе',bad:'Мало'};
const OST = {sent:['Отправлен','acc'],transit:['В пути','warn'],done:['Принят','ok']};
const RAW = [
 [1,'Сыр гауда','Молочные','кг',24.5,10,820,'Склад','s1',21],
 [2,'Томаты','Овощи','кг',6.2,15,260,'Кухня','s2',4],
 [3,'Молоко 3,2%','Молочные','л',14,20,95,'Кухня','s1',5],
 [4,'Лосось охлаждённый','Рыба и мясо','кг',8,10,2150,'Кухня','s3',2],
 [5,'Куриное филе','Рыба и мясо','кг',32,15,540,'Склад','s3',6],
 [6,'Сливки 33%','Молочные','л',4,8,420,'Кухня','s1',7],
 [7,'Картофель','Овощи','кг',120,50,45,'Склад','s2',30],
 [8,'Лук репчатый','Овощи','кг',18,20,38,'Склад','s2',40],
 [9,'Рис басмати','Бакалея','кг',46,20,210,'Склад','s4',300],
 [10,'Мука пшеничная','Бакалея','кг',60,25,55,'Склад','s4',180],
 [11,'Масло сливочное 82%','Молочные','кг',9,6,980,'Кухня','s1',25],
 [12,'Оливковое масло','Бакалея','л',7,6,1150,'Кухня','s4',400],
 [13,'Говядина, вырезка','Рыба и мясо','кг',5.5,8,1890,'Кухня','s3',4],
 [14,'Яйца С1','Молочные','шт',180,240,11,'Склад','s1',18],
 [15,'Шампиньоны','Овощи','кг',3,6,340,'Кейтеринг','s2',3],
 [16,'Салат айсберг','Овощи','шт',14,20,120,'Кейтеринг','s2',3],
 [17,'Вода негаз. 0,5 л','Напитки','шт',420,300,32,'Кейтеринг','s4',365],
 [18,'Сок апельсиновый 1 л','Напитки','шт',36,48,145,'Кейтеринг','s4',120],
 [19,'Контейнер 750 мл','Упаковка','шт',260,500,9,'Кейтеринг','s5',null],
 [20,'Стакан 300 мл','Упаковка','шт',900,400,4,'Кейтеринг','s5',null],
 [21,'Салфетки 2-слойные','Упаковка','уп',22,30,85,'Кейтеринг','s5',null],
 [22,'Сахар','Бакалея','кг',28,15,70,'Склад','s4',500],
 [23,'Креветки 16/20, зам.','Рыба и мясо','кг',6,5,1390,'Склад','s3',90],
 [24,'Пармезан','Молочные','кг',2.4,3,2400,'Кухня','s1',60]
];
const piece = it => it.unit==='шт'||it.unit==='уп';
const roundQ = (it,v) => piece(it) ? Math.max(1,Math.round(v)) : Math.round(v*10)/10;

function seed(){
  const items = RAW.map(r=>({id:r[0],name:r[1],cat:r[2],unit:r[3],qty:r[4],min:r[5],price:r[6],loc:r[7],sup:r[8],exp:r[9]==null?null:T0+r[9]*DAY}));
  const byId = id => items.find(i=>i.id===id);
  const mk = (id,sup,status,c,d,lines)=>({id,sup,status,created:T0+c*DAY+10*36e5,due:T0+d*DAY,note:'',lines:lines.map(([i,q])=>({id:i,qty:q,got:status==='done'?q:null,price:byId(i).price})),received:status==='done'?T0+d*DAY+11*36e5:null});
  const orders = [
    mk(138,'s3','done',-8,-6,[[5,20],[23,5]]),
    mk(139,'s2','done',-5,-3,[[7,80],[8,30]]),
    mk(140,'s5','transit',-2,1,[[20,500]]),
    mk(141,'s4','sent',-1,2,[[9,20],[12,6]])
  ];
  const hist = [];
  items.forEach(it=>{
    hist.push({id:it.id,t:T0-(5+it.id%4)*DAY+9*36e5,type:'in',qty:roundQ(it,it.min*1.4),note:SUP[it.sup]});
    hist.push({id:it.id,t:T0-DAY+(13+it.id%5)*36e5,type:'out',qty:roundQ(it,it.min*.3),note:it.loc==='Кейтеринг'?'Выездное мероприятие':'Производство, '+it.loc.toLowerCase()});
  });
  [[2,1.2,'Порча',-3],[16,4,'Порча',-2],[4,.8,'Истёк срок',-1],[20,25,'Бой/брак',-4],[3,2,'Истёк срок',-6]].forEach(([id,q,n,d])=>hist.push({id,t:T0+d*DAY+18*36e5,type:'off',qty:q,note:n}));
  return {v:1,items,orders,hist,nextId:142,loc:'all',draft:null,steps:{low:false,draft:false,sent:false,recv:false}};
}
const KEY='zapas-crm-demo-v1';
let S;
try{ const raw=localStorage.getItem(KEY); S = raw?JSON.parse(raw):null; if(!S||S.v!==1) S=null; }catch(e){ S=null; }
if(!S) S = seed();
const save = ()=>{ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} };
const U = {f:{q:'',cat:'all',st:'all'},sel:[],ordTab:'active',report:'low'};

const item = id => S.items.find(i=>i.id===+id);
const status = it => it.qty<it.min?'bad':it.qty<it.min*1.5?'warn':'ok';
const expDays = it => it.exp==null?null:Math.round((it.exp-T0)/DAY);
const vis = () => S.loc==='all'?S.items:S.items.filter(i=>i.loc===S.loc);
const daily = it => it.min/6;
function suggest(it){
  let need = it.min*2 - it.qty; if(need<=0) need = it.min*.5;
  return piece(it) ? Math.ceil(need/10)*10 : Math.ceil(need);
}
const orderSum = o => o.lines.reduce((s,l)=>s+(o.status==='done'?l.got:l.qty)*l.price,0);
const stockVal = list => list.reduce((s,i)=>s+i.qty*i.price,0);

function expCell(it){
  const d = expDays(it); if(d==null) return '<span class="small">—</span>';
  if(d<0) return '<span class="red">просрочен</span>';
  if(d<=3) return `<span class="red">${d===0?'сегодня':d+' '+plural(d,['день','дня','дней'])}</span>`;
  if(d<=7) return `<span class="amber">${d} ${plural(d,['день','дня','дней'])}</span>`;
  return `<span class="small">до ${fdate(it.exp)}</span>`;
}
const pill = it => `<span class="pill ${status(it)}">${ST[status(it)]}</span>`;
const opill = o => `<span class="pill ${OST[o.status][1]}">${OST[o.status][0]}</span>`;

/* ---------- charts ---------- */
function lineChart(vals, labels, fmtY){
  const W=560,H=190,L=58,R=14,Tp=14,B=26;
  let mn=Math.min(...vals), mx=Math.max(...vals); const pad=(mx-mn)*.15||mx*.1||1; mn-=pad; mx+=pad;
  const x=i=>L+(W-L-R)*i/(vals.length-1), y=v=>Tp+(H-Tp-B)*(1-(v-mn)/(mx-mn));
  let g='';
  for(let k=0;k<4;k++){ const v=mn+(mx-mn)*k/3, yy=y(v); g+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="var(--line)"/><text x="${L-8}" y="${yy+4}" text-anchor="end">${fmtY(v)}</text>`; }
  const pts=vals.map((v,i)=>`${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const xl=[0,Math.floor((vals.length-1)/2),vals.length-1].map(i=>`<text x="${x(i)}" y="${H-6}" text-anchor="${i===0?'start':i===vals.length-1?'end':'middle'}">${labels[i]}</text>`).join('');
  const lx=x(vals.length-1), ly=y(vals[vals.length-1]);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="График"><defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>${g}<path d="M${pts[0]} L${pts.join(' L')} L${x(vals.length-1)},${H-B} L${L},${H-B}Z" fill="url(#ga)"/><polyline points="${pts.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/><circle cx="${lx}" cy="${ly}" r="5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2.5"/>${xl}</svg>`;
}
function stockSeries(end){
  const r=rng(11+LOCS.indexOf(S.loc)); const v=new Array(30); v[29]=end;
  for(let i=28;i>=0;i--) v[i]=v[i+1]/(1+(r()-.42)*.07);
  return v;
}
const kfmt = v => v>=1e6? fmt(v/1e6)+' млн' : nf0.format(Math.round(v/1000))+' тыс';

/* ---------- views ---------- */
function vOverview(){
  const its=vis(), low=its.filter(i=>status(i)==='bad').sort((a,b)=>a.qty/a.min-b.qty/b.min);
  const exp=its.filter(i=>{const d=expDays(i);return d!=null&&d<=3}).sort((a,b)=>a.exp-b.exp);
  const active=S.orders.filter(o=>o.status!=='done').sort((a,b)=>a.due-b.due);
  const val=stockVal(its), ser=stockSeries(val), pct=(val/ser[0]-1)*100;
  const labels=ser.map((_,i)=>fdate(T0-(29-i)*DAY));
  return {title:'Обзор', sub:(S.loc==='all'?'Все площадки':S.loc)+' · '+today.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'}), html:`
  <div class="grid kpis">
    <button class="kpi" data-go="inventory" data-st="all"><span class="l">Позиций</span><span class="v">${its.length}</span><span class="h">${new Set(its.map(i=>i.cat)).size} категорий</span></button>
    <button class="kpi bad" data-go="inventory" data-st="bad"><span class="l">Низкий остаток</span><span class="v">${low.length}</span><span class="h">ниже минимума → заказать</span></button>
    <button class="kpi" data-go="orders"><span class="l">Закупки в работе</span><span class="v">${active.length}</span><span class="h">${active.filter(o=>o.status==='transit').length} в пути</span></button>
    <div class="kpi warn"><span class="l">Срок годности ≤ 3 дн.</span><span class="v">${exp.length}</span><span class="h">использовать в первую очередь</span></div>
  </div>
  <div class="grid g2 mt">
    <section class="card">
      <div class="card-h"><h2>Остатки на складе</h2><button class="link" data-go="inventory" data-st="all">Весь инвентарь ${ic('arrow',14)}</button></div>
      <div class="tbl-wrap"><table><thead><tr><th>Товар</th><th class="hide-sm">Площадка</th><th class="num">Остаток</th></tr></thead><tbody>
      ${its.slice(0,6).map(i=>`<tr class="click" data-go="item-${i.id}"><td class="nm">${i.name}</td><td class="hide-sm small">${i.loc}</td><td class="num">${fmt(i.qty)} ${i.unit}<span class="dot ${status(i)}" title="${ST[status(i)]}"></span></td></tr>`).join('')}
      </tbody></table></div>
    </section>
    <section class="card">
      <div class="card-h"><h2>Динамика запасов</h2><span class="pill ${pct>=0?'ok':'bad'}">${pct>=0?'+':''}${fmt(pct)}%</span></div>
      <div class="small" style="margin-bottom:6px">Стоимость запаса · сейчас <b style="color:var(--fg)">${money(val)}</b></div>
      ${lineChart(ser,labels,v=>kfmt(v))}
    </section>
  </div>
  <div class="grid g2e mt">
    <section class="card">
      <div class="card-h"><h2>Требует внимания</h2>${low.length?`<button class="btn pri sm" data-act="order-low">${ic('cart',16)} Заказать всё (${low.length})</button>`:''}</div>
      <div class="list">
      ${low.slice(0,5).map(i=>`<button class="li" data-go="item-${i.id}"><span class="ico bad">${ic('alert',17)}</span><span class="grow"><span class="nm">${i.name}</span><br><span class="small">осталось ${fmt(i.qty)} ${i.unit} из минимума ${fmt(i.min)}</span></span>${ic('arrow',16)}</button>`).join('') || '<div class="empty"><b>Всё в норме</b>Нет позиций ниже минимума</div>'}
      ${low.length>5?`<button class="link" style="margin-top:10px" data-go="inventory" data-st="bad">Ещё ${low.length-5} ${plural(low.length-5,['позиция','позиции','позиций'])} ${ic('arrow',14)}</button>`:''}
      </div>
      ${exp.length?`<div class="small" style="margin:14px 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Скоро истекает срок</div><div class="list">${exp.map(i=>`<button class="li" data-go="item-${i.id}"><span class="ico">${ic('clock',17)}</span><span class="grow nm">${i.name}</span>${expCell(i)}</button>`).join('')}</div>`:''}
    </section>
    <section class="card">
      <div class="card-h"><h2>Закупки</h2><button class="link" data-go="new-order">${ic('plus',14)} Новая</button></div>
      <div class="list">
      ${active.map(o=>`<button class="li" data-go="order-${o.id}"><span class="ico">${ic(o.status==='transit'?'truck':'cart',17)}</span><span class="grow"><span class="nm">${oid(o.id)}</span> · ${SUP[o.sup]}<br><span class="small">${o.lines.length} ${plural(o.lines.length,['позиция','позиции','позиций'])} · ${money(orderSum(o))} · поставка ${fdate(o.due)}</span></span>${opill(o)}</button>`).join('') || '<div class="empty"><b>Нет активных закупок</b>Создайте заказ из списка позиций с низким остатком</div>'}
      </div>
    </section>
  </div>`};
}

function invFiltered(){
  const q=U.f.q.trim().toLowerCase();
  return vis().filter(i=>(!q||i.name.toLowerCase().includes(q)) && (U.f.cat==='all'||i.cat===U.f.cat) && (U.f.st==='all'||status(i)===U.f.st));
}
function invTable(){
  const list=invFiltered();
  if(!list.length) return '<div class="empty"><b>Ничего не найдено</b>Измените поиск или фильтры</div>';
  const allOn=list.every(i=>U.sel.includes(i.id));
  return `<div class="tbl-wrap"><table><thead><tr><th style="width:36px"><input type="checkbox" id="check-all" aria-label="Выбрать все" ${allOn?'checked':''}></th><th>Товар</th><th class="hide-sm">Площадка</th><th>Остаток</th><th class="num hide-sm">Мин.</th><th class="hide-sm">Срок годности</th><th>Статус</th></tr></thead><tbody>
  ${list.map(i=>{const s=status(i),w=Math.min(100,i.qty/(i.min*2)*100);return `<tr class="click" data-go="item-${i.id}"><td><input type="checkbox" class="row-check" data-id="${i.id}" aria-label="Выбрать ${i.name}" ${U.sel.includes(i.id)?'checked':''}></td><td><div class="nm">${i.name}</div><div class="small">${i.cat}</div></td><td class="hide-sm small">${i.loc}</td><td><div>${fmt(i.qty)} ${i.unit}</div><div class="bar"><i class="${s}" style="width:${w}%"></i></div></td><td class="num hide-sm small">${fmt(i.min)}</td><td class="hide-sm">${expCell(i)}</td><td>${pill(i)}</td></tr>`}).join('')}
  </tbody></table></div>`;
}
function selbar(){
  if(!U.sel.length) return '';
  return `<div class="selbar"><span><b>${U.sel.length}</b> ${plural(U.sel.length,['позиция выбрана','позиции выбрано','позиций выбрано'])}</span><span class="tools"><button class="btn ghost sm" data-act="clear-sel">Снять выбор</button><button class="btn pri sm" data-act="draft-sel">${ic('cart',16)} Создать закупку</button></span></div>`;
}
function vInventory(){
  if(U.f.st==='bad' && !S.steps.low){ S.steps.low=true; save(); }
  const its=vis();
  return {title:'Инвентарь', sub:`${its.length} ${plural(its.length,['позиция','позиции','позиций'])} · стоимость запаса ${money(stockVal(its))}`,
  action:`<button class="btn" data-go="new-order">${ic('plus',16)} Новая закупка</button>`, html:`
  <section class="card">
    <div class="toolbar">
      <label class="search">${ic('search',16)}<input class="input" id="inv-q" type="search" placeholder="Найти товар" value="${esc(U.f.q)}" aria-label="Поиск товара"></label>
      <div class="seg" role="group" aria-label="Статус">${[['all','Все'],['bad','Мало'],['warn','На исходе'],['ok','В норме']].map(([k,l])=>`<button data-act="st" data-v="${k}" class="${U.f.st===k?'on':''}">${l}${k==='bad'?' ('+its.filter(i=>status(i)==='bad').length+')':''}</button>`).join('')}</div>
    </div>
    <div class="chips" style="margin-bottom:12px">${['all',...CATS].map(c=>`<button class="chip ${U.f.cat===c?'on':''}" data-act="cat" data-v="${c}">${c==='all'?'Все категории':c}</button>`).join('')}</div>
    <div id="inv-table">${invTable()}</div>
  </section>
  <div id="selbar-slot">${selbar()}</div>
  ${U.f.st==='bad'&&!U.sel.length?`<p class="small" style="margin-top:10px">Отметьте позиции галочками или нажмите на заголовок столбца, чтобы выбрать все, затем создайте закупку.</p>`:''}`};
}

function vItem(id){
  const it=item(id); if(!it) return vNotFound();
  const r=rng(it.id*31); const cons=Array.from({length:14},()=>daily(it)*(.55+r()*.9));
  const mx=Math.max(...cons);
  const h=S.hist.filter(x=>x.id===it.id).sort((a,b)=>b.t-a.t);
  const daysLeft=Math.floor(it.qty/daily(it));
  const pend=S.orders.filter(o=>o.status!=='done'&&o.lines.some(l=>l.id===it.id));
  const T={in:['Приход','ok','+'],out:['Расход','acc','−'],off:['Списание','bad','−']};
  return {back:['inventory','Инвентарь'], title:it.name, sub:`${it.cat} · ${it.loc} · поставщик: ${SUP[it.sup]}`,
  action:`${pill(it)}<button class="btn pri" data-act="order-item" data-id="${it.id}">${ic('cart',16)} Заказать</button>`, html:`
  <div class="stats">
    <div><div class="l">Остаток</div><div class="v" style="color:var(--${status(it)==='ok'?'fg':status(it)})">${fmt(it.qty)} ${it.unit}</div></div>
    <div><div class="l">Минимум</div><div class="v">${fmt(it.min)} ${it.unit}</div></div>
    <div><div class="l">Хватит примерно на</div><div class="v">${daysLeft} ${plural(daysLeft,['день','дня','дней'])}</div></div>
    <div><div class="l">Цена · стоимость</div><div class="v">${money(it.price)}<span class="small"> /${it.unit} · ${money(it.qty*it.price)}</span></div></div>
  </div>
  ${pend.length?`<div class="card mt" style="padding:12px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">${ic('truck',18)}<span>Уже в заказе: ${pend.map(o=>`<button class="link" data-go="order-${o.id}">${oid(o.id)}</button> (${fmt(o.lines.find(l=>l.id===it.id).qty)} ${it.unit}, ${OST[o.status][0].toLowerCase()})`).join(', ')}</span></div>`:''}
  <div class="grid g2 mt">
    <section class="card">
      <div class="card-h"><h2>Расход за 14 дней</h2><span class="small">в среднем ${fmt(daily(it))} ${it.unit} в день</span></div>
      <div class="spark">${cons.map(v=>`<i style="height:${(v/mx*100).toFixed(0)}%" title="${fmt(v)} ${it.unit}"></i>`).join('')}</div>
      <div class="small" style="display:flex;justify-content:space-between;margin-top:6px"><span>${fdate(T0-13*DAY)}</span><span>сегодня</span></div>
      <div class="card-h" style="margin-top:20px"><h2>История движения</h2></div>
      <div class="tbl-wrap"><table><thead><tr><th>Дата</th><th>Операция</th><th class="num">Кол-во</th><th class="hide-sm">Комментарий</th></tr></thead><tbody>
      ${h.map(x=>`<tr><td class="small">${ftime(x.t)}</td><td><span class="pill ${T[x.type][1]}">${T[x.type][0]}</span></td><td class="num">${T[x.type][2]}${fmt(x.qty)} ${it.unit}</td><td class="hide-sm small">${esc(x.note)}</td></tr>`).join('')}
      </tbody></table></div>
    </section>
    <div class="grid" style="align-content:start">
      <section class="card">
        <div class="card-h"><h2>Списать</h2></div>
        <div class="form-row">
          <div class="field" style="flex:1 1 110px"><label for="wo-qty">Количество, ${it.unit}</label><input class="input" id="wo-qty" type="number" min="0" step="${piece(it)?1:.1}" placeholder="0"></div>
          <div class="field" style="flex:1 1 140px"><label for="wo-reason">Причина</label><select class="select" id="wo-reason"><option>Истёк срок</option><option>Порча</option><option>Бой/брак</option><option>Дегустация</option></select></div>
          <button class="btn" data-act="writeoff" data-id="${it.id}">Списать</button>
        </div>
        <p class="small" id="wo-err" style="margin:8px 0 0"></p>
      </section>
      <section class="card">
        <div class="card-h"><h2>Минимальный остаток</h2></div>
        <p class="small" style="margin:0 0 10px">Ниже этого уровня позиция попадает в «Низкий остаток» и предлагается к заказу.</p>
        <div class="form-row">
          <div class="field" style="flex:1 1 110px"><label for="min-in">Минимум, ${it.unit}</label><input class="input" id="min-in" type="number" min="0" value="${it.min}"></div>
          <button class="btn" data-act="set-min" data-id="${it.id}">Сохранить</button>
        </div>
      </section>
      <section class="card">
        <div class="card-h"><h2>Срок годности</h2>${expCell(it)}</div>
        <p class="small" style="margin:0">${it.exp?'Годен до '+new Date(it.exp).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})+'. Партии расходуются по принципу FEFO: сначала с ближайшим сроком.':'Непищевая позиция, срок не отслеживается.'}</p>
      </section>
    </div>
  </div>`};
}

function vOrders(){
  const list=S.orders.filter(o=>U.ordTab==='all'||(U.ordTab==='active'?o.status!=='done':o.status==='done')).sort((a,b)=>b.id-a.id);
  const act=S.orders.filter(o=>o.status!=='done');
  return {title:'Закупки', sub:`${act.length} в работе на ${money(act.reduce((s,o)=>s+orderSum(o),0))}`,
  action:`<button class="btn pri" data-go="new-order">${ic('plus',16)} Новая закупка</button>`, html:`
  <section class="card">
    <div class="toolbar"><div class="seg" role="group" aria-label="Фильтр заказов">${[['active','В работе'],['done','Принятые'],['all','Все']].map(([k,l])=>`<button data-act="otab" data-v="${k}" class="${U.ordTab===k?'on':''}">${l}</button>`).join('')}</div></div>
    ${list.length?`<div class="tbl-wrap"><table><thead><tr><th>Заказ</th><th>Поставщик</th><th class="num hide-sm">Позиций</th><th class="num">Сумма</th><th class="hide-sm">Поставка</th><th>Статус</th></tr></thead><tbody>
    ${list.map(o=>`<tr class="click" data-go="order-${o.id}"><td class="nm">${oid(o.id)}</td><td>${SUP[o.sup]}</td><td class="num hide-sm">${o.lines.length}</td><td class="num">${money(orderSum(o))}</td><td class="hide-sm">${fdate(o.due)}</td><td>${opill(o)}</td></tr>`).join('')}
    </tbody></table></div>`:'<div class="empty"><b>Заказов нет</b>Создайте новую закупку</div>'}
  </section>`};
}

function vNewOrder(){
  if(!S.draft) S.draft={lines:[],due:iso(T0+2*DAY),note:''};
  const d=S.draft;
  if(d.lines.length && !S.steps.draft){ S.steps.draft=true; save(); }
  const groups={}; d.lines.forEach(l=>{const it=item(l.id);(groups[it.sup]=groups[it.sup]||[]).push(l)});
  const sups=Object.keys(groups);
  const total=d.lines.reduce((s,l)=>s+l.qty*item(l.id).price,0);
  const avail=S.items.filter(i=>!d.lines.some(l=>l.id===i.id)).sort((a,b)=>(status(a)==='bad'?0:1)-(status(b)==='bad'?0:1)||a.name.localeCompare(b.name,'ru'));
  return {back:['orders','Закупки'], title:'Новая закупка', sub:'Позиции автоматически разделятся на заказы по поставщикам', html:`
  <div class="grid g2">
    <section class="card">
      <div class="card-h"><h2>Состав</h2><span class="small">${d.lines.length} ${plural(d.lines.length,['позиция','позиции','позиций'])}</span></div>
      ${sups.length?sups.map(s=>{const ls=groups[s];return `<div class="sgroup"><div class="sgroup-h"><span>${SUP[s]}</span><span class="small">${money(ls.reduce((a,l)=>a+l.qty*item(l.id).price,0))}</span></div><div class="tbl-wrap" style="margin:0"><table><thead><tr><th>Товар</th><th class="hide-sm num">Сейчас</th><th>Заказать</th><th class="num">Сумма</th><th></th></tr></thead><tbody>
      ${ls.map(l=>{const it=item(l.id);return `<tr><td><div class="nm">${it.name}</div><div class="small">${money(it.price)} / ${it.unit}</div></td><td class="hide-sm num"><span class="${status(it)==='bad'?'red':''}">${fmt(it.qty)}</span> <span class="small">/ ${fmt(it.min)}</span></td><td><span class="unit-in"><input class="input qty line-qty" type="number" min="0" step="${piece(it)?1:.5}" value="${l.qty}" data-id="${it.id}" aria-label="Количество ${it.name}"><span class="small">${it.unit}</span></span></td><td class="num">${money(l.qty*it.price)}</td><td><button class="icon-btn" data-act="rm-line" data-id="${it.id}" aria-label="Убрать ${it.name}">${ic('x',16)}</button></td></tr>`}).join('')}
      </tbody></table></div></div>`}).join(''):'<div class="empty"><b>Пока пусто</b>Добавьте товары ниже или выберите позиции в инвентаре</div>'}
      <div class="form-row" style="margin-top:14px">
        <div class="field" style="flex:1 1 220px"><label for="add-item">Добавить товар</label><select class="select" id="add-item">${avail.map(i=>`<option value="${i.id}">${status(i)==='bad'?'● ':''}${i.name} — ${fmt(i.qty)} ${i.unit}</option>`).join('')}</select></div>
        <button class="btn" data-act="add-line">${ic('plus',16)} Добавить</button>
      </div>
    </section>
    <section class="card" style="align-self:start">
      <div class="card-h"><h2>Оформление</h2></div>
      <div class="grid" style="gap:12px">
        <div class="field"><label for="due">Желаемая дата поставки</label><input class="input" id="due" type="date" value="${d.due}" min="${iso(T0)}"></div>
        <div class="field"><label for="note">Комментарий поставщику</label><textarea class="input" id="note" rows="3" placeholder="Например: доставка до 9:00, служебный вход">${esc(d.note)}</textarea></div>
      </div>
      <div class="total"><span class="small">Итого</span><b>${money(total)}</b></div>
      ${sups.length>1?`<p class="small" style="margin:0 0 12px">Будет создано ${sups.length} ${plural(sups.length,['заказ','заказа','заказов'])}: по одному на каждого поставщика.</p>`:''}
      <button class="btn pri" style="width:100%;justify-content:center" data-act="submit-order" ${d.lines.length?'':'disabled'}>Отправить ${sups.length>1?sups.length+' '+plural(sups.length,['заказ','заказа','заказов']):'заказ'} поставщику</button>
    </section>
  </div>`};
}

function vOrder(id){
  const o=S.orders.find(x=>x.id===+id); if(!o) return vNotFound();
  const idx={sent:1,transit:2,done:3}[o.status];
  const st=['Создан','Отправлен','В пути','Принят'];
  const dates=[o.created,o.created+36e5,o.status!=='sent'?o.due-DAY:null,o.received];
  const done=o.status==='done';
  return {back:['orders','Закупки'], title:'Заказ '+oid(o.id), sub:`${SUP[o.sup]} · создан ${fdate(o.created)} · поставка ${fdate(o.due)}`, action:opill(o), html:`
  <section class="card">
    <div class="steps">${st.map((s,i)=>`<div class="${i<idx||(i===idx&&done)?'done':i===idx?'cur':''}">${s}${dates[i]&&i<=idx?`<br><span class="small">${fdate(dates[i])}</span>`:''}</div>`).join('')}</div>
  </section>
  <div class="grid g2 mt">
    <section class="card">
      <div class="card-h"><h2>${done?'Принято':'Приёмка поставки'}</h2>${done?'':'<span class="small">Сверьте фактическое количество с накладной</span>'}</div>
      <div class="tbl-wrap"><table><thead><tr><th>Товар</th><th class="num">Заказано</th><th>${done?'Принято':'Факт'}</th><th class="num">Сумма</th></tr></thead><tbody>
      ${o.lines.map(l=>{const it=item(l.id);const diff=done&&l.got!==l.qty;return `<tr><td><div class="nm">${it.name}</div><div class="small">${it.loc} · сейчас ${fmt(it.qty)} ${it.unit}</div></td><td class="num">${fmt(l.qty)} ${it.unit}</td><td>${done?`<span class="${diff?'amber':''}">${fmt(l.got)} ${it.unit}</span>${diff?'<div class="small">расхождение '+fmt(l.got-l.qty)+'</div>':''}`:`<span class="unit-in"><input class="input qty recv-qty" type="number" min="0" step="${piece(it)?1:.1}" value="${l.qty}" data-id="${it.id}" aria-label="Принято ${it.name}"><span class="small">${it.unit}</span></span>`}</td><td class="num">${money((done?l.got:l.qty)*l.price)}</td></tr>`}).join('')}
      </tbody></table></div>
      <div class="total"><span class="small">Итого по заказу</span><b>${money(orderSum(o))}</b></div>
    </section>
    <section class="card" style="align-self:start">
      <div class="card-h"><h2>Действия</h2></div>
      ${done?`<div class="li" style="border:0;padding:0"><span class="ico ok">${ic('check',17)}</span><span class="grow">Поставка принята ${ftime(o.received)}. Остатки обновлены, движение записано в историю товаров.</span></div>`:`
      <p class="small" style="margin:0 0 12px">После приёмки фактическое количество прибавится к остаткам, а в карточках товаров появится запись о приходе.</p>
      <div class="grid" style="gap:8px">
        <button class="btn pri" style="justify-content:center" data-act="receive" data-id="${o.id}">${ic('check',16)} Принять поставку</button>
        ${o.status==='sent'?`<button class="btn" style="justify-content:center" data-act="transit" data-id="${o.id}">${ic('truck',16)} Отметить «В пути»</button>`:''}
      </div>`}
      ${o.note?`<div class="small" style="margin-top:14px">Комментарий: ${esc(o.note)}</div>`:''}
    </section>
  </div>`};
}

function vAnalytics(){
  const its=vis();
  const byCat=CATS.map(c=>[c,its.filter(i=>i.cat===c).reduce((s,i)=>s+daily(i)*30*i.price,0)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
  const mx=Math.max(...byCat.map(x=>x[1]),1);
  const cons30=byCat.reduce((s,x)=>s+x[1],0);
  const offs=S.hist.filter(h=>h.type==='off'&&h.t>T0-30*DAY&&its.some(i=>i.id===h.id));
  const offVal=offs.reduce((s,h)=>s+h.qty*item(h.id).price,0);
  const val=stockVal(its), turn=cons30?Math.round(val/(cons30/30)):0;
  const buy=S.orders.filter(o=>o.created>T0-30*DAY).reduce((s,o)=>s+orderSum(o),0);
  const reasons={}; offs.forEach(h=>reasons[h.note]=(reasons[h.note]||0)+h.qty*item(h.id).price);
  const R={
    low:['Дефицит','что заказать сейчас',['Товар','Площадка','Остаток','Минимум','К заказу'],its.filter(i=>status(i)==='bad').map(i=>[i.name,i.loc,fmt(i.qty)+' '+i.unit,fmt(i.min),fmt(suggest(i))+' '+i.unit])],
    stock:['Остатки на сегодня','по всем позициям',['Товар','Площадка','Остаток','Стоимость'],its.map(i=>[i.name,i.loc,fmt(i.qty)+' '+i.unit,money(i.qty*i.price)])],
    moves:['Движение товаров','приход, расход, списания',['Дата','Товар','Операция','Кол-во'],S.hist.filter(h=>its.some(i=>i.id===h.id)).sort((a,b)=>b.t-a.t).slice(0,40).map(h=>{const it=item(h.id);return [ftime(h.t),it.name,{in:'Приход',out:'Расход',off:'Списание'}[h.type],fmt(h.qty)+' '+it.unit]})],
    sup:['Закупки по поставщикам','за всё время',['Поставщик','Заказов','В работе','Сумма'],Object.keys(SUP).map(s=>{const os=S.orders.filter(o=>o.sup===s);return [SUP[s],os.length,os.filter(o=>o.status!=='done').length,money(os.reduce((a,o)=>a+orderSum(o),0))]})]
  };
  U._report=R[U.report];
  const [rt,,rh,rows]=R[U.report];
  return {title:'Аналитика и отчёты', sub:(S.loc==='all'?'Все площадки':S.loc)+' · последние 30 дней', html:`
  <div class="grid kpis">
    <div class="kpi"><span class="l">Расход за 30 дней</span><span class="v">${kfmt(cons30)}</span><span class="h">${CUR}, по себестоимости</span></div>
    <div class="kpi"><span class="l">Закупки за 30 дней</span><span class="v">${kfmt(buy)}</span><span class="h">${CUR}, ${S.orders.filter(o=>o.created>T0-30*DAY).length} заказов</span></div>
    <div class="kpi"><span class="l">Оборачиваемость</span><span class="v">${turn} дн.</span><span class="h">запаса хватит при текущем расходе</span></div>
    <div class="kpi ${offVal>0?'bad':''}"><span class="l">Списания</span><span class="v">${money(offVal)}</span><span class="h">${cons30?fmt(offVal/cons30*100):0}% от расхода</span></div>
  </div>
  <div class="grid g2 mt">
    <section class="card"><div class="card-h"><h2>Расход по категориям</h2><span class="small">${CUR} за 30 дней</span></div>
      ${byCat.map(([c,v])=>`<div class="hbar"><span>${c}</span><span class="track"><i style="width:${(v/mx*100).toFixed(1)}%"></i></span><span class="num" style="text-align:right">${kfmt(v)}</span></div>`).join('')}
    </section>
    <section class="card"><div class="card-h"><h2>Списания по причинам</h2></div>
      ${Object.keys(reasons).length?Object.entries(reasons).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="hbar"><span>${k}</span><span class="track"><i style="width:${(v/offVal*100).toFixed(1)}%;background:var(--bad)"></i></span><span style="text-align:right">${money(v)}</span></div>`).join(''):'<div class="empty">Списаний не было</div>'}
      <p class="small" style="margin:12px 0 0">Больше всего теряется на скоропортящихся овощах и рыбе. Помогает заказывать их чаще и меньшими партиями.</p>
    </section>
  </div>
  <section class="card mt">
    <div class="card-h"><h2>Отчёты</h2><button class="btn sm" data-act="copy-csv">${ic('copy',15)} Скопировать CSV</button></div>
    <div class="rtiles">${Object.entries(R).map(([k,r])=>`<button class="rtile ${U.report===k?'on':''}" data-act="report" data-v="${k}"><b>${r[0]}</b><span>${r[1]}</span></button>`).join('')}</div>
    <div class="tbl-wrap"><table><thead><tr>${rh.map((h,i)=>`<th class="${i>1?'num':''}">${h}</th>`).join('')}</tr></thead><tbody>
    ${rows.length?rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i>1?'num':''} ${i===0?'nm':''}">${c}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${rh.length}" class="empty">Отчёт «${rt}» пуст</td></tr>`}
    </tbody></table></div>
  </section>`};
}
function vNotFound(){ return {title:'Не найдено', sub:'', html:'<div class="card empty"><b>Такой страницы нет</b><button class="link" data-go="overview">Перейти к обзору</button></div>'}; }

/* ---------- shell ---------- */
const NAV=[['overview','Обзор','home'],['inventory','Инвентарь','box'],['orders','Закупки','cart'],['analytics','Аналитика','chart']];
function curRoute(){ return (location.hash||'#overview').slice(1); }
function section(r){ return r.startsWith('item-')?'inventory':(r.startsWith('order-')||r==='new-order')?'orders':r; }
function scenario(){
  const st=[['low','Найдите позиции с низким остатком','go-low'],['draft','Соберите из них закупку','order-low'],['sent','Отправьте заказ поставщику','go-draft'],['recv','Примите поставку, остатки обновятся','go-recv']];
  const n=st.filter(s=>S.steps[s[0]]).length; const next=st.findIndex(s=>!S.steps[s[0]]);
  return `<h3><span>Сценарий</span><span>${n}/4</span></h3><p>Пополнение запаса</p><ol>${st.map((s,i)=>`<li class="${S.steps[s[0]]?'done':i===next?'next':''}"><span class="b">${S.steps[s[0]]?ic('check',11):i+1}</span><span>${i===next?`<button data-act="${s[2]}">${s[1]} →</button>`:s[1]}</span></li>`).join('')}</ol><button class="reset" data-act="reset">Сбросить демо-данные</button>`;
}
function render(){
  const r=curRoute(); let v;
  if(r==='overview') v=vOverview();
  else if(r==='inventory') v=vInventory();
  else if(r.startsWith('item-')) v=vItem(r.slice(5));
  else if(r==='orders') v=vOrders();
  else if(r==='new-order') v=vNewOrder();
  else if(r.startsWith('order-')) v=vOrder(r.slice(6));
  else if(r==='analytics') v=vAnalytics();
  else v=vNotFound();
  const sec=section(r), lowN=S.items.filter(i=>status(i)==='bad').length;
  document.getElementById('nav').innerHTML=NAV.map(([k,l,i])=>`<button class="${sec===k?'on':''}" data-go="${k}" ${sec===k?'aria-current="page"':''}>${ic(i,19)}<span>${l}</span>${k==='inventory'&&lowN?`<span class="count" title="Низкий остаток">${lowN}</span>`:''}</button>`).join('');
  const sc=scenario(); document.getElementById('scn-side').innerHTML=sc; document.getElementById('scn-top').innerHTML=r==='overview'?sc:'';
  document.querySelector('.scn-top').hidden = r!=='overview';
  document.getElementById('view').innerHTML=`
    <div class="top"><div>${v.back?`<button class="crumb" data-go="${v.back[0]}">${ic('back',15)} ${v.back[1]}</button>`:''}<h1>${v.title}</h1>${v.sub?`<div class="sub">${v.sub}</div>`:''}</div>
    <div class="tools">${v.action||''}<select class="select" id="loc" aria-label="Площадка"><option value="all">Все площадки</option>${LOCS.map(l=>`<option ${S.loc===l?'selected':''}>${l}</option>`).join('')}</select></div></div>${v.html}`;
  document.title='Запас CRM';
}
function go(r){ if(curRoute()===r) render(); else location.hash=r; window.scrollTo(0,0); }
let tt; function toast(m){ const t=document.getElementById('toast'); t.innerHTML=ic('check',18)+'<span>'+m+'</span>'; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),3200); }

function draftFrom(ids){
  if(!S.draft) S.draft={lines:[],due:iso(T0+2*DAY),note:''};
  ids.forEach(id=>{ if(!S.draft.lines.some(l=>l.id===id)) S.draft.lines.push({id,qty:suggest(item(id))}); });
  save(); go('new-order');
}
function syncDraftFields(){
  if(!S.draft) return;
  const due=document.getElementById('due'), note=document.getElementById('note');
  if(due) S.draft.due=due.value||S.draft.due; if(note) S.draft.note=note.value;
}

const ACT={
  'order-low':()=>{ S.steps.low=true; draftFrom(vis().filter(i=>status(i)==='bad').map(i=>i.id)); },
  'go-low':()=>{ U.f={q:'',cat:'all',st:'bad'}; go('inventory'); },
  'go-draft':()=>go('new-order'),
  'go-recv':()=>{ const o=S.orders.filter(o=>o.status!=='done').sort((a,b)=>b.id-a.id)[0]; go(o?'order-'+o.id:'orders'); },
  'st':el=>{ U.f.st=el.dataset.v; render(); },
  'cat':el=>{ U.f.cat=el.dataset.v; render(); },
  'otab':el=>{ U.ordTab=el.dataset.v; render(); },
  'clear-sel':()=>{ U.sel=[]; render(); },
  'draft-sel':()=>{ const ids=U.sel.slice(); U.sel=[]; draftFrom(ids); },
  'order-item':el=>draftFrom([+el.dataset.id]),
  'rm-line':el=>{ syncDraftFields(); S.draft.lines=S.draft.lines.filter(l=>l.id!==+el.dataset.id); save(); render(); },
  'add-line':()=>{ syncDraftFields(); const s=document.getElementById('add-item'); if(!s||!s.value) return; const id=+s.value; S.draft.lines.push({id,qty:suggest(item(id))}); save(); render(); },
  'submit-order':()=>{
    syncDraftFields(); const d=S.draft; if(!d||!d.lines.length) return;
    const groups={}; d.lines.filter(l=>l.qty>0).forEach(l=>{const s=item(l.id).sup;(groups[s]=groups[s]||[]).push(l)});
    const due=new Date(d.due+'T00:00').getTime()||T0+2*DAY; const made=[];
    Object.entries(groups).forEach(([sup,ls])=>{ const id=S.nextId++; made.push(id);
      S.orders.push({id,sup,status:'sent',created:Date.now(),due,note:d.note,received:null,lines:ls.map(l=>({id:l.id,qty:l.qty,got:null,price:item(l.id).price}))}); });
    if(!made.length) return;
    S.draft=null; S.steps.draft=true; S.steps.sent=true; save();
    U.ordTab='active'; go(made.length===1?'order-'+made[0]:'orders');
    toast(`${made.length===1?'Заказ':'Заказы'} ${made.map(oid).join(', ')} ${made.length===1?'отправлен':'отправлены'} поставщику`);
  },
  'transit':el=>{ const o=S.orders.find(x=>x.id===+el.dataset.id); o.status='transit'; save(); render(); toast(oid(o.id)+': в пути'); },
  'receive':el=>{
    const o=S.orders.find(x=>x.id===+el.dataset.id);
    document.querySelectorAll('.recv-qty').forEach(inp=>{ const l=o.lines.find(x=>x.id===+inp.dataset.id); const v=Math.max(0,parseFloat(inp.value)||0); l.got=v; });
    o.lines.forEach(l=>{ const it=item(l.id); it.qty=roundQ(it,it.qty+l.got); if(it.exp!=null) it.exp=Math.max(it.exp,T0+(RAW.find(r=>r[0]===it.id)[9]||7)*DAY); S.hist.push({id:it.id,t:Date.now(),type:'in',qty:l.got,note:'Приёмка '+oid(o.id)}); });
    o.status='done'; o.received=Date.now(); S.steps.recv=true; save(); render(); toast('Поставка принята, остатки обновлены');
  },
  'writeoff':el=>{
    const it=item(el.dataset.id), v=parseFloat(document.getElementById('wo-qty').value), reason=document.getElementById('wo-reason').value;
    const err=document.getElementById('wo-err');
    if(!(v>0)){ err.textContent='Укажите количество больше нуля.'; return; }
    if(v>it.qty){ err.textContent=`На остатке только ${fmt(it.qty)} ${it.unit}.`; return; }
    it.qty=roundQ(it,it.qty-v); S.hist.push({id:it.id,t:Date.now(),type:'off',qty:v,note:reason}); save(); render(); toast(`Списано ${fmt(v)} ${it.unit}: ${reason.toLowerCase()}`);
  },
  'set-min':el=>{ const it=item(el.dataset.id), v=parseFloat(document.getElementById('min-in').value); if(!(v>=0)) return; it.min=v; save(); render(); toast('Минимум сохранён'); },
  'report':el=>{ U.report=el.dataset.v; render(); },
  'copy-csv':()=>{
    const r=U._report; if(!r) return;
    const csv=[r[2],...r[3]].map(row=>row.map(c=>'"'+String(c).replace(/ /g,' ').replace(/"/g,'""')+'"').join(';')).join('\n');
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(csv).then(()=>toast('CSV скопирован: «'+r[0]+'»'),()=>toast('Не удалось скопировать: браузер запретил доступ к буферу'));
    else toast('Копирование недоступно в этом браузере');
  },
  'reset':()=>{ S=seed(); U.sel=[]; U.f={q:'',cat:'all',st:'all'}; save(); go('overview'); toast('Демо-данные восстановлены'); }
};

document.addEventListener('click',e=>{
  const t=e.target;
  if(t.matches('input[type=checkbox]')){
    if(t.id==='check-all'){ const ids=invFiltered().map(i=>i.id); U.sel = t.checked ? [...new Set([...U.sel,...ids])] : U.sel.filter(id=>!ids.includes(id)); }
    else if(t.classList.contains('row-check')){ const id=+t.dataset.id; U.sel = t.checked ? [...U.sel,id] : U.sel.filter(x=>x!==id); }
    document.getElementById('inv-table').innerHTML=invTable(); document.getElementById('selbar-slot').innerHTML=selbar();
    return;
  }
  if(t.closest('input,select,textarea,label.search')) return;
  const a=t.closest('[data-act]'); if(a){ e.preventDefault(); if(!a.disabled) ACT[a.dataset.act]&&ACT[a.dataset.act](a); return; }
  const g=t.closest('[data-go]'); if(g){ if(g.dataset.st) U.f={q:'',cat:'all',st:g.dataset.st}; go(g.dataset.go); }
});
document.addEventListener('input',e=>{
  if(e.target.id==='inv-q'){ U.f.q=e.target.value; document.getElementById('inv-table').innerHTML=invTable(); }
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='loc'){ S.loc=t.value; save(); render(); }
  else if(t.classList.contains('line-qty')){ syncDraftFields(); const l=S.draft.lines.find(x=>x.id===+t.dataset.id); l.qty=Math.max(0,parseFloat(t.value)||0); save(); render(); }
  else if(t.id==='due'||t.id==='note'){ syncDraftFields(); save(); }
});
window.addEventListener('hashchange',render);
document.getElementById('logo-ic').innerHTML=ic('box',17);
render();
})();
