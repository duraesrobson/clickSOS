package clicksos.api.exceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TratarErros.EmailJaCadastrado.class)
    public ResponseEntity<?> handleEmailJaCadastrado(TratarErros.EmailJaCadastrado ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErroResponse(ex.getMessage()));
    }

    // Tratamento para campos inválidos / ausentes
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarErrosValidacao(MethodArgumentNotValidException ex) {
        Map<String, Object> erro = new HashMap<>();
        erro.put("timestamp", LocalDateTime.now());
        erro.put("status", HttpStatus.BAD_REQUEST.value());

        Map<String, String> campos = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            campos.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        erro.put("erros", campos);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    @ExceptionHandler(TratarErros.SenhasNaoConferem.class)
    public ResponseEntity<?> handleSenhasNaoConferem(TratarErros.SenhasNaoConferem ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErroResponse(ex.getMessage()));
    }

    // DTO para retorno
    record ErroResponse(String mensagem) {
    }
}
