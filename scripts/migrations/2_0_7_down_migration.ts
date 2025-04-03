import { types as T, matches } from "../deps.ts";

const { shape, any } = matches;

export const migration_down_2_0_7 = (config: T.Config): T.Config => {
  if (Object.keys(config).length === 0) {
    // service was never configured
    return config;
  }

  const matchConfigWithPlugins = shape({
    plugins: any,
  });

  if (!matchConfigWithPlugins.test(config)) {
    throw `Could not find plugins key in config: ${matchConfigWithPlugins.errorMessage(config)}`;
  } else {
    delete config.plugins;
  }

  return config;
};
