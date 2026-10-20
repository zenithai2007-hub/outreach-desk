'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Client,Offer,PLATFORMS,PLATFORM_META,Status,colorFor,initials,nowTime} from '@/lib/types';
import {seedClients,DEFAULT_OFFER} from '@/lib/seed';
import {Sparkles,Send,ArrowLeft,Moon,Sun,Plus,Upload,UserRound,Info,X,Trash2,Pencil,LogOut,ClipboardPaste,ShieldCheck} from 'lucide-react';

type Tab='All'|'Unread'|'Mentions';
const uid=()=>Math.random().toString(36).slice(2,10);
const badge=(n:number)=> n>99?'99+':String(n);

export default function Inbox({user,onLogout}:{user:{name:string;email:string};onLogout:()=>void}){
 const key=`outreach-desk:${user.email}`;
 const [clients,setClients]=useState<Client[]>([]); const [offer,setOffer]=useState<Offer>(DEFAULT_OFFER);
 const [sel,setSel]=useState<string>(''); const [tab,setTab]=useState<Tab>('All');
 const [q,setQ]=useState(''); const [fStatus,setFStatus]=useState('All'); const [fPlatform,setFPlatform]=useState('All');
 const [text,setText]=useState(''); const [lang,setLang]=useState<'English'|'Roman Urdu'>('English');
 const [dark,setDark]=useState(false); const [drawer,setDrawer]=useState(false); const [showChatMobile,setShowChatMobile]=useState(false);
 const [modal,setModal]=useState<null|'add'|'edit'|'offer'|'reply'>(null); const [busy,setBusy]=useState(false); const [note,setNote]=useState('');
 const fileRef=useRef<HTMLInputElement>(null); const csvRef=useRef<HTMLInputElement>(null);

 useEffect(()=>{ const raw=localStorage.getItem(key); if(raw){const j=JSON.parse(raw); setClients(j.clients); setOffer(j.offer); setSel(j.clients[0]?.id||'');} else {const s=seedClients(); setClients(s); setSel(s[0].id);} },[]);
 useEffect(()=>{ if(clients.length) localStorage.setItem(key,JSON.stringify({clients,offer})); },[clients,offer,key]);
 useEffect(()=>{ document.documentElement.classList.toggle('dark',dark); },[dark]);

 const current=clients.find(c=>c.id===sel);
 const counts=useMemo(()=>({unread:clients.filter(c=>c.unread>0).length,mentions:clients.reduce((a,c)=>a+c.mentions,0)}),[clients]);
 const list=clients.filter(c=>{
   if(tab==='Unread'&&c.unread===0) return false; if(tab==='Mentions'&&c.mentions===0) return false;
   if(fStatus!=='All'&&c.status!==fStatus) return false; if(fPlatform!=='All'&&c.platform!==fPlatform) return false;
   return (c.name+c.niche+c.contact).toLowerCase().includes(q.toLowerCase());
 });
 const patch=(id:string,p:Partial<Client>)=>setClients(cs=>cs.map(c=>c.id===id?{...c,...p}:c));
 const addMsg=(id:string,fromMe:boolean,body:string)=>setClients(cs=>cs.map(c=>c.id===id?{...c,messages:[...c.messages,{id:uid(),fromMe,body,time:nowTime()}]}:c));

 async function aiDraft(){
   if(!current) return; setBusy(true);
   try{ const r=await fetch('/api/ai-draft',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({client:current,offer,language:lang})}); const j=await r.json(); if(j.ok){setText(j.data.draft); patch(current.id,{status:current.status==='New'?'Drafted':current.status}); setNote(j.data.source==='llm'?'AI draft (LLM) — edit kar ke bhejein':'AI draft (local generator — server par LLM key set ho to live LLM) — edit kar ke bhejein');}}
   catch{ setNote('AI draft fail — dobara try karein'); } finally{setBusy(false);}
 }
 function send(){
   if(!current||!text.trim()) return; if(current.optedOut){setNote('Client opted out hai — message nahi bheja ja sakta.');return;}
   addMsg(current.id,true,text.trim()); setText(''); patch(current.id,{status:'Sent',unread:0}); setNote('Message chat mein add ho gaya. Part 2 mein official API se auto-send hoga — abhi Part 1 manual/record mode hai.');
 }
 function pasteReply(body:string){ if(!current||!body.trim())return; addMsg(current.id,false,body.trim()); patch(current.id,{status:'Replied',unread:0,mentions:0}); setModal(null); setNote('Reply add ho gaya — status Replied, follow-ups auto-stop (Part 2 rule).'); }

 function importCSV(f:File){ f.text().then(t=>{ const lines=t.trim().split(/\r?\n/).slice(1); const add:Client[]=lines.filter(Boolean).map(l=>{const [name,platform,contact,niche]=l.split(',').map(x=>x?.trim()||''); return {id:uid(),name:name||'Unnamed',platform:(PLATFORMS.includes(platform as any)?platform:'Email') as Client['platform'],contact:contact||'',niche:niche||'',status:'New' as Status,notes:'',muted:false,optedOut:false,online:false,unread:0,mentions:0,messages:[]};}); setClients(cs=>[...add,...cs]); if(add[0]) setSel(add[0].id); setNote(`${add.length} clients CSV se import ho gaye.`);}); }

 const [form,setForm]=useState({name:'',platform:'WhatsApp' as Client['platform'],contact:'',niche:'',notes:''});
 function saveClient(edit=false){ if(!form.name.trim())return; if(edit&&current){patch(current.id,{...form});} else {const c:Client={id:uid(),...form,status:'New',muted:false,optedOut:false,online:false,unread:0,mentions:0,messages:[]}; setClients(cs=>[c,...cs]); setSel(c.id);} setModal(null); setForm({name:'',platform:'WhatsApp',contact:'',niche:'',notes:''}); }

 return <div className="min-h-[100dvh] p-2 sm:p-4" style={{paddingTop:'max(.5rem, env(safe-area-inset-top))'}}>
  <div className="mx-auto max-w-[1400px] h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] flex gap-4">
   {/* LEFT */}
   <aside className={`neu rounded-[28px] w-full md:w-[35%] md:min-w-[320px] flex-col overflow-hidden ${showChatMobile?'hidden md:flex':'flex'}`}>
    <div className="p-4 pb-2">
     <div className="flex items-center justify-between"><div><h1 className="font-extrabold text-xl">Outreach Desk</h1><p className="text-xs" style={{color:'var(--mut)'}}>Assalamualaikum, {user.name.split(' ')[0]} • {user.email}</p></div>
      <div className="flex gap-2"><button aria-label="theme" onClick={()=>setDark(!dark)} className="neu-sm rounded-full p-2.5">{dark?<Sun size={16}/>:<Moon size={16}/>}</button><button aria-label="logout" onClick={onLogout} className="neu-sm rounded-full p-2.5"><LogOut size={16}/></button></div></div>
     <div className="neu-in rounded-full flex p-1 mt-4 text-sm font-semibold">
       {(['All','Unread','Mentions'] as Tab[]).map(t=><button key={t} onClick={()=>setTab(t)} className={`flex-1 rounded-full py-2 relative ${tab===t?'bubble-me text-white shadow':''}`}>{t}{t==='Mentions'&&counts.mentions>0&&<span className="glass-badge absolute -top-1.5 right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{counts.mentions}</span>}{t==='Unread'&&counts.unread>0&&<span className="ml-1 text-xs opacity-80">({counts.unread})</span>}</button>)}
     </div>
     <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search clients…" className="neu-in w-full rounded-2xl px-4 py-2.5 mt-3 text-sm bg-transparent"/>
     <div className="flex gap-2 mt-3">
       <select value={fPlatform} onChange={e=>setFPlatform(e.target.value)} className="neu-sm rounded-xl px-2 py-2 text-xs flex-1 bg-transparent"><option>All</option>{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select>
       <select value={fStatus} onChange={e=>setFStatus(e.target.value)} className="neu-sm rounded-xl px-2 py-2 text-xs flex-1 bg-transparent"><option>All</option>{['New','Drafted','Sent','Replied','OptedOut'].map(s=><option key={s}>{s}</option>)}</select>
     </div>
     <div className="flex gap-2 mt-3">
       <button onClick={()=>{setForm({name:'',platform:'WhatsApp',contact:'',niche:'',notes:''});setModal('add');}} className="bubble-me text-white rounded-2xl px-3 py-2 text-sm font-bold flex items-center gap-1 flex-1 justify-center"><Plus size={16}/> Add client</button>
       <button onClick={()=>csvRef.current?.click()} className="neu-sm rounded-2xl px-3 py-2 text-sm font-semibold flex items-center gap-1"><Upload size={15}/> CSV</button>
       <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={e=>e.target.files?.[0]&&importCSV(e.target.files[0])}/>
       <button onClick={()=>setModal('offer')} className="neu-sm rounded-2xl px-3 py-2 text-sm font-semibold">My Offer</button>
     </div>
     <p className="text-[11px] mt-2" style={{color:'var(--mut)'}}>CSV format: name,platform,contact,niche (header row required)</p>
    </div>
    <div className="overflow-y-auto scrollthin px-3 pb-3 space-y-2 flex-1">
     {list.map(c=>{const meta=PLATFORM_META[c.platform]; const last=c.messages[c.messages.length-1];
      return <button key={c.id} onClick={()=>{setSel(c.id); patch(c.id,{unread:0}); setShowChatMobile(true);}} className={`w-full text-left rounded-[22px] p-3 flex gap-3 items-center ${c.id===sel?'neu-raised':'neu-sm opacity-90'}`}>
       <div className="relative shrink-0"><div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{background:colorFor(c.name)}}>{initials(c.name)}</div>{c.online&&<span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"/>}</div>
       <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-bold truncate">{c.name}</span><span className="glass-badge text-[10px] font-bold text-white rounded-md px-1.5 py-0.5" style={{background:meta.bg}}>{meta.icon}</span><span className="text-[10px] px-2 py-0.5 rounded-full neu-in">{c.status}</span></div>
       <p className="text-xs truncate" style={{color:'var(--mut)'}}>{last?last.body:c.niche||'No messages yet'}</p></div>
       <div className="flex flex-col items-end gap-1 shrink-0">{c.muted&&<span className="w-2.5 h-2.5 rounded-full bg-slate-400" title="Muted"/>}{c.mentions>0&&<span className="glass-badge bg-blue-500 text-white text-[11px] font-bold rounded-full px-2 py-0.5">@ {c.mentions}</span>}{c.unread>0&&<span className="glass-badge bg-red-500 text-white text-[11px] font-bold rounded-full px-2 py-0.5">{badge(c.unread)}</span>}</div>
      </button>})}
     {list.length===0&&<p className="text-sm text-center py-8" style={{color:'var(--mut)'}}>No clients match this filter.</p>}
    </div>
   </aside>

   {/* RIGHT */}
   <main className={`neu rounded-[28px] flex-1 flex-col overflow-hidden min-w-0 ${showChatMobile?'flex':'hidden md:flex'}`}>
    {current? <>
     <header className="flex items-center gap-3 p-4 border-b border-white/40">
       <button className="md:hidden neu-sm rounded-full p-2" onClick={()=>setShowChatMobile(false)}><ArrowLeft size={18}/></button>
       <div className="relative"><div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{background:colorFor(current.name)}}>{initials(current.name)}</div>{current.online&&<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"/>}</div>
       <div className="flex-1 min-w-0"><p className="font-bold truncate">{current.name}</p><p className="text-xs" style={{color:'var(--mut)'}}>{current.platform} • {current.online?'Online':'Offline'} • Replies: {PLATFORM_META[current.platform].replyMode}</p></div>
       <button onClick={()=>setDrawer(!drawer)} className="neu-sm rounded-full p-2.5"><Info size={18}/></button>
     </header>
     <div className="flex flex-1 overflow-hidden">
       <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto scrollthin p-4 space-y-4">
         {current.messages.map(m=> m.fromMe?
          <div key={m.id} className="flex flex-col items-end"><span className="text-[11px] mb-1" style={{color:'var(--mut)'}}>User • {m.time}</span><div className="bubble-me text-white rounded-[22px] rounded-br-md px-4 py-3 max-w-[78%] shadow-lg whitespace-pre-wrap text-[15px]">{m.body}</div></div>:
          <div key={m.id} className="flex flex-col items-start"><span className="text-[11px] mb-1" style={{color:'var(--mut)'}}>{current.name} • {m.time}</span><div className="neu-sm rounded-[22px] rounded-bl-md px-4 py-3 max-w-[78%] whitespace-pre-wrap text-[15px]">{m.body}</div></div>)}
         {current.messages.length===0&&<p className="text-center text-sm py-10" style={{color:'var(--mut)'}}>No messages yet — AI draft se shuru karein.</p>}
        </div>
        {note&&<p className="mx-4 mb-2 text-xs rounded-xl px-3 py-2 neu-in flex gap-1.5"><ShieldCheck size={14} className="shrink-0 mt-0.5"/>{note}</p>}
        <div className="p-3 sm:p-4 pt-1" style={{paddingBottom:'max(.75rem, env(safe-area-inset-bottom))'}}>
         <div className="neu-in rounded-[24px] p-2">
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder={`Message ${current.name}… (edit AI draft here before sending)`} className="w-full bg-transparent resize-none px-3 py-2 text-[15px]"/>
          <div className="flex flex-wrap items-center gap-2 px-1 pb-1">
           <select value={lang} onChange={e=>setLang(e.target.value as any)} className="neu-sm rounded-full px-2 py-2 text-xs bg-transparent"><option>English</option><option>Roman Urdu</option></select>
           <button disabled={busy} onClick={aiDraft} className="neu-sm rounded-full px-4 py-2.5 text-sm font-bold flex items-center gap-1.5 disabled:opacity-50"><Sparkles size={16} className="text-[#1E6FE8]"/>{busy?'Drafting…':'AI draft'}</button>
           <button onClick={()=>setModal('reply')} className="neu-sm rounded-full px-3 py-2.5 text-xs font-semibold flex items-center gap-1"><ClipboardPaste size={14}/> Paste reply</button>
           <button onClick={send} className="bubble-me text-white rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-1.5 ml-auto shadow-lg"><Send size={15}/> Send</button>
          </div>
         </div>
         <p className="text-[11px] mt-2 px-1" style={{color:'var(--mut)'}}>LinkedIn / Reddit / Facebook / Instagram cold DM: AI draft yahan, send aap manually platform par. WhatsApp / Email / Discord auto-send = Part 2 (official APIs only).</p>
        </div>
       </div>
       {drawer&&<aside className="w-[290px] shrink-0 border-l border-white/40 p-4 overflow-y-auto scrollthin hidden lg:block">
         <div className="flex justify-between items-center"><h3 className="font-bold">Client details</h3><button onClick={()=>setDrawer(false)}><X size={18}/></button></div>
         <div className="mt-4 space-y-3 text-sm">
          <p><span style={{color:'var(--mut)'}}>Contact</span><br/>{current.contact||'—'}</p>
          <p><span style={{color:'var(--mut)'}}>Niche</span><br/>{current.niche||'—'}</p>
          <div><span style={{color:'var(--mut)'}}>Status</span><div className="flex flex-wrap gap-1.5 mt-1">{(['New','Drafted','Sent','Replied','OptedOut'] as Status[]).map(s=><button key={s} onClick={()=>patch(current.id,{status:s,optedOut:s==='OptedOut'})} className={`px-2.5 py-1 rounded-full text-xs font-bold ${current.status===s?'bubble-me text-white':'neu-sm'}`}>{s}</button>)}</div></div>
          <div><span style={{color:'var(--mut)'}}>Notes</span><textarea defaultValue={current.notes} onBlur={e=>patch(current.id,{notes:e.target.value})} rows={4} className="neu-in w-full rounded-2xl p-3 mt-1 bg-transparent"/></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={current.muted} onChange={e=>patch(current.id,{muted:e.target.checked})}/> Muted (grey dot)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={current.optedOut} onChange={e=>patch(current.id,{optedOut:e.target.checked,status:e.target.checked?'OptedOut':current.status})}/> Opted out — kabhi message nahi</label>
          <p><span style={{color:'var(--mut)'}}>History</span><br/>{current.messages.length} messages • {current.messages.filter(m=>m.fromMe).length} sent by you</p>
          <div className="flex gap-2 pt-2"><button onClick={()=>{setForm({name:current.name,platform:current.platform,contact:current.contact,niche:current.niche,notes:current.notes});setModal('edit');}} className="neu-sm rounded-xl px-3 py-2 flex items-center gap-1 font-semibold"><Pencil size={14}/> Edit</button>
          <button onClick={()=>{if(confirm('Delete this client?')){setClients(cs=>cs.filter(c=>c.id!==current.id)); setSel(''); setDrawer(false);}}} className="rounded-xl px-3 py-2 flex items-center gap-1 font-semibold bg-red-500 text-white"><Trash2 size={14}/> Delete</button></div>
         </div>
        </aside>}
     </div>
    </>:<div className="flex-1 grid place-items-center text-sm" style={{color:'var(--mut)'}}>Select a client</div>}
   </main>
  </div>

  {modal&&<div className="fixed inset-0 bg-black/35 backdrop-blur-sm grid place-items-center p-4 z-50"><div className="neu rounded-[26px] p-5 w-full max-w-md max-h-[90dvh] overflow-y-auto">
   {(modal==='add'||modal==='edit')&&<><h3 className="font-extrabold text-lg">{modal==='add'?'Add client':'Edit client'}</h3>
    <div className="space-y-3 mt-4">{(['name','contact','niche'] as const).map(f=><input key={f} value={(form as any)[f]} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f[0].toUpperCase()+f.slice(1)} className="neu-in w-full rounded-2xl px-4 py-3 bg-transparent"/>)}
    <select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value as any})} className="neu-in w-full rounded-2xl px-4 py-3 bg-transparent">{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select>
    <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes" rows={3} className="neu-in w-full rounded-2xl px-4 py-3 bg-transparent"/></div>
    <div className="flex gap-2 mt-5"><button onClick={()=>saveClient(modal==='edit')} className="bubble-me text-white rounded-2xl px-5 py-3 font-bold flex-1">Save</button><button onClick={()=>setModal(null)} className="neu-sm rounded-2xl px-5 py-3 font-semibold">Cancel</button></div></>}
   {modal==='offer'&&<><h3 className="font-extrabold text-lg">My Offer — har AI message mein use hoga</h3>
    <div className="space-y-3 mt-4">{(['business','service','benefit','proof','cta'] as const).map(f=><div key={f}><label className="text-xs font-bold capitalize">{f}</label><textarea value={offer[f]} onChange={e=>setOffer({...offer,[f]:e.target.value})} rows={f==='service'||f==='benefit'?2:1} className="neu-in w-full rounded-2xl px-4 py-3 bg-transparent mt-1"/></div>)}</div>
    <button onClick={()=>setModal(null)} className="bubble-me text-white rounded-2xl px-5 py-3 font-bold w-full mt-5">Save offer</button></>}
   {modal==='reply'&&<ReplyBox onDone={pasteReply} onClose={()=>setModal(null)} clientName={current?.name||''}/>}
  </div></div>}
 </div>;
}
function ReplyBox({onDone,onClose,clientName}:{onDone:(b:string)=>void;onClose:()=>void;clientName:string}){
 const [v,setV]=useState(''); return <><h3 className="font-extrabold text-lg">Paste client reply</h3><p className="text-xs mt-1" style={{color:'var(--mut)'}}>{clientName} ka reply platform se copy kar ke yahan paste karein. Status auto Replied ho jayega.</p><textarea value={v} onChange={e=>setV(e.target.value)} rows={5} className="neu-in w-full rounded-2xl p-4 mt-4 bg-transparent" placeholder="Client ka reply…"/><div className="flex gap-2 mt-4"><button onClick={()=>onDone(v)} className="bubble-me text-white rounded-2xl px-5 py-3 font-bold flex-1">Add reply</button><button onClick={onClose} className="neu-sm rounded-2xl px-5 py-3 font-semibold">Cancel</button></div></>;
}
