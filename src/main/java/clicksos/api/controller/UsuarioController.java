package clicksos.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import clicksos.api.config.UsuarioSecurity;
import clicksos.api.dto.contato.DadosCriarContato;
import clicksos.api.dto.usuario.DadosCriarUsuario;
import clicksos.api.dto.usuario.DadosUsuario;
import clicksos.api.dto.usuario.DadosUsuarioApp;
import clicksos.api.model.Usuario;
import clicksos.api.service.UsuarioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
@SecurityRequirement(name = "bearer-key")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosUsuario> criarUsuario(@RequestBody @Valid DadosCriarUsuario dados,
            UriComponentsBuilder uriBuilder) {
        var usuario = usuarioService.criaUsuario(dados);
        var uri = uriBuilder.path("/usuarios/{id}").buildAndExpand(usuario.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosUsuario(usuario));
    }

    // pega o usuario logado e retorna os dados em DadosUsuarioApp format
    @GetMapping("/me")
    @Transactional
    public ResponseEntity<DadosUsuarioApp> listarUsuarioDadosApp(
            @AuthenticationPrincipal UsuarioSecurity usuarioLogado) {
        DadosUsuarioApp dados = usuarioService.listarUsuarioDadosApp(usuarioLogado.getUsuario().getId());
        return ResponseEntity.ok(dados);
    }

    @GetMapping
    public ResponseEntity<Page<DadosUsuario>> listarUsuarios(
            @PageableDefault(size = 10, sort = { "nome" }) Pageable paginacao) {
        var page = usuarioService.listarUsuarios(paginacao);
        return ResponseEntity.ok(page);
    }

    // adicionar um novo contato
    @PostMapping("/me/contatos")
    public ResponseEntity<DadosUsuarioApp> adicionarContato(@RequestBody DadosCriarContato dados) {
        Usuario usuario = usuarioService.adicionarContato(dados);
        return ResponseEntity.ok(new DadosUsuarioApp(usuario));
    }

    @DeleteMapping("/me/contatos/{idContato}")
    public ResponseEntity<DadosUsuarioApp> apagarContato(@PathVariable Long idContato) {
        Usuario usuarioAtualizado = usuarioService.apagarContato(idContato);
        return ResponseEntity.ok(new DadosUsuarioApp(usuarioAtualizado));
    }

}
