package clicksos.api.dto.contato;

import clicksos.api.model.Contato;

public record DadosContato(
        Long id,
        String nome,
        String email,
        String telefone) {
    public DadosContato(Contato contato) {
        this(contato.getId(), contato.getNome(), contato.getEmail(), contato.getTelefone());
    }
}
