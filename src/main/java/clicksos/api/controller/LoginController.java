package clicksos.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import clicksos.api.config.DadosTokenJWT;
import clicksos.api.config.TokenService;
import clicksos.api.config.UsuarioSecurity;
import clicksos.api.dto.usuario.DadosAutenticacaoUsuario;
import clicksos.api.model.Usuario;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @SuppressWarnings("rawtypes")
    @PostMapping
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacaoUsuario dados) {
        var authToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(authToken);

        UsuarioSecurity usuarioSecurity = (UsuarioSecurity) authentication.getPrincipal();
        Usuario usuario = usuarioSecurity.getUsuario();

        var tokenJWT = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

}
