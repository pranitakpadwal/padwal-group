import { NextResponse, type NextRequest } from "next/server";
import { getLeaderboard } from "@/lib/net-worth";
import { getCategoryView, isCategory } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const leaderboard = await getLeaderboard();
    const categoryParam = request.nextUrl.searchParams.get("category") ?? "world";
    const category = isCategory(categoryParam) ? categoryParam : "world";
    const view = getCategoryView(leaderboard, category);

    return NextResponse.json({
      ...leaderboard,
      ...view,
    });
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
