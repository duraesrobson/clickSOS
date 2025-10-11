package clicksos.api.dto.contato;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DadosCriarContato(
                @NotBlank String nome,
                @NotBlank @Email String email,
                @NotBlank @Pattern(regexp = "\\d{11}", message = "Telefone inválido. Deve conter apenas números, ex.: 21975558777") String telefone,
                @NotNull(message = "Ano de Nascimento deve ser preenchido!") @Min(value = 1920, message = "O ano deve ser posterior a 1920") @Max(value = 2025, message = "O ano não pode ser posterior a 2025") Integer anoNascimento) {

}
