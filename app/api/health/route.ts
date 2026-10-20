import {NextResponse} from 'next/server';
export async function GET(){return NextResponse.json({ok:true,data:{service:'outreach-desk',part:1,llmConfigured:!!(process.env.LLM_API_KEY||process.env.OPENAI_API_KEY)}})}
