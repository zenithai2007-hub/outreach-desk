import {NextRequest,NextResponse} from 'next/server';
// Server-only AI draft. Key lives in env (LLM_API_KEY / OPENAI_API_KEY) and NEVER reaches the browser.
// No key configured -> smart deterministic generator (same contract), so Part 1 works out of the box.
const LENGTH:Record<string,string>={WhatsApp:'2-3 short lines, friendly, one CTA',LinkedIn:'3-4 professional lines, no hype, one soft CTA',Instagram:'2 short lines, warm, one CTA',Facebook:'2-3 lines, conversational',Reddit:'helpful, non-salesy, mention their post first, very soft CTA',Discord:'short, community tone',Email:'subject-worthy opening, 4-5 lines, clear CTA, include opt-out line',Website:'2-3 lines, reference their form enquiry'};
function mockDraft(b:any){
  const {client,offer,language}=b; const name=(client.name||'there').split(' ')[0].replace(/^u\//,'');
  const niche=client.niche||'your business'; const en:Language='en';
  if(language==='Roman Urdu'){
    return `Assalamualaikum ${name}! Main ${offer.business} se hoon. Hum ${niche} ke liye ${offer.service} banate hain — ${offer.benefit}. ${offer.proof}. ${offer.cta}`;
  }
  const openers:Record<string,string>={Reddit:`Saw your post about follow-ups — genuinely useful thread.`,LinkedIn:`Noticed your work at ${niche} — impressive setup.`,Email:`Quick intro from ${offer.business}.`,Discord:`Hey ${name} — love what you're building in the server.`};
  const open=openers[client.platform]||`Hi ${name}!`;
  let d=`${open} I'm with ${offer.business}. We build ${offer.service} — it ${offer.benefit}. ${offer.proof}. ${offer.cta}`;
  if(client.platform==='Email') d+=` If it's not relevant, reply "unsubscribe" and I won't follow up.`;
  return d;
}
type Language='en'|'Roman Urdu';
export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>null);
  if(!body?.client||!body?.offer) return NextResponse.json({ok:false,error:'client and offer required'},{status:400});
  const key=process.env.LLM_API_KEY||process.env.OPENAI_API_KEY;
  if(!key) return NextResponse.json({ok:true,data:{draft:mockDraft(body),source:'local-generator',platformGuide:LENGTH[body.client.platform]||''}});
  try{
    const prompt=`Write ONE short outreach message. Platform: ${body.client.platform} (${LENGTH[body.client.platform]}). Language: ${body.language||'English'}. Client: ${body.client.name}, ${body.client.niche||''}. Notes: ${body.client.notes||'none'}. My offer: ${JSON.stringify(body.offer)}. Specific, human, no hype, honor opt-outs. Return only the message.`;
    const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.LLM_MODEL||'gpt-4o-mini',messages:[{role:'user',content:prompt}],temperature:0.7})});
    const j=await r.json(); const draft=j?.choices?.[0]?.message?.content?.trim();
    if(!draft) throw new Error('empty');
    return NextResponse.json({ok:true,data:{draft,source:'llm'}});
  }catch{ return NextResponse.json({ok:true,data:{draft:mockDraft(body),source:'local-generator-fallback'}}); }
}
