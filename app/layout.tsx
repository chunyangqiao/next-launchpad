import { BRAND } from "@/lib/constants/brand";
import { GoogleAnalyticsScript } from "@/lib/gtag";
import "./globals.css";

import type { Metadata, Viewport } from "next";

/**
 * @description 统一Viewport配置
 */
export async function generateViewport(): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    viewportFit: "cover",
  };
}

/**
 * @description 统一生成 Metadata 配置
 *
 * - root layout 拿不到当前pathname，所以这里只产出首页级别的默认值: canonical = /{lang}，robots = index,follow
 */
export async function generateMetaData(): Promise<Metadata> {
  return {
    /**
     * 子路由返回字符串 title 时自动套上 '%s | Brand Name'。
     * 首页用default
     */
    title: {
      template: `%s | ${BRAND}`,
      default: "",
    },
    // icons: {},
    formatDetection: { telephone: false },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        {children}
        <GoogleAnalyticsScript />
      </body>
    </html>
  );
}
