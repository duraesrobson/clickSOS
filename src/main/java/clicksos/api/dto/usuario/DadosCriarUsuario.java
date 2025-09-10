package clicksos.api.dto.usuario;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCriarUsuario(
                @NotBlank String nome,
                @NotNull @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy") LocalDate dataNascimento,
                @NotBlank String usuario,
                @NotBlank String senha,
                @NotBlank @Email String email) {

}
