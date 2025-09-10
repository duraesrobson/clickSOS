package clicksos.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clicksos.api.dto.contato.DadosCriarContato;
import clicksos.api.dto.usuario.DadosCriarUsuario;
import clicksos.api.exceptions.TratarErros;
import clicksos.api.model.Contato;
import clicksos.api.model.Usuario;
import clicksos.api.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Usuario criaUsuario(DadosCriarUsuario dados) {
        String senhaCriptografada = passwordEncoder.encode(dados.senha());

        if (usuarioRepository.findByEmail(dados.email()) != null) {
            throw new TratarErros.EmailJaCadastrado();
        }

        Usuario usuario = new Usuario(dados.nome(), dados.dataNascimento(), dados.usuario(), dados.email(),
                senhaCriptografada);

        for (DadosCriarContato c : dados.contatos()) {
            Contato contato = new Contato(c.nome(), c.email(), c.telefone(), usuario);
            usuario.getContatos().add(contato);
        }

        return usuarioRepository.save(usuario);
    }

}
