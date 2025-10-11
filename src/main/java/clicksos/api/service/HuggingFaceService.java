package clicksos.api.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import clicksos.api.dto.alert.DadosAlert;

@Service
public class HuggingFaceService {

        @Value("${HUGGINGFACE_TOKEN}")
        private String token;

        // url para o endpoint da API Router (formato OpenAI Chat Completions)
        private static final String MODEL_URL = "https://router.huggingface.co/v1/chat/completions";

        // modelo da ia (usado para mensagens de emergência e resumos analíticos)
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

        // metodo para centralizar a requisicao da IA
        private String fazerRequisicaoIa(String prompt, String modelo, int maxTokens) throws Exception {
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
                                                + "\"max_tokens\": %d" // Variável de maxTokens
                                                + "}",
                                modelo,
                                escapedPrompt,
                                maxTokens);

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

                // tratamento explícito de erros HTTP
                if (statusCode != 200) {
                        System.out.println(
                                        "ERRO HTTP: A API Router retornou um status de falha: " + statusCode);
                        throw new Exception("API Router retornou um status de falha: " + statusCode);
                }

                // lógica de extração do campo 'content'
                String searchStart = "\"role\":\"assistant\",\"content\":\"";
                int contentKeyIndex = result.indexOf(searchStart);

                if (contentKeyIndex != -1) {
                        int start = contentKeyIndex + searchStart.length();
                        int endQuoteIndex = result.indexOf("\"},\"finish_reason\"", start);

                        if (endQuoteIndex != -1 && endQuoteIndex > start) {
                                int end = endQuoteIndex;
                                String generatedContent = result.substring(start, end);

                                // remoção de caracteres de formatação Markdown e escapes ***
                                return generatedContent
                                                .replace("\\\"", "\"")
                                                .replace("\\n", "\n")
                                                .replace("**", "")
                                                .replace("*", "")
                                                .trim();
                        }
                }
                // fallback de extração
                throw new Exception("Falha na extração do conteúdo da resposta da IA (Chat).");
        }

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
                                        "**INSTRUÇÃO DE TON:** Você atua como um sistema de alerta profissional e empático. Ajuste o tom da mensagem baseado na idade do contato (idadeContato: %d). Quanto mais a idade do contato passar de 40 anos, o tom deve ser cada vez mais **calmo, informativo, tranquilizador e minimizar o pânico**. Para contatos mais jovens, escolha um dos estilos (estilos: %s) para gerar o texto.\n\n"
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

                        // usa o método refatorado
                        return fazerRequisicaoIa(prompt, ROUTER_MODEL, 500);

                } catch (Exception e) {
                        System.out.println("Erro ao gerar mensagem com IA (Exceção de I/O): " + e.getMessage());

                        // fallback em caso de erro de API ou extração
                        String mapaLink = "https://www.google.com/maps?q=" + latitude + "," + longitude;
                        return String.format(
                                        "Alerta de Emergência - clickSOS\n\n" +
                                                        "Prezado(a),\n\n" +
                                                        "O usuário %s (e-mail: %s) acionou o clickSOS e pode estar em perigo.\n"
                                                        +
                                                        "Verifique sua localização: %s\n\nAtenciosamente,\nEquipe clickSOS",
                                        nomeUsuario, emailUsuario, mapaLink);
                }
        }

        // metodo para gerar um resumo analítico dos alertas
        public String gerarResumoAlertas(String nomeUsuario, List<DadosAlert> alertas) {
                if (alertas == null || alertas.isEmpty()) {
                        return "Nenhum alerta recente para resumir.";
                }

                // formata a lista de coordenadas para inclusão no texto
                String listaAlertasFormatada = alertas.stream()
                                .map(a -> String.format("Alerta acionado em %s. Coordenadas: (%.4f, %.4f). ",
                                                a.criadoEm(),
                                                a.latitude(), a.longitude()))
                                .collect(Collectors.joining(" | ")); // Usando separador claro

                try {
                        // prompt para a IA gerar o resumo analítico
                        String prompt = String.format(
                                        "**INSTRUÇÃO:** Você é um sistema de análise de segurança. Recebeu uma lista de alertas de emergência acionados pelo usuário %s. Sua tarefa é analisar esta lista de alertas e gerar um resumo conciso (máximo de 150 palavras e sem emojis e sem título no texto, apenas o conteudo do resumo sem mencionar que é uma lista, pode começar com 'Foram registrados...').\n\n"
                                                        + "**OBJETIVO DO RESUMO:**\n"
                                                        + "1. Apresentar o número total de alertas na lista.\n"
                                                        + "2. Identificar e citar o período de tempo coberto.\n"
                                                        + "3. Mencionar a frequência (ex: acionamentos diários, semanais, ou concentrados em um dia).\n"
                                                        + "4. Mencionar se há um padrão geográfico visível (ex: sempre no mesmo local ou em locais amplamente dispersos).\n"
                                                        + "5. Mantenha um tom profissional, analítico e objetivo.\n\n"
                                                        + "**DADOS DOS ALERTAS (Total: ):**\n%s",
                                        nomeUsuario, listaAlertasFormatada);

                        // usa o método refatorado
                        return fazerRequisicaoIa(prompt, ROUTER_MODEL, 300);

                } catch (Exception e) {
                        System.out.println("Erro ao gerar resumo com IA (Exceção): " + e.getMessage());

                        // fallback genérico para o resumo
                        return String.format(
                                        "Falha na comunicação com a IA para gerar o resumo de alertas do usuário %s. Por favor, tente novamente mais tarde.",
                                        nomeUsuario);
                }
        }
}