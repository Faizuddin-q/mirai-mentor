import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

export async function GET() {
  try {
    console.log("🧪 Manual cron trigger requested");
    
    // Send a manual trigger event to Inngest
    await inngest.send({
      name: "test/cron.trigger",
      data: {
        message: "Manual cron trigger",
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cron job manually triggered",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error triggering cron:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
