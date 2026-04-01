import { types as T, matches } from "../deps.ts";

const { shape, string } = matches;

export const migration_up_2_0_7 = (config: T.Config): T.Config => {
  if (Object.keys(config).length === 0) {
    // service was never configured
    return config;
  }

  const shopifyConfig = shape({
    shopify: shape({
      status: string,
    }),
  });

  const matchConfigWithPlugins = shape({
    plugins: shopifyConfig,
  });

  if (!matchConfigWithPlugins.test(config)) {
    const newPluginsConfig: typeof shopifyConfig._TYPE = {
      shopify: {
        status: "disabled",
      },
    };
    return {
      ...config,
      plugins: newPluginsConfig,
    };
  } else {
    return config;
  }
};
