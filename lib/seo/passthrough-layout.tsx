import * as React from "react";

/**
 * 只为挂 metadata 而存在的 layout：页面组件是 "use client" 导不出 generateMetadata，
 * 或者整段路由要统一 noindex。原样透传 children，不改任何渲染行为。
 */
export function PassthroughLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
