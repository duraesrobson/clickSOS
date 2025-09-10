package clicksos.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import clicksos.api.model.Alert;

@Repository
public interface AlertaRepository extends JpaRepository<Alert, Long> {

    Page<Alert> findAllByUsuarioId(Long usuarioId, Pageable paginacao);

}
