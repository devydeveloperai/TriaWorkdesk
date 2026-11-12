'use strict';
const paths={grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',tasks:'M8 4H5v17h14V4h-3M9 2h6v4H9zM8 11l1 1 2-2M13 11h3M8 16l1 1 2-2M13 16h3',building:'M3 21V9h6V3h8v18M1 21h22M17 11h4v10M6 12v1M6 16v1M12 6v1M12 10v1M12 14v1M12 18v3',crane:'M4 21V3l15 5H2M8 4v17M2 21h8M18 8v7l2 2-2 2-2-2M4 9l4 4-4 4 4 4',file:'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h6',helmet:'M3 16v-2a9 9 0 0 1 18 0v2M2 16h20v4H2zM9 13V5M15 13V5M10 3h4',folder:'M3 6h6l2 2h10v13H3zM3 8V3h6l2 3h9v2',users:'M16 21v-3a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v3M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 3a4 4 0 0 1 0 8M21 21v-3a4 4 0 0 0-3-4',calendar:'M3 5h18v16H3zM3 10h18M7 2v5M17 2v5M7 14h1M12 14h1M17 14h1M7 18h1M12 18h1',chart:'M3 3v18h19M7 17V9h3v8M13 17V4h3v13M19 17v-6h3v6',settings:'M9 3h6l1 4 4 1 1 6-4 2-1 4H9l-1-4-4-1-1-6 4-2zM15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0',search:'m21 21-6-6M17 10a7 7 0 1 0-14 0 7 7 0 0 0 14 0',bell:'M5 17V10a7 7 0 0 1 14 0v7l2 2H3zM10 22h4',plus:'M12 5v14M5 12h14',mail:'M3 5h18v14H3zM3 5l9 8 9-8',lock:'M5 10h14v12H5zM8 10V6a4 4 0 0 1 8 0v4M12 15v3',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0',shield:'M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6zM8 12l3 3 5-6',arrow:'M5 12h14M15 8l4 4-4 4',chevron:'m9 5 7 7-7 7',upload:'M12 16V2M6 8l6-6 6 6M3 14v7h18v-7',addfile:'M5 2h9l5 5v15H5zM14 2v6h5M12 11v7M9 14h6',info:'M12 11v6M12 7v1M22 12a10 10 0 1 0-20 0 10 10 0 0 0 20 0',logout:'M9 3H3v18h6M9 12h13M17 7l5 5-5 5',close:'M6 6l12 12M18 6 6 18',menu:'M3 6h18M3 12h18M3 18h18',download:'M12 2v14M6 10l6 6 6-6M3 17v5h18v-5',
 // Finans & Muhasebe için cüzdan ikonu; düzenle/sil düğmeleri için kalem ve çöp kutusu.
 wallet:'M3 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-4 2 4M16 13h5v4h-5a2 2 0 0 1 0-4M17 15h1',
 edit:'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
 trash:'M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V3h6v4',
 // Google Workspace ve Gemini ekranları için ikonlar.
 cloud:'M7 19a5 5 0 1 1 1.2-9.85A6 6 0 0 1 19.6 11 4 4 0 0 1 18 19z',
 sparkle:'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
 reply:'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 6 6v5',
 send:'M22 2 11 13M22 2l-7 20-4-9-9-4z',
 external:'M14 3h7v7M10 14 21 3M19 14v7H3V5h7',
 refresh:'M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v5h-5'};
const icon=(name)=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.file}"/></svg>`;
const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brand=(caption=false)=>`<div class="brand"><div class="wordmark"><span>EKŞİOĞLU</span><span class="second">TRI<svg class="triangles" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 1 8 13h14ZM7 15 0 28h14ZM23 15 16 28h14Z"/></svg></span></div>${caption?'<span class="brand-caption">İş Yönetim Sistemi</span>':''}</div>`;
const app=document.querySelector('#app'), modal=document.querySelector('#modal');
let user=null,csrf='',state={tasks:[],projects:[],users:[],documents:[],members:[],roles:[]},page='Genel Bakış',query='',statusFilter='',projectFilter='',calendarDate=new Date(),adminLogin=location.pathname==='/admin';
const statuses=['Planlandı','Devam ediyor','Beklemede','Tamamlandı'];
// Görev kategorileri (sunucudaki App::CATEGORIES ile aynı sırada olmalı).
const categories=['Genel','Kentsel Dönüşüm','Finans & Muhasebe','Belediye & Ruhsat','Şantiye','Satış & CRM'];
// Sol menü: üçüncü eleman, öğenin görünmesi için gereken yetkidir.
const nav=[['Genel Bakış','grid'],['Görevlerim','tasks'],['Projeler','building'],['Kentsel Dönüşüm','crane'],['Finans & Muhasebe','wallet'],['Belediye & Ruhsat','file'],['Şantiye','helmet'],['Evrak','folder'],['E-posta','mail','mail.use'],['Google Drive','cloud','drive.use'],['Satış & CRM','users'],['Takvim','calendar'],['Raporlar','chart'],['Ekip','users'],['Ayarlar','settings']];
const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dateLabel=(s)=>new Date(s+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
const projectName=id=>state.projects.find(p=>p.id===id)?.name||'—';
const personName=id=>state.users.find(p=>p.id===id)?.name||'—';
// Rol anahtarını okunabilir etikete çevirir (state.roles sunucudan gelir).
// Yetki yardımcıları: sunucu her rol için yetki listesini döndürür (yönetici: tümü).
const rolePerms=key=>state.roles?.find(r=>r.key===key)?.permissions||(key==='admin'?Object.keys(PERMISSIONS):[]);
const can=perm=>user?.role==='admin'||(user?.permissions||[]).includes(perm);
const seesAll=()=>can('projects.all');
const roleLabel=key=>state.roles?.find(r=>r.key===key)?.label||({admin:'Yönetici',employee:'Çalışan'}[key])||key;
// Kullanıcı projenin üyesi mi? (Yöneticiler tüm projelere erişir.)
const canAccessProject=(pid,person)=>rolePerms(person?.role).includes('projects.all')||state.members.some(m=>m.project_id===pid&&m.user_id===person?.id);
const initials=name=>name.split(' ').filter(Boolean).map(s=>s[0]).slice(0,2).join('').toLocaleUpperCase('tr');
function toast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),4500)}
async function api(path,method='GET',body){let response;try{response=await fetch('/api/'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},...(body?{body:JSON.stringify(body)}:{})})}catch{throw Error('Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.')}const data=await response.json();if(!response.ok){if(response.status===401&&user){user=null;modal.close();login()}throw Object.assign(Error(data.error||'İşlem tamamlanamadı.'),{status:response.status})}return data}
async function refresh(){state=await api('state');if(user&&state.permissions)user.permissions=state.permissions;render()}
function empty(title,message='Yeni kayıtlar burada görünecek.',name='folder'){return `<div class="empty">${icon(name)}<strong>${esc(title)}</strong>${esc(message)}</div>`}
function login(){app.innerHTML=`<main class="login"><div class="login-art" role="img" aria-label="Modern bina girişini gösteren mimari çizim"></div><section class="login-panel">${brand(true)}<h1>${adminLogin?'Yönetici':'Çalışan'} Girişi</h1><form id="login-form"><div class="error" role="alert"></div><label class="field"><span>Kurumsal e-posta</span><div class="input-icon">${icon('mail')}<input type="email" name="email" required maxlength="200" autocomplete="username" placeholder="ad.soyad@eksioglutria.com"></div></label><label class="field"><span>Şifre</span><div class="input-icon">${icon('lock')}<input type="password" id="password" name="password" required maxlength="1024" autocomplete="current-password"><button type="button" data-action="password-toggle" aria-label="Şifreyi göster">${icon('eye')}</button></div></label><div class="login-options"><label class="check"><input type="checkbox" name="remember"> Beni hatırla</label><button type="button" class="text-button" data-action="forgot">Şifremi unuttum</button></div><button class="primary login-submit" type="submit">Giriş Yap</button></form><div class="login-links"><button data-action="support">BT desteği</button><button data-action="login-mode">${adminLogin?'Çalışan':'Yönetici'} Girişi</button></div><div class="security">${icon('shield')}<p>Kurumsal erişim. Yalnızca davet edilen çalışanlar, kendilerine yetki verilen projelere erişebilir.</p></div></section></main>`;document.querySelector('#login-form').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,b=f.querySelector('[type=submit]');b.disabled=true;try{const fd=new FormData(f);const r=await api('login','POST',{email:fd.get('email'),password:fd.get('password'),remember:fd.has('remember'),admin:adminLogin});user=r.user;csrf=r.csrf;history.replaceState(null,'','/');await refresh()}catch(err){f.querySelector('.error').textContent=err.message}finally{b.disabled=false}}}
function invitation(){const token=location.hash.slice(1);history.replaceState(null,'','/invite');app.innerHTML=`<main class="login"><div class="login-art"></div><section class="login-panel">${brand(true)}<h1>Ekibe katılın</h1><p class="subtext">Size gönderilen davet ile kurumsal hesabınızı oluşturun.</p><form id="accept-form"><div class="error" role="alert"></div><label class="field"><span>Adınız ve soyadınız</span><input name="name" required maxlength="100" autocomplete="name"></label><label class="field"><span>Yeni şifre</span><input name="password" type="password" required minlength="12" maxlength="1024" autocomplete="new-password"><small class="subtext">En az 12 karakter kullanın.</small></label><label class="field"><span>Şifre tekrarı</span><input name="confirm" type="password" required minlength="12" autocomplete="new-password"></label><button class="primary login-submit">Hesabımı oluştur</button></form></section></main>`;document.querySelector('#accept-form').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,fd=new FormData(f),b=f.querySelector('button');b.disabled=true;try{if(fd.get('password')!==fd.get('confirm'))throw Error('Şifreler eşleşmiyor.');await api('invite/accept','POST',{token,name:fd.get('name'),password:fd.get('password')});history.replaceState(null,'','/');login();toast('Hesabınız oluşturuldu. Kurumsal e-postanızla giriş yapabilirsiniz.')}catch(err){f.querySelector('.error').textContent=err.message}finally{b.disabled=false}}}
function render(){if(!user)return login();app.innerHTML=`<div class="shell"><aside class="sidebar"><button class="mobile-close" data-action="menu" aria-label="Menüyü kapat">${icon('close')}</button>${brand()}<nav aria-label="Ana menü">${nav.filter(([,,perm])=>!perm||can(perm)).map(([name,ico])=>`<button class="nav-item ${page===name?'active':''}" data-page="${esc(name)}" ${page===name?'aria-current="page"':''}>${icon(ico)}${name==='Görevlerim'&&seesAll()?'Tüm Görevler':name}</button>`).join('')}</nav><div class="architecture" aria-hidden="true"><svg viewBox="0 0 180 140"><path d="M10 140V90L90 12 167 62v78M90 12v128M10 90l80 29 77-57M10 104l80 29 77-57M10 118l80 22 77-50M26 74v66M43 58v82M59 43v97M75 27v113M106 23v117M123 34v106M140 45v95M157 56v84"/></svg></div><div class="sidebar-bottom">EKŞİOĞLU TRIA İNŞAAT A.Ş.</div></aside><main class="main"><header class="topbar"><button class="menu-button" data-action="menu" aria-label="Menüyü aç">${icon('menu')}</button><div class="heading"><h1>${esc(page==='Görevlerim'&&seesAll()?'Tüm Görevler':page)}</h1><small>${user.role==='admin'?'Yönetici Portalı':user.role==='employee'?'Çalışan Portalı':esc(roleLabel(user.role))+' · Çalışan Portalı'}</small></div><label class="search">${icon('search')}<input id="search" aria-label="Görev ara" placeholder="Görev ara" value="${esc(query)}"></label><button class="icon-button" data-action="upcoming" aria-label="Yaklaşan görevler">${icon('bell')}${state.tasks.some(t=>t.status!=='Tamamlandı'&&t.due<=dateKey())?'<span class="dot"></span>':''}</button><button class="avatar" data-page="Ayarlar" aria-label="Hesap ayarları">${esc(initials(user.name))}</button><button class="primary" data-action="new-task">${icon('plus')}Yeni Görev</button></header><div id="content">${content()}</div></main>${geminiFab()}</div>`;afterRender();document.querySelector('#search').addEventListener('input',e=>{query=e.target.value;if(page!=='Görevlerim'){page='Görevlerim';document.querySelector('.heading h1').textContent=seesAll()?'Tüm Görevler':'Görevlerim';document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page))}document.querySelector('#content').innerHTML=taskPage()})}
function content(){if(page==='Genel Bakış')return dashboard();if(page==='E-posta')return can('mail.use')?mailPage():'';if(page==='Google Drive')return can('drive.use')?drivePage():'';if(page==='Projeler')return projects();if(page==='Evrak')return documents();if(page==='Takvim')return calendar();if(page==='Raporlar')return reports();if(page==='Ekip')return team();if(page==='Ayarlar')return settings();return taskPage()}
function stats(){const today=dateKey(),end=new Date();end.setDate(end.getDate()+((7-end.getDay())%7));const mine=seesAll()?state.tasks:state.tasks.filter(t=>t.assignee===user.id);const data=[[mine.filter(t=>t.status!=='Tamamlandı').length,'Açık görevler','tasks','Güncel iş listesi'],[mine.filter(t=>t.status!=='Tamamlandı'&&t.due>=today&&t.due<=dateKey(end)).length,'Bu hafta teslim','calendar','Planlanan teslimler'],[state.projects.length,'Aktif proje görünümü','building','Yetkili olduğunuz projeler'],[state.documents.length,'Kayıtlı evrak','folder','Proje dosyaları']];return `<section class="stats" aria-label="Genel durum">${data.map(([n,label,ico,note])=>`<div class="stat"><div class="stat-icon">${icon(ico)}</div><div><div class="stat-value">${String(n).padStart(2,'0')}</div><div class="stat-label">${label}</div><small>${note}</small></div></div>`).join('')}</section>`}
function badgeClass(s){return {'Devam ediyor':'progress','Beklemede':'wait','Tamamlandı':'done','Yüksek':'high','Orta':'medium','Düşük':'low'}[s]||'done'}
function taskTable(tasks){if(!tasks.length)return empty('Henüz görev yok','Yeni Görev düğmesiyle ilk işinizi planlayın.','tasks');return `<div class="table-wrap"><table><thead><tr><th>Görev</th><th>Sorumlu</th><th>Proje</th><th>Son tarih</th><th>Durum</th><th>Öncelik</th></tr></thead><tbody>${tasks.map(t=>`<tr><td><button class="text-button task-title" data-task="${t.id}">${esc(t.title)}</button></td><td class="muted">${esc(personName(t.assignee))}</td><td>${esc(projectName(t.project_id))}</td><td class="${t.due<dateKey()&&t.status!=='Tamamlandı'?'overdue':'muted'}">${dateLabel(t.due)}</td><td><span class="badge ${badgeClass(t.status)}">${can('tasks.assign')||t.assignee===user.id?`<select class="status-select" aria-label="${esc(t.title)} durumu" data-status="${t.id}">${statuses.map(s=>`<option${s===t.status?' selected':''}>${s}</option>`).join('')}</select>`:esc(t.status)}</span></td><td><span class="badge ${badgeClass(t.priority)}">${t.priority}</span></td></tr>`).join('')}</tbody></table></div>`}
function upcoming(){const tasks=state.tasks.filter(t=>t.status!=='Tamamlandı'&&(seesAll()||t.assignee===user.id)).slice(0,3);return `<section class="panel"><div class="panel-head"><h2>Yaklaşan görevler</h2></div>${tasks.length?`<div class="upcoming">${tasks.map(t=>`<div class="upcoming-item">${icon('calendar')}<div><strong>${esc(t.title)}</strong><small>${esc(projectName(t.project_id))}</small></div><span class="badge">${dateLabel(t.due)}</span></div>`).join('')}</div>`:empty('Takviminiz açık','Planladığınız görevler burada listelenir.','calendar')}<div class="panel-footer"><button data-page="Takvim">Tüm takvime git →</button></div></section>`}
function projectList(){return `<section class="panel"><div class="panel-head"><h2>Projeler</h2><button class="text-button" data-page="Projeler">Tümünü gör →</button></div>${state.projects.length?state.projects.slice(0,3).map(p=>`<button class="project-row" data-project="${p.id}"><span class="mini-logo">TRI<span>▲</span></span><strong>${esc(p.name)}</strong><small>${esc(p.location)}</small>${icon('chevron')}</button>`).join(''):empty('Henüz proje yok',can('projects.manage')?'Projeler sayfasından ilk projenizi oluşturun.':'Yöneticiniz sizi projeye eklediğinde burada görünecek.','building')}<div class="note">${icon('info')}Proje bilgileri erişim yetkilerinize göre görüntülenir.</div></section>`}
function quick(){return `<div class="stack"><section class="panel"><div class="panel-head"><h2>Hızlı işlemler</h2></div><div class="quick-actions"><button class="quick" data-action="new-task">${icon('addfile')}Görev oluştur</button><button class="quick" data-action="upload">${icon('upload')}Evrak yükle</button><button class="quick" data-page="Takvim">${icon('calendar')}Takvime bak</button></div></section><div class="blueprint">HER PROJEDE BİRLİKTE.</div></div>`}
function chart(){const counts=statuses.map(s=>state.tasks.filter(t=>t.status===s).length),total=state.tasks.length;let offset=0;return total?`<div class="report-layout"><svg class="donut" viewBox="0 0 160 160" role="img" aria-label="Görevlerin durum dağılımı"><circle cx="80" cy="80" r="58" stroke="#f1f1ef"/>${counts.map((n,i)=>{const length=n/total*364.425,svg=`<circle cx="80" cy="80" r="58" stroke="${['#5f83b7','#b5944e','#8a7fad','#799675'][i]}" stroke-dasharray="${length} ${364.425-length}" stroke-dashoffset="${-offset}"/>`;offset+=length;return svg}).join('')}</svg><div class="legend">${statuses.map((s,i)=>`<div><i class="c${i}"></i>${s}<b>${counts[i]}</b></div>`).join('')}</div></div>`:empty('Rapor için veri bekleniyor','Görevler oluşturulduğunda dağılım burada görünür.','chart')}
function reportCard(){return `<section class="panel"><div class="panel-head"><h2>Raporlar</h2><button class="text-button" data-page="Raporlar">Ayrıntılar →</button></div>${chart()}</section>`}
/* ==================================================================
 * GENEL BAKIŞ (DASHBOARD)
 * Kapsam: yönetici tüm görevleri, çalışan yalnızca kendi görevlerini görür.
 * Barlar SVG <rect width> niteliğiyle çizilir; CSP satır içi style'a izin vermez.
 * ================================================================== */
const DAY=86400000;
// İki YYYY-MM-DD tarihi arasındaki gün farkı (yerel saat dilimi kaymasından etkilenmez).
const daysBetween=(from,to)=>Math.round((new Date(to+'T12:00:00')-new Date(from+'T12:00:00'))/DAY);
const pct=(n,total)=>total?Math.round(n/total*100):0;
// Tek renkli ilerleme çubuğu. cls: c0–c3 (durum renkleri), done, gold.
const meter=(value,cls='gold',label='')=>`<svg class="meter" viewBox="0 0 100 8" preserveAspectRatio="none" role="img" aria-label="${esc(label||value+'%')}"><rect class="track" width="100" height="8" rx="4"/><rect class="fill ${cls}" width="${Math.max(0,Math.min(100,value))}" height="8" rx="4"/></svg>`;
function dashTasks(){return seesAll()?state.tasks:state.tasks.filter(t=>t.assignee===user.id)}
// 1) Özet istatistik kutuları.
function dashStats(){
 const tasks=dashTasks(),today=dateKey(),week=dateKey(new Date(Date.now()+7*DAY));
 const open=tasks.filter(t=>t.status!=='Tamamlandı');
 const data=[
  [String(open.length).padStart(2,'0'),'Bekleyen görevler','tasks',`${tasks.length} görevin açık olanları`],
  [String(open.filter(t=>t.due<today).length).padStart(2,'0'),'Geciken görevler','bell','Son tarihi geçmiş'],
  [String(open.filter(t=>t.due>=today&&t.due<=week).length).padStart(2,'0'),'7 gün içinde teslim','calendar','Yaklaşan teslimler'],
  ['%'+pct(tasks.length-open.length,tasks.length),'Tamamlanma oranı','chart',`${tasks.length-open.length} görev tamamlandı`]
 ];
 return `<section class="stats" aria-label="Özet metrikler">${data.map(([n,label,ico,note])=>`<div class="stat"><div class="stat-icon">${icon(ico)}</div><div><div class="stat-value">${n}</div><div class="stat-label">${label}</div><small>${esc(note)}</small></div></div>`).join('')}</section>`;
}
// 2) Durumlara göre dağılım.
function statusBars(){
 const tasks=dashTasks();
 if(!tasks.length)return `<section class="panel"><div class="panel-head"><h2>Durum dağılımı</h2></div>${empty('Henüz görev yok','Görevler oluşturulduğunda dağılım burada görünür.','chart')}</section>`;
 const rows=statuses.map((s,i)=>{const n=tasks.filter(t=>t.status===s).length;return `<div class="metric-row"><div class="metric-label"><span>${esc(s)}</span><b>${n} · %${pct(n,tasks.length)}</b></div>${meter(pct(n,tasks.length),'c'+i,s+' %'+pct(n,tasks.length))}</div>`}).join('');
 return `<section class="panel"><div class="panel-head"><h2>Durum dağılımı</h2><button class="text-button" data-page="Raporlar">Raporlar →</button></div><div class="metric-list">${rows}</div></section>`;
}
// 3) Yaklaşan ve geciken teslimler (14 gün ufku, en yakın 6 kayıt).
function deadlineList(){
 const today=dateKey(),limit=dateKey(new Date(Date.now()+14*DAY));
 const tasks=dashTasks().filter(t=>t.status!=='Tamamlandı'&&t.due<=limit).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,6);
 const tag=t=>{const d=daysBetween(today,t.due);return d<0?`<span class="badge overdue">${-d} gün gecikti</span>`:d===0?'<span class="badge high">Bugün</span>':`<span class="badge ${d<=3?'medium':''}">${d} gün kaldı</span>`};
 return `<section class="panel"><div class="panel-head"><h2>Yaklaşan teslim tarihleri</h2><button class="text-button" data-page="Takvim">Takvim →</button></div>${tasks.length?`<div class="deadline-list">${tasks.map(t=>`<button class="deadline-item" data-task="${t.id}">${icon('calendar')}<span><strong>${esc(t.title)}</strong><small>${esc(projectName(t.project_id))} · ${dateLabel(t.due)}</small></span>${tag(t)}</button>`).join('')}</div>`:empty('Önümüzdeki 14 gün açık','Yaklaşan veya geciken teslim bulunmuyor.','calendar')}</section>`;
}
// 4) Projelere göre görev dağılımı ve ilerleme (görünür tüm görevler üzerinden).
function projectDistribution(){
 const rows=state.projects.map(p=>{const all=state.tasks.filter(t=>t.project_id===p.id),done=all.filter(t=>t.status==='Tamamlandı').length;return {p,all:all.length,done}}).sort((a,b)=>b.all-a.all);
 const body=rows.length?rows.map(({p,all,done})=>`<div class="metric-row"><div class="metric-label"><button class="text-button" data-project="${p.id}">${esc(p.name)}</button><b>${all-done} açık · ${done}/${all} tamamlandı</b></div>${meter(pct(done,all),'done',p.name+' %'+pct(done,all)+' tamamlandı')}</div>`).join(''):empty('Henüz proje yok','Projeler oluşturulduğunda burada listelenir.','building');
 return `<section class="panel"><div class="panel-head"><h2>Projelere göre görevler</h2><button class="text-button" data-page="Projeler">Projeler →</button></div><div class="metric-list">${body}</div></section>`;
}
// 5) Çalışma alanlarına (kategori) göre görev sayıları.
function categoryDistribution(){
 const tasks=dashTasks(),max=Math.max(1,...categories.map(c=>tasks.filter(t=>t.category===c).length));
 return `<section class="panel"><div class="panel-head"><h2>Çalışma alanları</h2></div><div class="metric-list">${categories.map(c=>{const n=tasks.filter(t=>t.category===c).length;return `<div class="metric-row"><div class="metric-label">${nav.some(([name])=>name===c)?`<button class="text-button" data-page="${esc(c)}">${esc(c)}</button>`:`<span>${esc(c)}</span>`}<b>${n}</b></div>${meter(pct(n,max),'gold',c+': '+n)}</div>`}).join('')}</div></section>`;
}
function dashboard(){
 const tasks=dashTasks().filter(t=>t.status!=='Tamamlandı').slice(0,5);
 return dashStats()
  +`<div class="dash-grid">${deadlineList()}${statusBars()}${projectDistribution()}${categoryDistribution()}</div>`
  +`<div class="dashboard-grid"><section class="panel"><div class="panel-head"><h2>${seesAll()?'Açık Görevler':'Görevlerim'}</h2><button class="text-button" data-page="Görevlerim">Tümünü gör →</button></div>${taskTable(tasks)}</section>${quick()}</div>`;
}
function filteredTasks(){return state.tasks.filter(t=>(page!=='Görevlerim'||seesAll()||t.assignee===user.id)&&(!categories.includes(page)||t.category===page)&&(!query||(t.title+' '+projectName(t.project_id)+' '+personName(t.assignee)).toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')))&&(!statusFilter||t.status===statusFilter)&&(!projectFilter||t.project_id===projectFilter))}
function taskPage(){return `<div class="toolbar"><select id="filter-status" aria-label="Durum filtresi"><option value="">Tüm durumlar</option>${statuses.map(s=>`<option${s===statusFilter?' selected':''}>${s}</option>`).join('')}</select><select id="filter-project" aria-label="Proje filtresi"><option value="">Tüm projeler</option>${state.projects.map(p=>`<option value="${p.id}"${p.id===projectFilter?' selected':''}>${esc(p.name)}</option>`).join('')}</select><span class="subtext">${filteredTasks().length} görev</span><button class="secondary" data-action="export">${icon('download')} CSV indir</button></div><section class="panel">${taskTable(filteredTasks())}</section>`}
function projects(){return `<div class="toolbar"><span class="subtext">${state.projects.length} proje · Ortak çalışma alanınız</span>${can('projects.manage')?'<button class="primary" data-action="new-project">+ Yeni Proje</button>':''}</div>${state.projects.length?`<div class="cards">${state.projects.map(p=>`<section class="panel project-card"><span class="mini-logo">TRI<span>▲</span></span><div><h2>${esc(p.name)}</h2><p>${esc(p.location)}</p></div><p>${esc(p.description||'Proje çalışma alanı')}</p><div class="project-meta"><span>${state.tasks.filter(t=>t.project_id===p.id&&t.status!=='Tamamlandı').length} açık görev</span><span>${state.documents.filter(d=>d.project_id===p.id).length} evrak</span></div><button class="secondary" data-project="${p.id}">Projeyi görüntüle →</button>${can('projects.manage')?`<button class="text-button" data-members="${p.id}">Ekip ve erişim yönetimi</button>`:''}</section>`).join('')}</div>`:`<div class="panel">${empty('Projeleriniz burada yer alacak',can('projects.manage')?'Yeni Proje düğmesiyle bir proje oluşturun.':'Yöneticinizden proje erişimi isteyin.','building')}</div>`}`}
function documents(){return `<div class="toolbar"><span class="subtext">Projelere bağlı dosyalar · Dosya başına en fazla 10 MB</span><button class="primary" data-action="upload">${icon('upload')}Evrak yükle</button></div><section class="panel">${state.documents.length?`<div class="table-wrap"><table><thead><tr><th>Evrak adı</th><th>Proje</th><th>Yükleyen</th><th>Boyut</th><th>Tarih</th><th></th></tr></thead><tbody>${state.documents.map(d=>`<tr><td>${esc(d.name)}</td><td>${esc(projectName(d.project_id))}</td><td>${esc(personName(d.owner))}</td><td>${(d.size/1024).toFixed(0)} KB</td><td>${new Date(d.created*1000).toLocaleDateString('tr-TR')}</td><td><a class="text-button" href="/api/documents/${d.id}">İndir ↓</a></td></tr>`).join('')}</tbody></table></div>`:empty('Henüz evrak yüklenmedi','Projenizin dosyalarını tek yerde toplayın.','folder')}</section>`}
function calendar(){const y=calendarDate.getFullYear(),m=calendarDate.getMonth(),first=new Date(y,m,1),offset=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate();return `<div class="toolbar"><button class="secondary" data-action="prev-month" aria-label="Önceki ay">←</button><h2>${calendarDate.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})}</h2><button class="secondary" data-action="next-month" aria-label="Sonraki ay">→</button><button class="text-button" data-action="today">Bugün</button></div><div class="panel calendar-scroll"><div class="calendar">${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(d=>`<div class="weekday">${d}</div>`).join('')}${Array.from({length:Math.ceil((offset+days)/7)*7},(_,i)=>{const d=i-offset+1;if(d<1||d>days)return '<div class="day outside"></div>';const key=dateKey(new Date(y,m,d));return `<div class="day ${key===dateKey()?'today':''}"><span>${d}</span>${state.tasks.filter(t=>t.due===key).map(t=>`<button class="calendar-task" data-task="${t.id}">${esc(t.title)}</button>`).join('')}</div>`}).join('')}</div></div>`}
function reports(){return stats()+`<div class="dashboard-grid">${reportCard()}<section class="panel"><div class="panel-head"><h2>Proje bazında görevler</h2><button class="text-button" data-action="export">CSV indir ↓</button></div><div class="report-bars">${state.projects.map(p=>`<div class="bar-row"><span>${esc(p.name)}</span><strong>${state.tasks.filter(t=>t.project_id===p.id&&t.status==='Tamamlandı').length} / ${state.tasks.filter(t=>t.project_id===p.id).length} tamamlandı</strong></div>`).join('')||'<p class="subtext">Henüz proje bulunmuyor.</p>'}</div></section></div>`}
/* ==================================================================
 * EKİP VE YETKİ YÖNETİMİ
 * ================================================================== */
function team(){
 const admin=user.role==='admin';
 const rows=state.users.map(p=>`<div class="user-row${p.active?'':' inactive'}"><span class="avatar">${esc(initials(p.name))}</span><div><strong>${esc(p.name)}</strong><small>${esc(p.email)}</small></div><span class="badge ${p.role==='admin'?'medium':'progress'}">${esc(roleLabel(p.role))}</span>${p.active?'':'<span class="badge inactive">Pasif</span>'}${admin&&p.id!==user.id?`<button class="secondary small" data-action="edit-user" data-id="${p.id}" aria-label="${esc(p.name)} kullanıcısını düzenle">${icon('edit')}Düzenle</button>`:''}</div>`).join('');
 return `<div class="toolbar"><span class="subtext">${state.users.length} ekip üyesi · Kurumsal çalışma alanı</span>${admin?`<button class="secondary" data-action="manage-roles">${icon('shield')}Rolleri yönet</button><button class="primary" data-action="invite">+ Çalışan davet et</button>`:''}</div><section class="panel">${rows}</section>${admin?'<p class="note">Davetler yalnızca @eksioglutria.com adresleri için oluşturulur. Davet bağlantıları tek kullanımlıktır ve 48 saat geçerlidir. Proje erişimini Projeler sayfasından atayın. Özel rollerin yetkileri (tüm projeler, görev atama/silme, Gmail, Drive, Gemini) Rolleri yönet ekranından seçilir.</p>':''}`;
}
// Rol seçenekleri; withNew=true ise "yeni rol oluştur" seçeneği eklenir.
const roleOptions=(selected,withNew=false)=>state.roles.map(r=>`<option value="${esc(r.key)}"${r.key===selected?' selected':''}>${esc(r.label)}${r.key==='admin'?' — tüm projelere erişim':''}</option>`).join('')+(withNew?'<option value="__new">+ Yeni rol oluştur…</option>':'');
// Kullanıcı düzenleme: rol değiştirme, yeni rol atama, pasife alma/aktifleştirme.
function editUser(id){
 const p=state.users.find(u=>u.id===id);if(!p)return;
 formModal(p.name+' · Kullanıcıyı düzenle',
  `<p class="subtext">${esc(p.email)}</p>`
  +select('Rol','role',roleOptions(p.role,true))
  +`<label class="field hidden" id="new-role-field"><span>Yeni rol adı</span><input name="new_role" maxlength="40" placeholder="Örn. Muhasebe Uzmanı"></label>`
  +`<label class="member-check"><input type="checkbox" name="active"${p.active?' checked':''}><span>Hesap aktif<small>Pasife alınan kullanıcı giriş yapamaz ve açık oturumları hemen kapatılır.</small></span></label>`
  +actions(),
  async(body)=>{
   let role=body.role;
   // 1) "Yeni rol" seçildiyse önce rolü oluştur, dönen anahtarı kullan.
   if(role==='__new'){
    const label=(body.new_role||'').trim();if(!label)throw Error('Yeni rol için bir ad girin.');
    role=(await api('roles','POST',{label})).key;
   }
   // 2) Kullanıcıyı güncelle (active: onay kutusu işaretliyse true).
   await api('users/'+id,'PUT',{role,active:body.active==='on'});
   modal.close();await refresh();toast('Kullanıcı güncellendi.');
  });
 // "Yeni rol oluştur…" seçilince ad alanını göster.
 const roleSelect=modal.querySelector('[name=role]'),newField=modal.querySelector('#new-role-field');
 roleSelect.onchange=()=>{const on=roleSelect.value==='__new';newField.classList.toggle('hidden',!on);newField.querySelector('input').required=on;if(on)newField.querySelector('input').focus()};
}
// Rol listesi: özel rol ekleme ve kullanılmayan özel rolleri silme.
function manageRoles(){
 const used=key=>state.users.filter(u=>u.role===key).length;
 formModal('Rolleri yönet',
  `<div class="role-list">${state.roles.map(r=>`<div class="role-row"><span><strong>${esc(r.label)}</strong><small>${r.builtin?'Yerleşik rol':'Özel rol'} · ${used(r.key)} kullanıcı</small><span class="chips">${permChips(r)}</span></span>${r.builtin?'':`<span class="role-actions"><button type="button" class="secondary small" data-action="edit-role" data-id="${esc(r.key)}">${icon('edit')}Yetkiler</button><button type="button" class="danger small" data-action="delete-role" data-id="${esc(r.key)}">${icon('trash')}Sil</button></span>`}</div>`).join('')}</div>`
  +'<h3>Yeni rol</h3>'+field('Rol adı','label','text','maxlength="40" placeholder="Örn. Muhasebe"')+permChecks(EMPLOYEE_PERMISSIONS)
  +actions('Rol ekle'),
  async(body,f)=>{await api('roles','POST',{label:body.label,permissions:new FormData(f).getAll('permissions')});await refresh();manageRoles();toast('Rol eklendi.')});
}
async function deleteRole(key){
 const r=state.roles.find(r=>r.key===key);if(!r||!confirm(`"${r.label}" rolü silinsin mi?`))return;
 await api('roles/'+encodeURIComponent(key),'DELETE',{});await refresh();manageRoles();toast('Rol silindi.');
}
function settings(){return `<section class="panel settings"><h2>Hesabım</h2><p><strong>${esc(user.name)}</strong></p><p class="subtext">${esc(user.email)} · ${esc(roleLabel(user.role))}</p><hr><h3>Şifre değiştir</h3><form id="password-form"><div class="error" role="alert"></div><label class="field"><span>Mevcut şifre</span><input type="password" name="current" required autocomplete="current-password"></label><label class="field"><span>Yeni şifre</span><input type="password" name="password" required minlength="12" maxlength="1024" autocomplete="new-password"><small class="subtext">En az 12 karakter. Diğer cihazlardaki oturumlarınız kapatılır.</small></label><button class="primary">Şifreyi güncelle</button></form><hr><h3>Google Workspace</h3>${workspaceSettings()}<hr><button class="secondary" data-action="logout">Güvenli çıkış</button></section>`}
function openModal(title,html){modal.innerHTML=`<div class="modal-head"><h2 id="modal-title">${esc(title)}</h2><button data-action="close-modal" aria-label="Kapat">${icon('close')}</button></div>${html}`;if(!modal.open)modal.showModal()}
const field=(label,name,type='text',extra='')=>`<label class="field"><span>${label}</span><input name="${name}" type="${type}" required ${extra}></label>`;
const select=(label,name,options)=>`<label class="field"><span>${label}</span><select name="${name}" required>${options}</select></label>`;
const opts=(values,selected)=>values.map(v=>`<option${v===selected?' selected':''}>${esc(v)}</option>`).join('');
const projectOptions=()=>state.projects.map(p=>`<option value="${p.id}"${projectFilter===p.id?' selected':''}>${esc(p.name)}</option>`).join('');
const actions=(label='Kaydet')=>`<div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Vazgeç</button><button class="primary" type="submit">${label}</button></div>`;
function formModal(title,html,submit){openModal(title,`<form id="modal-form"><div class="error" role="alert"></div>${html}</form>`);document.querySelector('#modal-form').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,b=f.querySelector('[type=submit]');b.disabled=true;try{await submit(Object.fromEntries(new FormData(f)),f)}catch(err){f.querySelector('.error').textContent=err.message}finally{b.disabled=false}}}
/* ==================================================================
 * GÖREV OLUŞTURMA / DÜZENLEME / SİLME
 * taskForm(null[, ön değerler]) → yeni görev (POST), taskForm(görev) → düzenleme (PUT)
 * Ön değerler e-postadan veya Gemini taslağından gelebilir.
 * ================================================================== */
function taskForm(task=null,prefill={}){
 if(!state.projects.length){toast(can('projects.manage')?'Önce bir proje oluşturun.':'Görev oluşturmak için yöneticinizden proje erişimi isteyin.');if(can('projects.manage'))newProject();return}
 const editing=!!task,v=task||{due:dateKey(),priority:'Orta',status:'Planlandı',category:categories.includes(page)?page:'Genel',project_id:projectFilter,description:'',...prefill};
 // Sorumlu seçimi: yeni görevde yalnızca yönetici, düzenlemede proje üyeleri de değiştirebilir.
 const chooseAssignee=can('tasks.assign')||editing;
 const projectOpts=state.projects.map(p=>`<option value="${p.id}"${p.id===v.project_id?' selected':''}>${esc(p.name)}</option>`).join('');
 formModal(editing?'Görevi düzenle':'Yeni görev oluştur',
  field('Görev başlığı','title','text',`maxlength="200" placeholder="Örn. Malik görüşmesi" value="${esc(v.title||'')}"`)
  +select('Proje','project_id',projectOpts)
  +`<div class="form-grid">${field('Son tarih','due','date',`value="${esc(v.due)}"`)}${select('Öncelik','priority',opts(['Düşük','Orta','Yüksek'],v.priority))}${select('Durum','status',opts(statuses,v.status))}${select('Çalışma alanı','category',opts(categories,v.category))}</div>`
  +(chooseAssignee?select('Sorumlu','assignee',''):'')
  +`<label class="field"><span>Açıklama</span><textarea name="description" maxlength="5000" placeholder="Görevle ilgili ayrıntılar">${esc(v.description)}</textarea></label>`
  +actions(editing?'Değişiklikleri kaydet':'Görevi oluştur'),
  async body=>{
   if(editing)await api('tasks/'+task.id,'PUT',body);else await api('tasks','POST',body);
   modal.close();await refresh();toast(editing?'Görev güncellendi.':'Görev oluşturuldu.');
  });
 if(chooseAssignee){
  // Proje değiştiğinde sorumlu listesini o projenin aktif üyeleri + yöneticilerle yenile.
  const project=modal.querySelector('[name=project_id]'),assignee=modal.querySelector('[name=assignee]');
  const update=()=>{const current=assignee.value||v.assignee;assignee.innerHTML=state.users.filter(u=>u.active&&canAccessProject(project.value,u)).map(u=>`<option value="${u.id}"${u.id===current?' selected':''}>${esc(u.name)}</option>`).join('')};
  project.onchange=update;update();
 }
}
function newTask(){return taskForm()}
function editTask(id){const t=state.tasks.find(t=>t.id===id);if(t)taskForm(t)}
async function deleteTask(id){
 const t=state.tasks.find(t=>t.id===id);if(!t||!confirm(`"${t.title}" görevi kalıcı olarak silinsin mi?`))return;
 await api('tasks/'+id,'DELETE',{});modal.close();await refresh();toast('Görev silindi.');
}
function newProject(){formModal('Yeni proje',field('Proje adı','name','text','maxlength="200" placeholder="Örn. Tria Kordonboyu"')+field('Konum','location','text','maxlength="200" placeholder="Örn. Kordonboyu / Kartal"')+'<label class="field"><span>Proje açıklaması</span><textarea name="description" maxlength="2000"></textarea></label>'+actions('Proje oluştur'),async body=>{await api('projects','POST',body);modal.close();page='Projeler';await refresh();toast('Proje oluşturuldu. Ekip ve erişim yönetiminden çalışanları ekleyebilirsiniz.')})}
function members(project){const p=state.projects.find(p=>p.id===project);formModal(p.name+' · Ekip erişimi','<p class="subtext">Yöneticiler ve "Tüm projeler" yetkili roller tüm projelere erişebilir. Diğer kullanıcılar için erişim atayın.</p>'+state.users.filter(u=>!rolePerms(u.role).includes('projects.all')&&u.active).map(u=>`<label class="member-check"><input type="checkbox" name="members" value="${u.id}"${state.members.some(m=>m.project_id===project&&m.user_id===u.id)?' checked':''}><span>${esc(u.name)}<small>${esc(u.email)}</small></span></label>`).join('')+actions(),async(_,f)=>{await api('projects/'+project+'/members','POST',{users:new FormData(f).getAll('members')});modal.close();await refresh();toast('Proje erişimleri güncellendi.')})}
function invite(){formModal('Çalışan davet et',field('Kurumsal e-posta','email','email','placeholder="ad.soyad@eksioglutria.com"')+select('Erişim rolü','role',roleOptions('employee'))+'<p class="subtext">Bağlantı 48 saat geçerli olacak. Oluşturulan bağlantıyı ilgili çalışanla paylaşabilirsiniz.</p>'+actions('Davet bağlantısı oluştur'),async body=>{const r=await api('invites','POST',body);modal.close();openModal('Davet bağlantısı hazır',`<div class="invite-result"><p class="subtext">${esc(body.email)} için tek kullanımlık bağlantı. E-posta otomatik gönderilmedi.</p><input id="invite-url" aria-label="Davet bağlantısı" readonly value="${esc(r.url)}"><button class="primary" data-action="copy-invite">Bağlantıyı kopyala</button></div>`)})}
function upload(){if(!state.projects.length)return toast('Önce erişebileceğiniz bir proje olmalı.');formModal('Evrak yükle',select('Proje','project_id',projectOptions())+field('Dosya','file','file','accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.txt,.csv"')+'<p class="subtext">PDF, görsel, Word, Excel veya metin dosyaları · En fazla 10 MB</p>'+actions('Yükle'),async(_,f)=>{const fd=new FormData(f),file=fd.get('file');if(!file.size||file.size>10*1024*1024)throw Error('Dosya boyutu 0 ile 10 MB arasında olmalı.');const content=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(Error('Dosya okunamadı.'));reader.readAsDataURL(file)});await api('documents','POST',{project_id:fd.get('project_id'),name:file.name,content});modal.close();page='Evrak';await refresh();toast('Evrak yüklendi.')})}
function taskDetail(id){
 const t=state.tasks.find(t=>t.id===id);if(!t)return;
 // Düzenle: projeye erişebilen herkes. Sil: 'tasks.delete' yetkisi. Takvim: Google bağlıysa.
 const canEdit=canAccessProject(t.project_id,user),canDelete=can('tasks.delete');
 const canCalendar=can('drive.use')&&state.workspace?.connected;
 const buttons=canEdit||canDelete||canCalendar?`<div class="modal-actions">${canCalendar?`<button type="button" class="secondary" data-action="calendar-add" data-id="${t.id}">${icon('calendar')}Google Takvime ekle</button>`:''}${canDelete?`<button type="button" class="danger" data-action="delete-task" data-id="${t.id}">${icon('trash')}Sil</button>`:''}${canEdit?`<button type="button" class="primary" data-action="edit-task" data-id="${t.id}">${icon('edit')}Düzenle</button>`:''}</div>`:'';
 openModal(t.title,`<div class="result-info"><p><strong>Proje:</strong> ${esc(projectName(t.project_id))}</p><p><strong>Sorumlu:</strong> ${esc(personName(t.assignee))}</p><p><strong>Son tarih:</strong> ${dateLabel(t.due)}</p><p><strong>Çalışma alanı:</strong> ${esc(t.category)}</p><p><span class="badge ${badgeClass(t.status)}">${esc(t.status)}</span> <span class="badge ${badgeClass(t.priority)}">${esc(t.priority)}</span></p><p class="subtext">${esc(t.description||'Açıklama eklenmemiş.').replace(/\n/g,'<br>')}</p></div>${buttons}`);
}
function exportCsv(){const tasks=['Raporlar','Genel Bakış'].includes(page)?state.tasks:filteredTasks();const safe=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';const rows=[['Görev','Sorumlu','Proje','Son tarih','Durum','Öncelik','Alan'],...tasks.map(t=>[t.title,personName(t.assignee),projectName(t.project_id),t.due,t.status,t.priority,t.category])];const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(safe).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='tria-gorevler-'+dateKey()+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
/* ==================================================================
 * ROL YETKİLERİ (sunucudaki App::PERMISSIONS ile aynı anahtarlar)
 * ================================================================== */
const PERMISSIONS={
 'projects.all':['Tüm projeleri ve görevleri görüntüleme','Tüm projeler'],
 'projects.manage':['Proje oluşturma ve proje ekibi yönetimi','Proje yönetimi'],
 'tasks.assign':['Başkalarına görev atama ve durumlarını güncelleme','Görev atama'],
 'tasks.delete':['Görev silme','Görev silme'],
 'mail.use':['Gmail (E-posta ekranı)','Gmail'],
 'drive.use':['Google Drive ve Google Takvim','Drive & Takvim'],
 'gemini.use':['Gemini asistanı','Gemini']
};
const EMPLOYEE_PERMISSIONS=['mail.use','drive.use','gemini.use'];
// Yetki seçim kutuları (rol oluşturma/düzenleme formlarında).
const permChecks=selected=>`<fieldset class="perm-list"><legend>Yetkiler</legend>${Object.entries(PERMISSIONS).map(([k,[label]])=>`<label class="member-check"><input type="checkbox" name="permissions" value="${k}"${selected.includes(k)?' checked':''}><span>${esc(label)}</span></label>`).join('')}</fieldset>`;
const permChips=r=>r.key==='admin'?'<span class="chip">Tüm yetkiler</span>':(r.permissions||[]).map(p=>`<span class="chip">${esc(PERMISSIONS[p]?.[1]||p)}</span>`).join('')||'<span class="chip muted">Yalnızca kendi görevleri</span>';
function editRole(key){
 const r=state.roles.find(r=>r.key===key);if(!r||r.builtin)return;
 formModal(r.label+' · Rolü düzenle',field('Rol adı','label','text',`maxlength="40" value="${esc(r.label)}"`)+permChecks(r.permissions||[])+actions(),
  async(body,f)=>{await api('roles/'+encodeURIComponent(key),'PUT',{label:body.label,permissions:new FormData(f).getAll('permissions')});await refresh();manageRoles();toast('Rol güncellendi. Değişiklik kullanıcıların bir sonraki işleminde geçerli olur.')});
}

/* ==================================================================
 * GOOGLE WORKSPACE: ortak yardımcılar
 * ================================================================== */
let mail={label:'INBOX',q:'',list:null,next:null,loading:false,open:null,error:''};
let drive={q:'',files:null,next:null,loading:false,error:''};
const paint=(sel,fn)=>{const el=document.querySelector(sel);if(el)el.innerHTML=fn()};
// Google yapılandırılmamış veya hesap bağlı değilse gösterilecek kart; hazırsa boş döner.
function workspaceGate(kind){
 const w=state.workspace||{};
 if(!w.google)return `<section class="panel">${empty('Google Workspace henüz yapılandırılmadı','BT sorumlusu config.php dosyasına Google OAuth bilgilerini eklediğinde bu ekran kullanılabilir.','info')}</section>`;
 if(!w.connected)return `<section class="panel connect-card">${icon(kind==='mail'?'mail':'cloud')}<h2>Google hesabınızı bağlayın</h2><p class="subtext">${kind==='mail'?'Gmail':'Google Drive'} için kurumsal Google hesabınızla (${esc(user.email)}) bir kez izin verin. Bağlantıyı Ayarlar sayfasından istediğiniz zaman kaldırabilirsiniz.</p><button class="primary" data-action="google-connect">Google ile bağlan</button></section>`;
 return '';
}
// Bağlantı süresi dolduysa (409) durum yenilenir ve "bağlan" kartı görünür.
async function workspaceError(err,target){if(err.status===409){await refresh();toast(err.message);return}target.error=err.message}
async function googleConnect(){const r=await api('google/connect','POST',{});location.href=r.url}
function workspaceSettings(){
 const w=state.workspace||{};
 if(!can('mail.use')&&!can('drive.use'))return '<p class="subtext">Rolünüz Google Workspace araçlarını içermiyor.</p>';
 if(!w.google)return '<p class="subtext">Google entegrasyonu henüz yapılandırılmadı. BT sorumlusu config.php dosyasına Google OAuth bilgilerini eklemeli.</p>';
 return w.connected
  ?`<p class="subtext">Bağlı hesap: <strong>${esc(w.email)}</strong>. ${[can('mail.use')&&'Gmail',can('drive.use')&&'Drive ve Takvim'].filter(Boolean).join(', ')} kullanılabilir.</p><button class="secondary" data-action="google-disconnect">Bağlantıyı kaldır</button>`
  :`<p class="subtext">Gmail, Google Drive ve Google Takvim'i kullanmak için kurumsal Google hesabınızı bağlayın. Uygulama yalnızca e-posta okuma/gönderme, Drive dosyalarını okuma ve takvim etkinliği ekleme izni ister.</p><button class="primary" data-action="google-connect">Google ile bağlan</button>`;
}
// OAuth dönüşündeki ?google=... sonucunu kullanıcıya bildirir.
function googleResult(){
 const r=new URLSearchParams(location.search).get('google');if(!r)return;
 history.replaceState(null,'','/');page='Ayarlar';
 toast({connected:'Google hesabınız bağlandı.',mismatch:`Google hesabı uygulamadaki e-postanızla eşleşmiyor. ${user.email} hesabıyla izin verin.`,denied:'Google izni verilmedi.',expired:'Bağlantı isteğinin süresi doldu. Tekrar deneyin.'}[r]||'Google bağlantısı tamamlanamadı. Tekrar deneyin.');
}

/* ==================================================================
 * GMAIL (E-posta ekranı)
 * ================================================================== */
const senderName=s=>(s||'').replace(/\s*<[^>]+>\s*$/,'').replace(/^"|"$/g,'')||s||'—';
const senderAddress=s=>(String(s||'').match(/<([^>]+)>/)||[,s||''])[1].trim();
const mailDate=ts=>{if(!ts)return '';const d=new Date(ts*1000);return dateKey(d)===dateKey()?d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}):d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'})};
function mailPage(){
 const gate=workspaceGate('mail');if(gate)return gate;
 const tabs=[['INBOX','Gelen kutusu'],['UNREAD','Okunmamış'],['STARRED','Yıldızlı'],['SENT','Gönderilen']];
 return `<div class="toolbar mail-toolbar"><div class="tabs" role="tablist" aria-label="Gmail klasörleri">${tabs.map(([k,l])=>`<button role="tab" class="tab ${mail.label===k?'active':''}" aria-selected="${mail.label===k}" data-action="mail-label" data-id="${k}">${l}</button>`).join('')}</div><form id="mail-search" class="inline-search" role="search">${icon('search')}<input name="q" aria-label="E-postalarda ara" placeholder="Gmail'de ara" value="${esc(mail.q)}"></form><button class="secondary" data-action="mail-refresh" aria-label="E-postaları yenile">${icon('refresh')}</button><button class="primary" data-action="mail-compose">${icon('plus')}Yeni e-posta</button></div><div class="mail-layout"><section class="panel mail-list" id="mail-list">${mailListHtml()}</section><section class="panel mail-reader" id="mail-reader">${mailReaderHtml()}</section></div>`;
}
function mailListHtml(){
 if(mail.error)return empty('E-postalar yüklenemedi',mail.error,'mail');
 if(!mail.list)return '<div class="loading-row">E-postalar yükleniyor…</div>';
 if(!mail.list.length)return empty('İleti bulunamadı','Bu klasörde veya aramanızda ileti yok.','mail');
 return mail.list.map(m=>`<button class="mail-item${m.unread?' unread':''}${mail.open?.id===m.id?' active':''}" data-action="mail-open" data-id="${esc(m.id)}"><span class="mail-from">${esc(senderName(mail.label==='SENT'?m.to:m.from))}</span><span class="mail-date">${mailDate(m.date)}</span><strong>${esc(m.subject||'(Konu yok)')}</strong><small>${esc(m.snippet)}</small></button>`).join('')+(mail.next?'<button class="text-button load-more" data-action="mail-more">Daha fazla yükle</button>':'');
}
function mailReaderHtml(){
 const m=mail.open;
 if(!m)return empty('Bir ileti seçin','Okumak istediğiniz e-postayı listeden seçin.','mail');
 if(m.loading)return '<div class="loading-row">İleti açılıyor…</div>';
 return `<article class="mail-body"><button class="text-button mail-back" data-action="mail-close">← Listeye dön</button><h2>${esc(m.subject||'(Konu yok)')}</h2><div class="mail-meta"><p><strong>Kimden:</strong> ${esc(m.from)}</p><p><strong>Kime:</strong> ${esc(m.to)}</p>${m.cc?`<p><strong>Bilgi:</strong> ${esc(m.cc)}</p>`:''}<p class="subtext">${m.date?new Date(m.date*1000).toLocaleString('tr-TR'):''}</p></div><div class="mail-actions"><button class="primary" data-action="mail-reply">${icon('reply')}Yanıtla</button><button class="secondary" data-action="mail-task">${icon('addfile')}Görev oluştur</button>${m.link?`<a class="secondary" href="${esc(m.link)}" target="_blank" rel="noopener noreferrer">${icon('external')}Gmail'de aç</a>`:''}</div><div class="mail-text">${esc(m.body||'(İçerik yok)')}</div>${m.attachments?.length?`<p class="mail-attachments">${icon('file')}<span><strong>Ekler:</strong> ${m.attachments.map(esc).join(', ')}<br><small class="subtext">Ekleri Gmail'de açabilirsiniz.</small></span></p>`:''}</article>`;
}
async function loadMail(more=false){
 if(mail.loading)return;mail.loading=true;mail.error='';
 if(!more){mail.list=null;mail.next=null;paint('#mail-list',mailListHtml)}
 try{
  const qs=new URLSearchParams({label:mail.label});if(mail.q)qs.set('q',mail.q);if(more&&mail.next)qs.set('pageToken',mail.next);
  const r=await api('google/gmail/messages?'+qs);
  mail.list=more?[...(mail.list||[]),...r.messages]:r.messages;mail.next=r.nextPageToken;
 }catch(err){await workspaceError(err,mail)}
 finally{mail.loading=false;paint('#mail-list',mailListHtml)}
}
async function openMail(id){
 mail.open={id,loading:true};paint('#mail-list',mailListHtml);paint('#mail-reader',mailReaderHtml);
 document.querySelector('.mail-layout')?.classList.add('reading');
 try{mail.open=await api('google/gmail/messages/'+encodeURIComponent(id));const item=mail.list?.find(m=>m.id===id);if(item)item.unread=false}
 catch(err){mail.open=null;toast(err.message);if(err.status===409)return refresh()}
 paint('#mail-list',mailListHtml);paint('#mail-reader',mailReaderHtml);
}
// Yeni e-posta veya yanıt formu.
function compose(pre={}){
 formModal(pre.threadId?'Yanıtla':'Yeni e-posta',
  field('Kime','to','text',`maxlength="4000" placeholder="ad@ornek.com, ikinci@ornek.com" value="${esc(pre.to||'')}"`)
  +`<label class="field"><span>Bilgi (CC)</span><input name="cc" maxlength="4000" placeholder="İsteğe bağlı" value="${esc(pre.cc||'')}"></label>`
  +field('Konu','subject','text',`maxlength="300" value="${esc(pre.subject||'')}"`)
  +`<label class="field"><span>Mesaj</span><textarea name="body" class="compose-body" maxlength="50000">${esc(pre.body||'')}</textarea></label>`
  +`<p class="subtext">E-posta, bağlı Google hesabınızdan (${esc(state.workspace?.email||user.email)}) gönderilir.</p>`+actions('Gönder'),
  async body=>{
   await api('google/gmail/send','POST',{to:body.to,cc:body.cc,subject:body.subject,body:body.body,...(pre.threadId?{threadId:pre.threadId,inReplyTo:pre.inReplyTo||''}:{})});
   modal.close();toast('E-posta gönderildi.');if(mail.label==='SENT')loadMail();
  });
}
function replyMail(){
 const m=mail.open;if(!m||m.loading)return;
 const quoted=(m.body||'').slice(0,5000).split('\n').map(l=>'> '+l).join('\n');
 compose({to:senderAddress(mail.label==='SENT'?m.to:m.from),subject:/^re:/i.test(m.subject)?m.subject:'Re: '+m.subject,threadId:m.threadId,inReplyTo:m.messageId,
  body:`\n\n${new Date(m.date*1000).toLocaleString('tr-TR')} tarihinde ${m.from} yazdı:\n${quoted}`});
}
// E-postadan görev: konu başlık, gönderen ve içerik açıklama olur.
function mailToTask(){
 const m=mail.open;if(!m||m.loading)return;
 taskForm(null,{title:(m.subject||'E-posta takibi').slice(0,200),description:`E-posta: ${m.from}\nKonu: ${m.subject}\n\n${(m.body||'').slice(0,3000)}`});
}

/* ==================================================================
 * GOOGLE DRIVE
 * ================================================================== */
const fileKind=f=>({'application/vnd.google-apps.document':'Google Doküman','application/vnd.google-apps.spreadsheet':'Google E-Tablo','application/vnd.google-apps.presentation':'Google Slayt','application/vnd.google-apps.drawing':'Google Çizim'}[f.mimeType]||((f.name.includes('.')?f.name.split('.').pop().toUpperCase():'Dosya')+(f.size?` · ${Math.max(1,Math.round(f.size/1024))} KB`:'')));
function drivePage(){
 const gate=workspaceGate('drive');if(gate)return gate;
 return `<div class="toolbar"><form id="drive-search" class="inline-search" role="search">${icon('search')}<input name="q" aria-label="Drive'da ara" placeholder="Drive'da dosya adı ara" value="${esc(drive.q)}"></form><button class="secondary" data-action="drive-refresh" aria-label="Drive listesini yenile">${icon('refresh')}</button><span class="subtext">Google Doküman/E-Tablo dosyaları Word/Excel, Slaytlar PDF olarak projenin evrakına aktarılır.</span></div><section class="panel" id="drive-list">${driveListHtml()}</section>`;
}
function driveListHtml(){
 if(drive.error)return empty('Drive dosyaları yüklenemedi',drive.error,'cloud');
 if(!drive.files)return '<div class="loading-row">Drive dosyaları yükleniyor…</div>';
 if(!drive.files.length)return empty('Dosya bulunamadı','Aramanızı değiştirip tekrar deneyin.','cloud');
 return `<div class="table-wrap"><table><thead><tr><th>Dosya</th><th>Tür</th><th>Sahibi</th><th>Değiştirilme</th><th></th></tr></thead><tbody>${drive.files.map(f=>`<tr><td><strong>${esc(f.name)}</strong></td><td class="muted">${esc(fileKind(f))}</td><td class="muted">${esc(f.owner||'—')}</td><td class="muted">${f.modified?new Date(f.modified).toLocaleDateString('tr-TR'):'—'}</td><td class="row-actions">${f.link?`<a class="text-button" href="${esc(f.link)}" target="_blank" rel="noopener noreferrer">Aç ↗</a>`:''}${f.importable?`<button class="text-button" data-action="drive-import" data-id="${esc(f.id)}">Evraka aktar</button>`:'<span class="subtext" title="Desteklenmeyen dosya türü veya 10 MB üstü">Aktarılamaz</span>'}</td></tr>`).join('')}</tbody></table></div>${drive.next?'<button class="text-button load-more" data-action="drive-more">Daha fazla yükle</button>':''}`;
}
async function loadDrive(more=false){
 if(drive.loading)return;drive.loading=true;drive.error='';
 if(!more){drive.files=null;drive.next=null;paint('#drive-list',driveListHtml)}
 try{
  const qs=new URLSearchParams();if(drive.q)qs.set('q',drive.q);if(more&&drive.next)qs.set('pageToken',drive.next);
  const r=await api('google/drive/files?'+qs);
  drive.files=more?[...(drive.files||[]),...r.files]:r.files;drive.next=r.nextPageToken;
 }catch(err){await workspaceError(err,drive)}
 finally{drive.loading=false;paint('#drive-list',driveListHtml)}
}
function driveImport(id){
 const f=drive.files?.find(f=>f.id===id);if(!f)return;
 if(!state.projects.length)return toast('Önce erişebileceğiniz bir proje olmalı.');
 formModal('Evraka aktar',`<p class="subtext"><strong>${esc(f.name)}</strong> dosyasının bir kopyası seçtiğiniz projenin evrakına kaydedilir.</p>`+select('Proje','project_id',projectOptions())+actions('Aktar'),
  async body=>{const r=await api('google/drive/import','POST',{file_id:id,project_id:body.project_id});modal.close();await refresh();toast(`"${r.name}" projenin evrakına aktarıldı.`)});
}

/* ==================================================================
 * GEMINI ASİSTANI (sağ alttaki eklenti düğmesi ve yan panel)
 * Mesajlar sunucu üzerinden Gemini API'ye gider; API anahtarı tarayıcıda bulunmaz.
 * Asistan görev oluşturmaz; önerdiği taslak kullanıcı formu onaylarsa kaydedilir.
 * ================================================================== */
let gem={open:false,history:[],busy:false};
const geminiFab=()=>can('gemini.use')&&state.workspace?.gemini?`<button class="gemini-fab" data-action="gemini-toggle" aria-label="Gemini asistanını aç" aria-expanded="${gem.open}" title="Gemini asistanı">${icon('sparkle')}<span>Gemini</span></button>`:'';
// Basit biçimlendirme: önce HTML kaçışı, sonra **kalın** ve satır sonları.
const fmt=t=>esc(t).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/^[*-] /gm,'• ').replace(/\n/g,'<br>');
function geminiPanel(){
 let el=document.querySelector('#gemini-panel');
 if(!el){
  el=document.createElement('aside');el.id='gemini-panel';el.className='gemini-panel';el.setAttribute('aria-label','Gemini asistanı');el.hidden=true;
  el.innerHTML=`<header>${icon('sparkle')}<div><strong>Gemini Asistan</strong><small>Görevleriniz hakkında soru sorun</small></div><button class="icon-button" data-action="gemini-clear" aria-label="Konuşmayı temizle" title="Konuşmayı temizle">${icon('trash')}</button><button class="icon-button" data-action="gemini-toggle" aria-label="Asistanı kapat">${icon('close')}</button></header><div class="gem-messages" id="gem-messages" aria-live="polite"></div><form id="gem-form"><textarea name="message" rows="2" maxlength="4000" placeholder="Örn. Bu hafta teslim edilecek işlerim neler?" aria-label="Gemini'ye mesaj"></textarea><button class="primary" type="submit" aria-label="Gönder">${icon('send')}</button></form><p class="gem-note">Sorularınız ve yetkili olduğunuz görev özetleri yanıt için Google Gemini'ye gönderilir.</p>`;
  document.body.append(el);
  el.querySelector('textarea').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.querySelector('#gem-form').requestSubmit()}});
 }
 return el;
}
function paintGemini(){
 const el=geminiPanel();el.hidden=!gem.open;document.querySelector('.gemini-fab')?.setAttribute('aria-expanded',gem.open);
 if(!gem.open)return;
 const suggestions=['Bu hafta teslim edilecek işlerim neler?','Geciken görevleri özetle','Projelere göre iş yükünü özetle','Yeni bir görev taslağı hazırla'];
 el.querySelector('#gem-messages').innerHTML=(gem.history.length?gem.history.map((m,i)=>`<div class="gem-msg ${m.role}${m.error?' error':''}">${fmt(m.text)}${m.proposal?`<div class="gem-proposal"><strong>Görev taslağı</strong><span>${esc(m.proposal.title)}</span><small>${esc(projectName(m.proposal.project_id))} · ${dateLabel(m.proposal.due)} · ${esc(m.proposal.priority)} · ${esc(m.proposal.category)}</small><button class="secondary" data-action="gem-proposal" data-id="${i}">Formda aç ve onayla</button></div>`:''}</div>`).join(''):`<div class="gem-welcome"><p>Merhaba ${esc(user.name.split(' ')[0])}, görevleriniz, teslim tarihleri ve projeleriniz hakkında sorabilirsiniz.</p>${suggestions.map(s=>`<button class="chip-button" data-action="gem-suggest">${esc(s)}</button>`).join('')}</div>`)+(gem.busy?'<div class="gem-msg model typing">Yanıt hazırlanıyor…</div>':'');
 const box=el.querySelector('#gem-messages');box.scrollTop=box.scrollHeight;
 el.querySelector('#gem-form [type=submit]').disabled=gem.busy;
}
function toggleGemini(){gem.open=!gem.open;paintGemini();if(gem.open)geminiPanel().querySelector('textarea').focus()}
async function geminiSend(text){
 text=text.trim();if(gem.busy||!text)return;
 const prior=gem.history.filter(m=>!m.error).slice(-20).map(({role,text})=>({role,text:text.slice(0,8000)}));
 gem.history.push({role:'user',text});gem.busy=true;paintGemini();
 try{const r=await api('gemini','POST',{message:text,history:prior});gem.history.push({role:'model',text:r.reply,proposal:r.proposal})}
 catch(err){gem.history.push({role:'model',text:err.message,error:true})}
 finally{gem.busy=false;paintGemini()}
}
// Sayfa çizildikten sonra çalışır: Gmail/Drive listelerini ilk açılışta yükler.
function afterRender(){
 if(!state.workspace?.connected)return;
 if(page==='E-posta'&&can('mail.use')&&!mail.list&&!mail.loading&&!mail.error)loadMail();
 if(page==='Google Drive'&&can('drive.use')&&!drive.files&&!drive.loading&&!drive.error)loadDrive();
}
document.addEventListener('submit',e=>{
 const id=e.target.id;if(!['mail-search','drive-search','gem-form'].includes(id))return;
 e.preventDefault();const value=new FormData(e.target).get(id==='gem-form'?'message':'q')||'';
 if(id==='mail-search'){mail.q=value.trim();mail.open=null;paint('#mail-reader',mailReaderHtml);loadMail()}
 if(id==='drive-search'){drive.q=value.trim();loadDrive()}
 if(id==='gem-form'){e.target.reset();geminiSend(value)}
});
document.addEventListener('click',async e=>{const el=e.target.closest('button,[data-action]');if(!el)return;try{if(el.dataset.page){page=el.dataset.page;query='';projectFilter='';statusFilter='';render();return}if(el.dataset.project){projectFilter=el.dataset.project;page='Görevlerim';query='';statusFilter='';render();return}if(el.dataset.task)return taskDetail(el.dataset.task);if(el.dataset.members)return members(el.dataset.members);switch(el.dataset.action){case'new-task':return newTask();case'edit-task':return editTask(el.dataset.id);case'delete-task':return await deleteTask(el.dataset.id);case'edit-user':return editUser(el.dataset.id);case'manage-roles':return manageRoles();case'delete-role':return await deleteRole(el.dataset.id);case'edit-role':return editRole(el.dataset.id);
case'google-connect':return await googleConnect();
case'google-disconnect':if(!confirm('Google hesabınızın bağlantısı kaldırılsın mı?'))return;await api('google/disconnect','POST',{});mail.list=null;drive.files=null;await refresh();return toast('Google bağlantısı kaldırıldı.');
case'calendar-add':{el.disabled=true;try{await api('google/calendar/tasks/'+el.dataset.id,'POST',{});toast('Görev Google Takviminize eklendi.')}finally{el.disabled=false}return}
case'mail-label':mail.label=el.dataset.id;mail.open=null;document.querySelectorAll('.tabs .tab').forEach(t=>{t.classList.toggle('active',t===el);t.setAttribute('aria-selected',t===el)});paint('#mail-reader',mailReaderHtml);return loadMail();
case'mail-refresh':return loadMail();case'mail-more':return loadMail(true);case'mail-open':return openMail(el.dataset.id);
case'mail-close':mail.open=null;document.querySelector('.mail-layout')?.classList.remove('reading');paint('#mail-list',mailListHtml);return paint('#mail-reader',mailReaderHtml);
case'mail-compose':return compose();case'mail-reply':return replyMail();case'mail-task':return mailToTask();
case'drive-refresh':return loadDrive();case'drive-more':return loadDrive(true);case'drive-import':return driveImport(el.dataset.id);
case'gemini-toggle':return toggleGemini();case'gemini-clear':gem.history=[];return paintGemini();
case'gem-suggest':return geminiSend(el.textContent);
case'gem-proposal':{const p=gem.history[+el.dataset.id]?.proposal;if(p)taskForm(null,p);return}case'new-project':return newProject();case'invite':return invite();case'upload':return upload();case'close-modal':return modal.close();case'menu':return document.querySelector('.sidebar')?.classList.toggle('open');case'login-mode':adminLogin=!adminLogin;return login();case'password-toggle':{const p=document.querySelector('#password');p.type=p.type==='password'?'text':'password';el.setAttribute('aria-label',p.type==='password'?'Şifreyi göster':'Şifreyi gizle');return}case'forgot':return openModal('Şifre yardımı','<p class="subtext">Şifrenizi sıfırlamak için kurumunuzun BT sorumlusu ile iletişime geçin. BT sorumlusu hesabınızın şifresini yenileyebilir.</p>');case'support':return openModal('BT desteği','<p class="subtext">Hesap veya proje erişimi için kurumunuzun BT sorumlusu ile iletişime geçin. Yeni çalışanların sisteme katılması için yönetici daveti gerekir.</p>');case'logout':await api('logout','POST',{});user=null;csrf='';gem={open:false,history:[],busy:false};mail={label:'INBOX',q:'',list:null,next:null,loading:false,open:null,error:''};drive={q:'',files:null,next:null,loading:false,error:''};document.querySelector('#gemini-panel')?.remove();state={tasks:[],projects:[],users:[],documents:[],members:[],roles:[]};page='Genel Bakış';return login();case'copy-invite':{const input=document.querySelector('#invite-url');try{await navigator.clipboard.writeText(input.value);toast('Davet bağlantısı kopyalandı.')}catch{input.select();toast('Bağlantıyı seçtim. Ctrl+C ile kopyalayabilirsiniz.')}return}case'upcoming':page='Takvim';return render();case'prev-month':calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()-1,1);return render();case'next-month':calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()+1,1);return render();case'today':calendarDate=new Date();return render();case'export':return exportCsv()}}catch(err){toast(err.message)}});
document.addEventListener('change',async e=>{if(e.target.id==='filter-status'){statusFilter=e.target.value;document.querySelector('#content').innerHTML=taskPage()}if(e.target.id==='filter-project'){projectFilter=e.target.value;document.querySelector('#content').innerHTML=taskPage()}if(e.target.dataset.status){const select=e.target;select.disabled=true;try{await api('tasks/'+select.dataset.status,'PATCH',{status:select.value});await refresh();toast('Görev durumu güncellendi.')}catch(err){toast(err.message);const t=state.tasks.find(t=>t.id===select.dataset.status);if(t)select.value=t.status;select.disabled=false}}});
document.addEventListener('submit',async e=>{if(e.target.id!=='password-form')return;e.preventDefault();const f=e.target,b=f.querySelector('button');b.disabled=true;try{await api('password','POST',Object.fromEntries(new FormData(f)));f.reset();f.querySelector('.error').textContent='';toast('Şifreniz güncellendi.')}catch(err){f.querySelector('.error').textContent=err.message}finally{b.disabled=false}});
(async()=>{if(location.pathname==='/invite')return invitation();try{const r=await api('me');user=r.user;csrf=r.csrf;googleResult();await refresh()}catch(err){if(user){app.innerHTML='<main class="loading">Veriler yüklenemedi. Sayfayı yeniden yükleyin.</main>';toast(err.message)}else login()}})();
