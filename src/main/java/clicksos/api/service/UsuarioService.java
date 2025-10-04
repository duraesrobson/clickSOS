package clicksos.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clicksos.api.dto.contato.DadosCriarContato;
import clicksos.api.dto.usuario.DadosCriarUsuario;
import clicksos.api.dto.usuario.DadosUsuario;
import clicksos.api.dto.usuario.DadosUsuarioApp;
import clicksos.api.exceptions.TratarErros;
import clicksos.api.model.Contato;
import clicksos.api.model.Usuario;
import clicksos.api.repository.ContatoRepository;
import clicksos.api.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class UsuarioService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ContatoRepository contatoRepository;

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @Transactional
    public Usuario criaUsuario(DadosCriarUsuario dados) {
        String senhaCriptografada = passwordEncoder.encode(dados.senha());

        if (usuarioRepository.findByEmail(dados.email()) != null) {
            throw new TratarErros.EmailJaCadastrado();
        }

        if (!dados.senha().equals(dados.confirmarSenha())) {
            throw new TratarErros.SenhasNaoConferem();
        }

        Usuario usuario = new Usuario(dados.nome(), dados.dataNascimento(), dados.email(),
                senhaCriptografada);

        for (DadosCriarContato c : dados.contatos()) {
            Contato contato = new Contato(c.nome(), c.email(), c.telefone(), usuario);
            usuario.getContatos().add(contato);
        }

        return usuarioRepository.save(usuario);
    }

    public DadosUsuarioApp listarUsuarioDadosApp(Long id) {
        return usuarioRepository.findById(id)
                .map(DadosUsuarioApp::new)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));
    }

    public Page<DadosUsuario> listarUsuarios(Pageable paginacao) {
        return usuarioRepository.findAllByAtivoTrue(paginacao).map(DadosUsuario::new);
    }

    @Transactional
    public Contato adicionarContato(DadosCriarContato dados) {
        Usuario usuario = getUsuarioAutenticado();

        boolean contatoExiste = usuario.getContatos().stream()
                .anyMatch(c -> c.getEmail().equalsIgnoreCase(dados.email()));

        if (contatoExiste) {
            throw new TratarErros.EmailJaCadastrado();
        }

        Contato contato = new Contato(dados.nome(), dados.email(), dados.telefone(), usuario);
        usuario.getContatos().add(contato);
        contato = contatoRepository.save(contato);
        usuarioRepository.save(usuario);

        return contato;
    }

    @Transactional
    public Usuario apagarContato(Long idContato) {
        Usuario usuario = getUsuarioAutenticado();
        Contato contato = contatoRepository.findById(idContato)
                .orElseThrow(() -> new EntityNotFoundException("Contato não existe!"));

        usuario.getContatos().remove(contato);
        contatoRepository.delete(contato);
        return usuarioRepository.save(usuario);
    }
}
