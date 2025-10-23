import "dotenv/config"; 

export default ({ config }) => {
  // usa a secret do eas ou process.env.API_URL do .env local
  const apiUrlToEmbed = process.env.API_URL 
    ? process.env.API_URL
    : process.env.API_URL_SECRET ?? "$EAS_BUILD_SECRET_API_URL"; 

  return {
    ...config,
    extra: {
      ...config.extra,
      // para embutir na nuvem
      API_URL: apiUrlToEmbed,
      eas: {
        // Seu ID do projeto, necessário para o EAS
        projectId: "d73bd2d8-02d0-4b34-a664-510b7234b516" 
      }
    },
  };
};