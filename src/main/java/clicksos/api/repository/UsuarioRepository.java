package clicksos.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import clicksos.api.model.Usuario;

@Service
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByEmail(String email);

    Page<Usuario> findAllByAtivoTrue(Pageable paginacao);

}
