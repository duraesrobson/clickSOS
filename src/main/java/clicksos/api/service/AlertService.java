package clicksos.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clicksos.api.dto.alert.DadosCriarAlert;
import clicksos.api.model.Alert;
import clicksos.api.model.Contato;
import clicksos.api.model.Usuario;
import clicksos.api.repository.AlertaRepository;
import clicksos.api.repository.UsuarioRepository;

@Service
public class AlertService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Alert criarAlert(DadosCriarAlert dados) {
        Usuario usuario = usuarioRepository.findById(dados.idUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado!"));

        Alert alert = new Alert(dados.latitude(), dados.longitude(), usuario);

        alert = alertaRepository.save(alert);
        String mapaLink = "https://www.google.com/maps?q=" + alert.getLatitude() + "," + alert.getLongitude();

        // Enviar e-mail para os contatos
        String mensagem = "Alerta recebido!\nLatitude: " + dados.latitude() +
                "\nLongitude: " + dados.longitude() +
                "\n\n" + alert.getMensagem() +
                "\nMeu nome é " + alert.getUsuario().getNome() + "." +
                "\nEssa é minha localização: " + mapaLink;

        for (Contato c : usuario.getContatos()) {
            emailService.enviarEmail(c.getEmail(), "Novo alerta de " + alert.getUsuario().getNome() + "!", mensagem);
        }

        return alert;
    }
}
