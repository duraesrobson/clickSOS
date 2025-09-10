package clicksos.api.dto.usuario;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import clicksos.api.model.Contato;
import clicksos.api.model.Usuario;

public record DadosUsuario(
        Long id,
        String nome,
        String usuario,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy") LocalDate dataNascimento,
        String email,
        List<Contato> contatos) {
    public DadosUsuario(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getUsuario(), usuario.getDataNascimento(), usuario.getEmail(),
                usuario.getContatos());
    }
}
