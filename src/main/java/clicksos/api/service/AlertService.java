package clicksos.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clicksos.api.dto.alert.DadosAlert;
import clicksos.api.dto.alert.DadosCriarAlert;
import clicksos.api.exceptions.TratarErros;
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
                .orElseThrow(TratarErros.UsuarioNaoEncontrado::new);

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

    public Page<DadosAlert> listarAlertsPorUsuario(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email);

        return alertaRepository.findAllByUsuarioId(usuario.getId(), pageable)
                .map(DadosAlert::new);
    }

}
