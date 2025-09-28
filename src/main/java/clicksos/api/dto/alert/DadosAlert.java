package clicksos.api.dto.alert;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import clicksos.api.dto.contato.DadosContato;
import clicksos.api.dto.usuario.DadosUsuario;
import clicksos.api.model.Alert;

public record DadosAlert(
        Long id,
        String mensagem,
        BigDecimal latitude,
        BigDecimal longitude,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm") LocalDateTime criadoEm,
        DadosUsuario usuario,
        List<DadosContato> contatos) {
    public DadosAlert(Alert alert) {
        this(alert.getId(), alert.getMensagem(), alert.getLatitude(), alert.getLongitude(), alert.getCriadoEm(),
                new DadosUsuario(alert.getUsuario()),
                alert.getUsuario().getContatos().stream().map(DadosContato::new).toList());
    }
}
