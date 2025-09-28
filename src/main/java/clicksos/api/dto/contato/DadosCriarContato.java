package clicksos.api.dto.contato;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record DadosCriarContato(
                @NotBlank String nome,
                @NotBlank @Email String email,
                @NotBlank @Pattern(regexp = "\\d{10,11}", message = "Telefone inválido. Deve conter apenas números, ex.: 21973875245") String telefone) {

}
