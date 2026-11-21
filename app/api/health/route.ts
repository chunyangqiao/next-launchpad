import { NextResponse } from "next/server";

interface HealthRespons {
  status: "ok";
}

/**
 * @description 服务健康检查接口
 */
export async function GET(): Promise<NextResponse<HealthRespons>> {
  return NextResponse.json(
    { status: "ok" },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}
