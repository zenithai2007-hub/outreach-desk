import './globals.css'; import {Inter} from 'next/font/google';
const inter=Inter({subsets:['latin'],weight:['400','500','600','700','800']});
export const metadata={title:'Outreach Desk — AI outreach inbox',description:'Personalized outreach across WhatsApp, LinkedIn, Instagram, Email and more — AI drafts, you approve and send.'};
export default function R({children}:{children:React.ReactNode}){return <html lang="en"><body className={inter.className}>{children}</body></html>}
