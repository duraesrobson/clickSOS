package clicksos.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ApiApplication {

	public static void main(String[] args) {
		// para usar o render cpm railway
		if (System.getenv("DB_URL") == null) {
			try {
				Dotenv dotenv = Dotenv.load();
				System.setProperty("DB_URL", dotenv.get("DB_URL"));
				System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
				System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
				System.setProperty("EMAIL", dotenv.get("EMAIL"));
				System.setProperty("SENHA_APP_EMAIL", dotenv.get("SENHA_APP_EMAIL"));
				System.setProperty("HUGGINGFACE_TOKEN", dotenv.get("HUGGINGFACE_TOKEN"));
			} catch (Exception e) {
				System.err.println("Aviso: .env não encontrado. Usando variáveis de ambiente do sistema.");
			}
		}

		SpringApplication.run(ApiApplication.class, args);
	}
}
