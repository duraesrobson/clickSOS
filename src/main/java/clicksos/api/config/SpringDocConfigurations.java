package clicksos.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SpringDocConfigurations {

        @Bean
        public OpenAPI apiInfo() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("clickSOS API")
                                                .description(
                                                                "API para gerenciamento de alertas e usuários. Permite criar alertas, listar os alertas do usuário autenticado, gerenciar contatos e enviar notificações de forma segura. Cada endpoint segue regras de autenticação para garantir que os usuários só acessem seus próprios dados.")
                                                .version("1.0"))
                                .components(new Components()
                                                .addSecuritySchemes("bearer-key",
                                                                new SecurityScheme()
                                                                                .type(SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")))
                                .addSecurityItem(new SecurityRequirement().addList("bearer-key"));
        }
}
