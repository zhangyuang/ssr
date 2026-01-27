import { t, getCurrentLanguage } from "./i18n";

export const getWebSiteConfig = (lang?: string) => {
  const currentLang = lang || getCurrentLanguage();
  return {
    header: {
      items: [
        {
          label: t("header.docs", currentLang),
          path: `/docs/why`,
        },
        {
          label: t("header.api", currentLang),
          path: `/docs/api$config`,
        },
        {
          label: t("header.faq", currentLang),
          path: `/docs/features$faq`,
        },
        {
          label: t("header.changelog", currentLang),
          path: `/docs/changelog$index`,
        },
        {
          label: t("header.memory", currentLang),
          path: `/docs/features$memory`,
        },
      ],
    },
    home: {
      firstFloor: {
        title: t("home.title", currentLang),
        desc: t("home.desc", currentLang),
        subtitle: t("home.subtitle", currentLang),
        startButton: {
          label: t("home.startButton", currentLang),
          path: `/docs/features$started`,
        },
        docsButton: {
          label: t("home.docsButton", currentLang),
          path: `/docs/why`,
        },
        imgUrl: "/images/homecode.png",
      },
      secondFloor: {
        title: t("home.whyTitle", currentLang),
        content: t("home.whyContent", currentLang),
        items: [
          {
            title: t("home.feature1.title", currentLang),
            desc: t("home.feature1.desc", currentLang),
            children:
              currentLang === "zh"
                ? [
                    "前端框架支持 React Vue2 Vue3",
                    "服务端框架官方支持 Midway.js Nest.js",
                    "开发者可以通过插件新增任意服务端框架",
                  ]
                : [
                    "Frontend frameworks support React Vue2 Vue3",
                    "Server frameworks officially support Midway.js Nest.js",
                    "Developers can add any server framework through plugins",
                  ],
          },
          {
            title: t("home.feature2.title", currentLang),
            desc: t("home.feature2.desc", currentLang),
            children:
              currentLang === "zh"
                ? [
                    "默认对 ant-design vant 等流行 UI 框架做底层支持可直接引入",
                    "构建工具支持 Webpack/Vite",
                    "支持渲染降级，服务端渲染一键切换为客户端渲染",
                  ]
                : [
                    "Built-in support for popular UI frameworks like ant-design and vant",
                    "Build tools support Webpack/Vite",
                    "Support rendering degradation, one-click switch from SSR to CSR",
                  ],
          },
          {
            title: t("home.feature3.title", currentLang),
            desc: t("home.feature3.desc", currentLang),
            children:
              currentLang === "zh"
                ? [
                    "ssr deploy 一键部署到阿里云",
                    "ssr deploy --tencent 一键部署到腾讯云",
                    "npm run prod 以传统 Node.js 形式部署",
                  ]
                : [
                    "ssr deploy one-click deployment to Alibaba Cloud",
                    "ssr deploy --tencent one-click deployment to Tencent Cloud",
                    "npm run prod deploy in traditional Node.js form",
                  ],
          },
        ],
      },
    },
    footer: {
      items: [
        {
          label: t("footer.relatedLinks", currentLang),
          path: `/docs`,
          children: [
            {
              label: "Github",
              path: "https://github.com/zhangyuang/ssr",
            },
            {
              label: t("header.api", currentLang),
              path: `/docs/api$config`,
            },
            {
              label: t("footer.pluginList", currentLang),
              path: `/docs/plugin$index`,
            },
            {
              label: t("footer.memoryTool", currentLang),
              path: "https://github.com/zhangyuang/v8-profiler-rs",
            },
            {
              label: t("footer.frontendManual", currentLang),
              path: "http://fe.ssr-fc.com/",
            },
            {
              label: t("footer.viteAnalysis", currentLang),
              path: "http://vite.ssr-fc.com/",
            },
          ],
        },
        {
          label: t("footer.contactUs", currentLang),
          path: "/blog",
          children: [
            {
              label: t("footer.communityGroup", currentLang),
              path: `/docs/features$issue`,
            },
            {
              label: t("footer.zhihu", currentLang),
              path: "https://www.zhihu.com/people/zhang-yu-ang-67",
            },
          ],
        },
      ],
    },
  };
};
