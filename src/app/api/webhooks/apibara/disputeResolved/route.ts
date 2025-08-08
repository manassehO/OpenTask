import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { disputes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.APIBARA_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature") ?? "";
  const rawBody = await req.text();

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);
    const { taskId, completer, txHash, resolutionOutcome } = body;

    if (!taskId ?? !completer ?? !txHash ?? !resolutionOutcome) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    type DisputeStatus = "DISPUTED" | "OPEN" | "RESOLVED_APPROVE" | "RESOLVED_REJECT";

    let status: DisputeStatus;

    switch (resolutionOutcome.toLowerCase()) {
      case "approve":
      case "approved":
        status = "RESOLVED_APPROVE";
        break;
      case "reject":
      case "rejected":
        status = "RESOLVED_REJECT";
        break;
      default:
        return NextResponse.json({ error: "Invalid resolutionOutcome" }, { status: 400 });
    }

    await db
      .update(disputes)
      .set({
        resolveTxHash: txHash,
        updatedAt: new Date(),
        status: resolutionOutcome ===  "approve" ? "RESOLVED_APPROVE" : "RESOLVED_REJECT",
      })
      .where(eq(disputes.disputeId, taskId));

    // Optional: Update related submissions status here if needed

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("disputeResolved webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function verifySignature(rawBody: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest("hex");
  return signature === digest;
}
