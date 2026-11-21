import { getTodayUTCW3cDate } from "@/lib/seo/helper";

export async function GET() {
  const lastmod = getTodayUTCW3cDate();
}
