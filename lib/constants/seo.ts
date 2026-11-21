import type { Metadata } from "next";

/**
 * @description nofollow noopener noreferrer
 */
export const EXTERNAL_LINK_REL = "nofollow noopener noreferrer";

/**
 * @description noopener noreferrer
 */
export const OWN_HOST_LINK_REL = "noopener noreferrer";

/**
 * @description description 的上限，SEO 常用规则是 145–160 个字符。
 */
export const SEO_EXCERPT_MAX_LENGTH = 155;

/**
 * @description description控制在这个长度：摘要只是给搜索引擎看的提示，不是正文副本
 */
export const ARTICLE_DESCRIPTION_MAX_LENGTH = 200;

/**
 * @description hreflang 表里指向默认语言版本的键。
 */
export const HREFLANG_X_DEFAULT = "x-default";

/**
 * @description JSON-LD 的 @context。
 */
export const SCHEMA_ORG_CONTEXT = "https://schema.org";

/**
 * @description 路由文案表缺 namespace 时的默认值。
 */
export const DEFAULT_SEO_NAMESPACE = "shared";

/**
 * @description 不允许被搜索引擎收录的路径。纯数据文件，不含逻辑
 *
 * 什么情况下可以将页面添加到不被搜索引擎收录的集合中：
 * - 页面主体必须登录后才能被用户访问。如：用户中心
 * - 跳转页面。 如: 登录页
 * - 用户私域数据页面。如：订单列表
 *
 * 原因:
 *  - Google对能打开但是没有实质内容的页面会判为thin content / soft 404。这类URL多了会拉低整站的站点质量评估。
 *   会连带影响真正需要自然流量的页面。
 *
 *  - 重复内容。登录页在多语言的条件下，除了文案几乎没有任何差异。让它们进索引，就是在给搜索引擎送一批相似度高、低价值的重复URL
 *
 *  - 私域数据页面会影响抓取预算。把预算留给真正需要被抓去的公开页，不要留给订单、站内信等页面这一类的私域数据页面
 *
 *  - 安全与品牌风险。个人中心/订单 这一类用户私域路径出现在搜索结果里时，一方面会暴露站点的账户结构、另一方面会给
 *    钓鱼网站提供一个模仿模板。
 *
 *  - 索引管理成本。一旦私域URL被收录，想让它推出索引，noindex是唯一可靠手段。但是生效要等Google重新抓取，会有一个时间差
 *    robots.txt 的 Disallow 反而做不到：爬虫读不到页面就看不到 noindex，已收录的 URL 会永远留在索引里。所以排除逻辑
 *    要放到meta层。
 *
 * @example
 *  - 写法: 去掉语言标识 `/{language}` 前缀后的路径。
 *  - '/sign-in' -> 登录页面
 *  - '/reset-pwd' -> 重置密码
 *  -
 */
export const NO_INDEX_PREFIXES = ["/sign-in", "/sign-up", "/reset-pwd", "/profile", "/order"];

/**
 * @description 获取不需要索引页面的Meta信息
 */
export const DO_NOT_NEED_INDEX_PAGE_METADATA = {
  robots: { index: false, follow: false },
  alternates: null,
  // 同 buildMetadata：不继承首页的 description / keywords
  description: null,
  keywords: null,
} as const satisfies Metadata;
