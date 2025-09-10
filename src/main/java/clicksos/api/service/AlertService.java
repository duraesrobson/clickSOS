package clicksos.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clicksos.api.dto.alert.DadosCriarAlert;
import clicksos.api.model.Alert;
import clicksos.api.model.Usuario;
import clicksos.api.repository.AlertaRepository;
import clicksos.api.repository.UsuarioRepository;

@Service
public class AlertService {

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Alert criarAlert(DadosCriarAlert dados) {
        Usuario usuario = usuarioRepository.findById(dados.idUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado!"));

        Alert alert = new Alert(dados.latitude(), dados.longitude(), usuario);

        return alertaRepository.save(alert);
    }
}
