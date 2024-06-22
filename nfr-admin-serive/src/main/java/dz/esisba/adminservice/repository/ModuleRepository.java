package dz.esisba.adminservice.repository;

import dz.esisba.adminservice.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface ModuleRepository extends JpaRepository<Module,Long>, JpaSpecificationExecutor<Module> {
    Optional<Module> findByModuleCode(String moduleCode);
    Optional<Module> findByModuleName(String moduleName);


}
