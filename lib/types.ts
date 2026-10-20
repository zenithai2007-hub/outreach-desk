export type Platform='WhatsApp'|'LinkedIn'|'Instagram'|'Facebook'|'Reddit'|'Discord'|'Email'|'Website';
export type Status='New'|'Drafted'|'Sent'|'Replied'|'OptedOut';
export type Msg={id:string;fromMe:boolean;body:string;time:string;mentions?:number};
export type Client={id:string;name:string;platform:Platform;contact:string;niche:string;status:Status;notes:string;muted:boolean;optedOut:boolean;online:boolean;unread:number;mentions:number;messages:Msg[]};
export type Offer={business:string;service:string;benefit:string;proof:string;cta:string};
export const PLATFORMS:Platform[]=['WhatsApp','LinkedIn','Instagram','Facebook','Reddit','Discord','Email','Website'];
export const PLATFORM_META:Record<Platform,{icon:string;bg:string;replyMode:string}> = {
  WhatsApp:{icon:'WA',bg:'#25D366',replyMode:'Official API replies (Part 2)'},
  LinkedIn:{icon:'in',bg:'#0A66C2',replyMode:'Manual paste reply'},
  Instagram:{icon:'IG',bg:'#E4405F',replyMode:'Official API replies (Part 2)'},
  Facebook:{icon:'f',bg:'#1877F2',replyMode:'Manual paste reply'},
  Reddit:{icon:'r/',bg:'#FF4500',replyMode:'Manual paste reply'},
  Discord:{icon:'D',bg:'#5865F2',replyMode:'Bot replies (Part 2)'},
  Email:{icon:'@',bg:'#64748b',replyMode:'Official API replies (Part 2)'},
  Website:{icon:'W',bg:'#0ea5e9',replyMode:'Form submissions'},
};
export const AVATAR_COLORS=['#1E6FE8','#7c3aed','#059669','#d97706','#db2777','#0891b2','#4f46e5','#ea580c'];
export const colorFor=(name:string)=>AVATAR_COLORS[name.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_COLORS.length];
export const initials=(n:string)=>n.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
export const nowTime=()=>new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
