import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, value, id, label } = body as {
      name: string
      value: number
      id: string
      label: string
    }

    // Log in server console for now — swap to Vercel Analytics / DB / GA as needed
    console.log(`[Web Vitals] ${name}=${value} (${label}) id=${id}`)

    // Example: persist to DB or forward to analytics
    // await db.webVitals.create({ data: { name, value, id, label, createdAt: new Date() } })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
