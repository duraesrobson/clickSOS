package clicksos.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import clicksos.api.model.Alert;

@Service
public interface AlertaRepository extends JpaRepository<Alert, Long> {

}
