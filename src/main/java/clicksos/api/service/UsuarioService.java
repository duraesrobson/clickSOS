package clicksos.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clicksos.api.dto.usuario.DadosCriarUsuario;
import clicksos.api.model.Usuario;
import clicksos.api.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Usuario criaUsuario(DadosCriarUsuario dados) {
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Usuario usuario = new Usuario(dados.nome(), dados.usuario(), dados.email(), senhaCriptografada);

        return usuarioRepository.save(usuario);
    }

}
