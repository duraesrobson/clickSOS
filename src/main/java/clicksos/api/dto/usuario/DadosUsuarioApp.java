package clicksos.api.dto.usuario;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import clicksos.api.dto.contato.DadosContato;
import clicksos.api.model.Usuario;

public record DadosUsuarioApp(
        String nome,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy") LocalDate dataNascimento,
        String email,
        List<DadosContato> contatos) {

    public DadosUsuarioApp(Usuario usuario) {
        this(usuario.getNome(), usuario.getDataNascimento(), usuario.getEmail(),
                usuario.getContatos().stream().map(DadosContato::new).toList());
    }

}
