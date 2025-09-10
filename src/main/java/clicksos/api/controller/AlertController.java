package clicksos.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import clicksos.api.dto.alert.DadosAlert;
import clicksos.api.dto.alert.DadosCriarAlert;
import clicksos.api.model.Alert;
import clicksos.api.service.AlertService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/alertas")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @PostMapping
    @Transactional
    public ResponseEntity criarAlert(@RequestBody @Valid DadosCriarAlert dados, UriComponentsBuilder uriBuilder) {
        Alert alert = alertService.criarAlert(dados);
        var uri = uriBuilder.path("/alertas/{id}").buildAndExpand(alert.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosAlert(alert));
    }

}
