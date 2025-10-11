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

    @Autowired
    private HuggingFaceService huggingFaceService;

    StringBuilder contatosInfo = new StringBuilder();

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @Transactional
    public Alert criarAlert(DadosCriarAlert dados) {
        Usuario usuario = getUsuarioAutenticado();

        Alert alert = new Alert(dados.latitude(), dados.longitude(), usuario);

        String mapaLink = "https://www.google.com/maps?q=" + alert.getLatitude() + "," + alert.getLongitude();

        alert = alertaRepository.save(alert);

        for (Contato c : usuario.getContatos()) {
            // metodo dentro do for para pegar os nomes de cada contato do usuario
            String mensagemParaContatos = huggingFaceService.gerarMensagemEmergencia(alert.getUsuario().getNome(),
                    alert.getUsuario().getEmail(), c.getNome(),
                    alert.getLatitude().doubleValue(), alert.getLongitude().doubleValue());

            emailService.enviarEmail(c.getEmail(),
                    "Alerta clickSOS - " + alert.getUsuario().getNome() + " acionou o sistema!",
                    mensagemParaContatos);
            // cria o to string com os contatos
            contatosInfo.append(c.getNome()).append(" (").append(c.getEmail()).append(")\n");
        }

        // envia email de confirmacao para o usuario que gerou o alerta
        String mensagemParaUsuario = "Alerta de Emergência - clickSOS acionado!\n\n"
                + "Prezado " + alert.getUsuario().getNome() + ",\n\n"
                + "Recebemos uma notificação de que você acionou o clickSOS, indicando que pode estar em perigo. Estamos preocupados com sua segurança e já disponibilizamos sua localização com coordenadas e o link do Google Maps para que ajuda possa ser enviada até você o mais rápido possível.\nVeja a localização do alerta gerado no link: "
                + mapaLink
                + "\n\nPor favor, se estiver em condições, responda a este e-mail para confirmar sua situação. Se não for seguro fazê-lo, mantenha-se calmo e aguarde o socorro, seus contatos já foram notificados. Sua segurança é nossa prioridade."
                + "\n\nContato(s) notificado(s):\n" + contatosInfo.toString();

        emailService.enviarEmail(usuario.getEmail(), "Alerta clickSOS - Você acionou o sistema!",
                mensagemParaUsuario);

        return alert;
    }

    public Page<DadosAlert> listarAlertsPorUsuario(Pageable pageable) {
        Usuario usuario = getUsuarioAutenticado();
        return alertaRepository.findAllByUsuarioId(usuario.getId(), pageable)
                .map(DadosAlert::new);
    }

}
