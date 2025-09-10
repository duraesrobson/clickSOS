package clicksos.api.dto.alert;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import clicksos.api.dto.usuario.DadosUsuarioSimples;
import clicksos.api.model.Alert;

public record DadosAlert(
        Long id,
        String mensagem,
        BigDecimal latitude,
        BigDecimal longitude,
        LocalDateTime criadoEm,
        DadosUsuarioSimples usuario) {
    public DadosAlert(Alert alert) {
        this(alert.getId(), alert.getMensagem(), alert.getLatitude(), alert.getLongitude(), alert.getCriadoEm(),
                new DadosUsuarioSimples(alert.getUsuario()));
    }
}
