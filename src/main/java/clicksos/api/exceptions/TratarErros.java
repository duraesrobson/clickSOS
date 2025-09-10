package clicksos.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class TratarErros {

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Email já cadastrado")
    public static class EmailJaCadastrado extends RuntimeException {
        public EmailJaCadastrado() {
            super("Email já cadastrado");
        }
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Senhas não conferem")
    public static class SenhasNaoConferem extends RuntimeException {
        public SenhasNaoConferem() {
            super("Senhas não conferem");
        }
    }

}
