package clicksos.api.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class HuggingFaceService {

        @Value("${HUGGINGFACE_TOKEN}")
        private String token;

        // url para o endpoint da API Router (formato OpenAI Chat Completions)
        private static final String MODEL_URL = "https://router.huggingface.co/v1/chat/completions";

        // modelo da ia
        private static final String ROUTER_MODEL = "zai-org/GLM-4.6:novita";

        // estilos para variar as mensagens
        private static final String[] estilos = {
                        "em tom calmo e tranquilizador",
                        "de forma direta e empática",
                        "com senso de urgência e clareza",
                        "com linguagem formal e respeitosa",
                        "de maneira breve e objetiva",
                        "focado na ação e nos próximos passos necessários",
                        "de maneira acolhedora e oferecendo suporte imediato",
                        "em tom sério, destacando a gravidade da situação",
                        "com linguagem que incentiva a resposta imediata",
                        "com ênfase na verificação e confirmação da situação"
        };

        // método para gerar a mensagem de emergencia com hugging face
        public String gerarMensagemEmergencia(
                        String nomeUsuario,
                        String emailUsuario,
                        String nomeContato,
                        Integer idadeContato,
                        double latitude,
                        double longitude) {
                try {
                        String mapaLink = "https://www.google.com/maps?q=" + latitude + "," + longitude;
                        Random random = new Random();
                        String estilo = estilos[random.nextInt(estilos.length)];

                        // prompt para a ia criar a mensagem do e-mail que será enviado para os contatos
                        // do usuario
                        String prompt = String.format(
                                        "**INSTRUÇÃO DE TOM:** Você atua como um sistema de alerta profissional e empático. Ajuste o tom da mensagem baseado na idade do contato (idadeContato: %d). Quanto mais a idade do contato passar de 40 anos, o tom deve ser cada vez mais **calmo, informativo, tranquilizador e minimizar o pânico**. Para contatos mais jovens, escolha um dos estilos (estilos: %s) para gerar o texto.\n\n"
                                                        +
                                                        "**REQUISITOS DE CONTEÚDO E FORMATO:**\n"
                                                        +
                                                        "1. Gere um e-mail completo no formato profissional, sem usar asteriscos, negritos ou formatação Markdown.\n"
                                                        +
                                                        "2. O DESTINATÁRIO É O CONTATO DE EMERGÊNCIA, NÃO O USUÁRIO EM PERIGO.\n"
                                                        +
                                                        "3. O e-mail deve começar com uma saudação personalizada (Ex: Olá %s) e informar que o usuário (%s, e-mail: %s) acionou o clickSOS.\n"
                                                        +
                                                        "4. Separe em um parágrafo exclusivo a informação da localização, citando brevemente as coordenadas e fornecendo o link do Google Maps (%s) como principal referência.\n"
                                                        +
                                                        "5. Feche o e-mail de forma apropriada, terminando com 'Atenciosamente, Equipe clickSOS.'",
                                        idadeContato, estilo, nomeContato, nomeUsuario, emailUsuario, mapaLink);

                        HttpClient client = HttpClient.newHttpClient();

                        // parâmetros de decodificação e escape do prompt
                        String escapedPrompt = prompt.replace("\"", "\\\"").replace("\n", "\\n");

                        // BODY: Formato Chat Completions (OpenAI)
                        String body = String.format(
                                        "{"
                                                        + "\"model\": \"%s\","
                                                        + "\"messages\": ["
                                                        + "{\"role\": \"user\", \"content\": \"%s\"}"
                                                        + "],"
                                                        + "\"temperature\": 0.7,"
                                                        + "\"max_tokens\": 500"
                                                        + "}",
                                        ROUTER_MODEL,
                                        escapedPrompt);

                        // requisição HTTP
                        HttpRequest request = HttpRequest.newBuilder()
                                        .uri(URI.create(MODEL_URL))
                                        .header("Authorization", "Bearer " + token)
                                        .header("Content-Type", "application/json")
                                        .POST(HttpRequest.BodyPublishers.ofString(body))
                                        .build();

                        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                        int statusCode = response.statusCode();
                        String result = response.body();

                        // DEBUG: logs mantidos para monitoramento
                        System.out.println("--- DEBUG HUGGINGFACE RESPONSE ---");
                        System.out.println("API URL Usada: " + MODEL_URL);
                        System.out.println("Status Code: " + statusCode);
                        System.out.println("Response Body (raw): " + result);
                        System.out.println("----------------------------------");

                        // Tratamento explícito de erros HTTP
                        if (statusCode != 200) {
                                System.out.println(
                                                "ERRO HTTP: A API Router retornou um status de falha: " + statusCode);
                                // Fallback para erros de comunicação com a API
                                return String.format(
                                                "Alerta de Emergência - ClickSOS (Erro API %d)\n\n" +
                                                                "Prezado(a),\n\n" +
                                                                "O usuário %s (e-mail: %s) acionou o ClickSOS, mas houve uma falha na IA. Verifique a localização: %s\n\nAtenciosamente,\nEquipe clickSOS",
                                                statusCode, nomeUsuario, emailUsuario, mapaLink);
                        }

                        // Lógica de extração do campo 'content'
                        String searchStart = "\"role\":\"assistant\",\"content\":\"";
                        int contentKeyIndex = result.indexOf(searchStart);

                        if (contentKeyIndex != -1) {
                                int start = contentKeyIndex + searchStart.length();
                                int endQuoteIndex = result.indexOf("\"},\"finish_reason\"", start);

                                if (endQuoteIndex != -1 && endQuoteIndex > start) {
                                        int end = endQuoteIndex;
                                        String generatedContent = result.substring(start, end);

                                        // *** NOVO PASSO: Remoção de caracteres de formatação Markdown e escapes ***
                                        return generatedContent
                                                        .replace("\\\"", "\"")
                                                        .replace("\\n", "\n")
                                                        .replace("**", "") // Remove negrito Markdown
                                                        .replace("*", "") // Remove itálico ou listas Markdown (se
                                                                          // houver)
                                                        .trim();
                                }
                        }
                        // *****************************************************************************************

                        // Fallback 1: Falha na extração
                        System.out.println("DEBUG: Falha na extração de generated_text/content. Usando Fallback 1.");
                        return String.format(
                                        "Alerta de Emergência - clickSOS\n\n" +
                                                        "Prezado(a),\n\n" +
                                                        "O usuário %s (e-mail: %s) acionou o clickSOS e pode estar em perigo.\n"
                                                        +
                                                        "Verifique sua localização: %s\n\nAtenciosamente,\nEquipe clickSOS",
                                        nomeUsuario, emailUsuario, mapaLink);

                } catch (Exception e) {
                        System.out.println("Erro ao gerar mensagem com IA (Exceção de I/O): " + e.getMessage());
                        // Fallback 2: Exceção de rede, etc.
                        return String.format(
                                        "Alerta de Emergência - clickSOS\n\n" +
                                                        "Prezado(a),\n\n" +
                                                        "O usuário %s (e-mail: %s) acionou o clickSOS e pode estar em perigo.\n"
                                                        +
                                                        "Verifique sua localização.\n\nAtenciosamente,\nEquipe clickSOS",
                                        nomeUsuario, emailUsuario);
                }
        }
}
