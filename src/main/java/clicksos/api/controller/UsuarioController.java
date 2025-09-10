package clicksos.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import clicksos.api.dto.usuario.DadosCriarUsuario;
import clicksos.api.dto.usuario.DadosUsuario;
import clicksos.api.service.UsuarioService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
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

    @GetMapping
    public ResponseEntity<Page<DadosUsuario>> listarUsuarios(
            @PageableDefault(size = 10, sort = { "nome" }) Pageable paginacao) {
        var page = usuarioService.listarUsuarios(paginacao);
        return ResponseEntity.ok(page);
    }

}
