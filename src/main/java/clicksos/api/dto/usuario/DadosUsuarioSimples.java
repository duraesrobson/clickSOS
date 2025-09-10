package clicksos.api.dto.usuario;

import clicksos.api.model.Usuario;

public record DadosUsuarioSimples(
        Long id,
        String nome,
        String usuario,
        String email) {
    public DadosUsuarioSimples(Usuario dados) {
        this(dados.getId(), dados.getNome(), dados.getUsuario(), dados.getEmail());
    }
}
