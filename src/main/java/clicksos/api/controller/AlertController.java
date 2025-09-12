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

import clicksos.api.dto.alert.DadosAlert;
import clicksos.api.dto.alert.DadosCriarAlert;
import clicksos.api.model.Alert;
import clicksos.api.service.AlertService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/alertas")
@SecurityRequirement(name = "bearer-key")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosAlert> criarAlert(@RequestBody @Valid DadosCriarAlert dados,
            UriComponentsBuilder uriBuilder) {
        Alert alert = alertService.criarAlert(dados);
        var uri = uriBuilder.path("/alertas/{id}").buildAndExpand(alert.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosAlert(alert));
    }

    @GetMapping("/meus-alertas")
    public ResponseEntity<Page<DadosAlert>> listarAlertasPorUsuario(
            @PageableDefault(size = 10) Pageable paginacao) {
        var page = alertService.listarAlertsPorUsuario(paginacao);
        return ResponseEntity.ok(page);
    }

}
