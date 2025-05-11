import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const examRecords = await db.collection("examRecords").find({}).toArray()

    return NextResponse.json({ examRecords }, { status: 200 })
  } catch (error) {
    console.error("Error fetching exam records:", error)
    return NextResponse.json({ error: "Failed to fetch exam records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDb()

    // Add timestamps
    const examRecord = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("examRecords").insertOne(examRecord)

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating exam record:", error)
    return NextResponse.json({ error: "Failed to create exam record" }, { status: 500 })
  }
}
