import {NextRequest,NextResponse} from 'next/server';
// Built-in draft engine (server-side, koi user key ya settings nahi).
// Template drafts: "My Offer" + client notes se bharay jate hain, har platform ki
// tone/length aur chosen language (English / Roman Urdu) ke mutabiq.
const GUIDE:Record<string,string>={WhatsApp:'short, friendly',LinkedIn:'professional, soft CTA',Instagram:'short, warm',Facebook:'conversational',Reddit:'helpful, non-salesy',Discord:'short, community tone',Email:'clear, polite, opt-out line included',Website:'reference their enquiry'};
function draft(b:any){
  const {client,offer,language}=b; const first=(client.name||'there').split(' ')[0].replace(/^u\//,'');
  const niche=client.niche||'your business';
  if(language==='Roman Urdu'){
    return `Assalamualaikum ${first}! Main ${offer.business} se hoon. Hum ${niche} ke liye ${offer.service} banate hain — ${offer.benefit}. ${offer.proof}. ${offer.cta}`;
  }
  const openers:Record<string,string>={Reddit:`Saw your post — helpful thread, thanks for sharing it.`,LinkedIn:`Noticed your work at ${niche} — impressive setup.`,Email:`Quick intro from ${offer.business}.`,Discord:`Hey ${first} — love what you're building in the community.`};
  const open=openers[client.platform]||`Hi ${first}!`;
  let d=`${open} I'm with ${offer.business}. We build ${offer.service} — it ${offer.benefit}. ${offer.proof}. ${offer.cta}`;
  if(client.platform==='Email') d+=` If it's not relevant, just reply "unsubscribe" and I won't follow up.`;
  return d;
}
export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>null);
  if(!body?.client||!body?.offer) return NextResponse.json({ok:false,error:'client and offer required'},{status:400});
  return NextResponse.json({ok:true,data:{draft:draft(body),source:'built-in',platformGuide:GUIDE[body.client.platform]||''}});
}
