export type Platform='WhatsApp'|'LinkedIn'|'Instagram'|'Facebook'|'Reddit'|'Discord'|'Email'|'Website';
export type Status='New'|'Drafted'|'Sent'|'Replied'|'OptedOut';
export type Msg={id:string;fromMe:boolean;body:string;time:string;mentions?:number};
export type Client={id:string;name:string;platform:Platform;contact:string;niche:string;status:Status;notes:string;muted:boolean;optedOut:boolean;online:boolean;unread:number;mentions:number;messages:Msg[]};
export type Offer={business:string;service:string;benefit:string;proof:string;cta:string};
export const PLATFORMS:Platform[]=['WhatsApp','LinkedIn','Instagram','Facebook','Reddit','Discord','Email','Website'];
export const PLATFORM_META:Record<Platform,{icon:string;bg:string}> = {
  WhatsApp:{icon:'WA',bg:'#25D366'},
  LinkedIn:{icon:'in',bg:'#0A66C2'},
  Instagram:{icon:'IG',bg:'#E4405F'},
  Facebook:{icon:'f',bg:'#1877F2'},
  Reddit:{icon:'r/',bg:'#FF4500'},
  Discord:{icon:'D',bg:'#5865F2'},
  Email:{icon:'@',bg:'#64748b'},
  Website:{icon:'W',bg:'#0ea5e9'},
};
export const AVATAR_COLORS=['#BC3B3F','#9E2B30','#D94F53','#20161a','#7f1d22','#8a6568','#c0392b','#5c2e31'];
export const colorFor=(name:string)=>AVATAR_COLORS[name.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_COLORS.length];
export const initials=(n:string)=>n.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
export const nowTime=()=>new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
