package clicksos.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clicksos.api.dto.alert.DadosAlert;
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

    StringBuilder contatosInfo = new StringBuilder();

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @Transactional
    public Alert criarAlert(DadosCriarAlert dados) {
        Usuario usuario = getUsuarioAutenticado();

        Alert alert = new Alert(dados.latitude(), dados.longitude(), usuario);

        alert = alertaRepository.save(alert);
        String mapaLink = "https://www.google.com/maps?q=" + alert.getLatitude() + "," + alert.getLongitude();

        // envia email para os contatos do usuario
        String mensagemParaContatos = "Alerta recebido!\nLatitude: " + dados.latitude() +
                "\nLongitude: " + dados.longitude() +
                "\n\n" + alert.getMensagem() +
                "\nMeu nome é " + alert.getUsuario().getNome() + "." +
                "\nMeu e-mail é " + alert.getUsuario().getEmail() + "." +
                "\n\nEssa é a minha localização: " + mapaLink;

        for (Contato c : usuario.getContatos()) {
            emailService.enviarEmail(c.getEmail(), "Novo alerta de " + alert.getUsuario().getNome() + "!",
                    mensagemParaContatos);
            // cria o to string com os contatos
            contatosInfo.append(c.getNome()).append(" (").append(c.getEmail()).append(")\n");
        }

        // envia email de confirmacao para o usuario
        String mensagemParaUsuario = "Alerta enviado!\n\nLatitude: " + dados.latitude() +
                "\nLongitude: " + dados.longitude() +
                "\nLocalização: " + mapaLink +
                "\n\nContato(s) notificado(s):\n" + contatosInfo.toString();

        emailService.enviarEmail(usuario.getEmail(), "Alerta gerado!", mensagemParaUsuario);

        return alert;
    }

    public Page<DadosAlert> listarAlertsPorUsuario(Pageable pageable) {
        Usuario usuario = getUsuarioAutenticado();
        return alertaRepository.findAllByUsuarioId(usuario.getId(), pageable)
                .map(DadosAlert::new);
    }

}
