import "dotenv/config";

export default ({ config }) => {
    // usa a secret do eas ou process.env.API_URL do .env local
    const apiUrlToEmbed = process.env.API_URL
        ? process.env.API_URL
        : process.env.API_URL_SECRET ?? "$EAS_BUILD_SECRET_API_URL";

    return {
        ...config,
        plugins: [
            [
                "expo-build-properties",
                {
                    android: {
                        useCleartextTraffic: true,
                    },
                },
            ],
            "expo-router",
        ],
        extra: {
            ...config.extra,
            // para embutir na nuvem
            API_URL: apiUrlToEmbed,
            eas: {
                projectId: "d73bd2d8-02d0-4b34-a664-510b7234b516"
            }
        },
    };
};