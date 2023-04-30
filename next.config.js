/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: config => {
    // :::::::::::::: SVG EXTENSIONS ::::::::::::::
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // :::::::::::::: CSS MODULES ::::::::::::::
    // CODE: https://dhanrajsp.me/blog/the-troubles-with-nextjs#css-modules

    // const oneOf = config.module.rules.find(
    //   rule => typeof rule.oneOf === "object"
    // );

    // if (oneOf) {
    //   const moduleSassRule = oneOf.oneOf.find(rule =>
    //     regexEqual(rule.test, /\.module\.(scss|sass)$/)
    //   );

    //   if (moduleSassRule) {
    //     const cssLoader = moduleSassRule.use.find(({ loader }) =>
    //       loader.includes("css-loader")
    //     );
    //     if (cssLoader) {
    //       // Use the default CSS modules mode. Next.js use 'pure'. Not sure of all implications
    //       cssLoader.options = {
    //         ...cssLoader.options,
    //         modules: cssLoaderOptions(cssLoader.options.modules),
    //       };
    //     }
    //   }
    // }

    return config;
  },
};

module.exports = nextConfig;
