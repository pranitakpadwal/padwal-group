import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/net-worth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch live billionaire data.",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}
