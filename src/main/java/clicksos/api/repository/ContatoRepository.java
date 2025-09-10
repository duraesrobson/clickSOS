package clicksos.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import clicksos.api.model.Contato;

@Service
public interface ContatoRepository extends JpaRepository<Contato, Long> {

}
