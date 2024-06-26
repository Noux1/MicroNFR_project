package dz.esisba.adminservice.repository;

import dz.esisba.adminservice.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority,Long> , JpaSpecificationExecutor<Authority> {
    Optional<Authority> findByLibelleAndModule_ModuleCode(String libelle, String moduleCode);

    List<Authority> findByAuthorityType_IdAuthorityType(Long authorityTypeId);

}
