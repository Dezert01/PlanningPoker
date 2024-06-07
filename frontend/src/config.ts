type Environment = keyof typeof configs;

export const environment: Environment = "local";

const defaultConfig = {
  currentAppVersion: 1,
};

const configs = {
  local: {
    ...defaultConfig,
    baseUrl: "https://backendinf1337.azurewebsites.net",
    websocketUrl: "https://backendinf1337.azurewebsites.net",
    sentryDsn: "",
    googleApiKey: "",
  },
  production: {
    ...defaultConfig,
    baseUrl: "",
    websocketUrl: "",
    sentryDsn: "",
    googleApiKey: "",
  },
};
export const config = configs[environment];
