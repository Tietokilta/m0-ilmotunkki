const useCloudStorage =
  typeof process.env.STORAGE_ACCOUNT === "string" &&
  typeof process.env.STORAGE_ACCOUNT_KEY === "string" &&
  typeof process.env.STORAGE_URL === "string" &&
  typeof process.env.STORAGE_CONTAINER_NAME === "string";

export default ({ env }) => ({
  management: {
    enabled: true,
    resolve: "./src/plugins/management",
  },
  upload: {
    enabled: useCloudStorage,
    config: {
      provider: "strapi-provider-upload-azure-storage",
      providerOptions: {
        account: env("STORAGE_ACCOUNT"),
        accountKey: env("STORAGE_ACCOUNT_KEY"), //either account key or sas token is enough to make authentication
        serviceBaseURL: env("STORAGE_URL"), // optional
        containerName: env("STORAGE_CONTAINER_NAME"),
        defaultPath: "uploads",
      },
    },
  },
});
