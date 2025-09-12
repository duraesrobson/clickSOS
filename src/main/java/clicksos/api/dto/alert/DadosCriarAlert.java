package clicksos.api.dto.alert;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;

public record DadosCriarAlert(
        @NotNull BigDecimal latitude,
        @NotNull BigDecimal longitude) {

}
