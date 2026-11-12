'use strict';
document.querySelector('#setup-form').addEventListener('submit',async e=>{
 e.preventDefault();const f=e.currentTarget,b=f.querySelector('button'),err=f.querySelector('.error'),data=Object.fromEntries(new FormData(f));
 err.textContent='';if(data.password!==data.confirm){err.textContent='Şifreler eşleşmiyor.';return;}delete data.confirm;b.disabled=true;
 try{const r=await fetch('/api/install',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await r.json();if(!r.ok)throw Error(result.error||'Kurulum tamamlanamadı.');f.reset();f.hidden=true;document.querySelector('#success').hidden=false;}
 catch(e){err.textContent=e.message||'Sunucuya ulaşılamadı.';}finally{b.disabled=false;}
});
