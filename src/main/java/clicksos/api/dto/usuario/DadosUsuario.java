package clicksos.api.dto.usuario;

import java.time.LocalDate;

import clicksos.api.model.Usuario;

public record DadosUsuario(
        Long id,
        String nome,
        LocalDate dataNascimento,
        String email) {
    public DadosUsuario(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getDataNascimento(), usuario.getEmail());
    }
}
