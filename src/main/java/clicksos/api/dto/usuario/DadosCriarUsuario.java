package clicksos.api.dto.usuario;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import clicksos.api.dto.contato.DadosCriarContato;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

public record DadosCriarUsuario(
        @NotBlank String nome,
        @NotNull @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy") LocalDate dataNascimento,
        @NotBlank String senha,
        @NotBlank String confirmarSenha,
        @NotBlank @Email String email,
        @NotEmpty @Valid List<DadosCriarContato> contatos) {

}
