'use client';
import {useEffect,useState} from 'react';
import Inbox from '@/components/Inbox';
export default function Home(){
 const [user,setUser]=useState<any>(null); const [ready,setReady]=useState(false);
 const [mode,setMode]=useState<'login'|'signup'>('login'); // login FIRST (user standing preference)
 const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [err,setErr]=useState('');
 useEffect(()=>{ const u=localStorage.getItem('outreach-desk:session'); if(u) setUser(JSON.parse(u)); setReady(true); },[]);
 if(!ready) return null;
 if(user) return <Inbox user={user} onLogout={()=>{localStorage.removeItem('outreach-desk:session'); setUser(null);}}/>;
 function submit(){ if(!email.includes('@')){setErr('Valid email likhein');return;} if(pass.length<6){setErr('Password kam az kam 6 characters');return;} if(mode==='signup'&&!name.trim()){setErr('Name likhein');return;}
   const accounts=JSON.parse(localStorage.getItem('outreach-desk:accounts')||'{}');
   if(mode==='signup'){ if(accounts[email]){setErr('Account pehle se hai — Log In karein');return;} accounts[email]={name,email,pass}; localStorage.setItem('outreach-desk:accounts',JSON.stringify(accounts)); }
   else { const a=accounts[email]; if(!a||a.pass!==pass){setErr('Email ya password ghalat hai — ya pehle Sign Up karein');return;} }
   const u={name:mode==='signup'?name:accounts[email].name,email}; localStorage.setItem('outreach-desk:session',JSON.stringify(u)); setUser(u);
 }
 return <main className="min-h-[100dvh] grid place-items-center p-4">
  <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center">
   <div><h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Outreach Desk</h1><p className="mt-3 text-lg" style={{color:'var(--mut)'}}>Ek hi inbox mein saare clients. AI personalized draft likhe, aap edit kar ke bhejein — sirf official channels, opt-out hamesha respect.</p>
   <div className="flex gap-2 mt-5 flex-wrap">{['WhatsApp','LinkedIn','Instagram','Facebook','Reddit','Discord','Email','Website'].map(p=><span key={p} className="neu-sm rounded-full px-3 py-1.5 text-xs font-bold">{p}</span>)}</div>
   <p className="text-xs mt-5" style={{color:'var(--mut)'}}>Part 1: Dashboard • Part 2: Auto-send backend (official APIs) • Part 3: Android keyboard — har part aap ki confirmation ke baad.</p></div>
   <div className="neu rounded-[28px] p-6">
    <div className="neu-in rounded-full flex p-1 font-bold text-sm"><button onClick={()=>setMode('login')} className={`flex-1 rounded-full py-2.5 ${mode==='login'?'bubble-me text-white':''}`}>Log In</button><button onClick={()=>setMode('signup')} className={`flex-1 rounded-full py-2.5 ${mode==='signup'?'bubble-me text-white':''}`}>Sign Up</button></div>
    <div className="space-y-3 mt-5">
     {mode==='signup'&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="neu-in w-full rounded-2xl px-4 py-3 bg-transparent"/>}
     <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="neu-in w-full rounded-2xl px-4 py-3 bg-transparent"/>
     <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="neu-in w-full rounded-2xl px-4 py-3 bg-transparent"/>
     {err&&<p className="text-sm text-red-500">{err}</p>}
     <button onClick={submit} className="bubble-me text-white w-full rounded-2xl py-3.5 font-extrabold shadow-lg">{mode==='login'?'Log In':'Create account'}</button>
     <p className="text-[11px] text-center" style={{color:'var(--mut)'}}>Part 1 demo auth (per-user data browser mein isolated). Production auth = Supabase Auth (Part 2 seam ready).</p>
    </div>
   </div>
  </div>
 </main>;
}
