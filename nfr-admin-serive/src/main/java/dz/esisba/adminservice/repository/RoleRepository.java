package dz.esisba.adminservice.repository;

import dz.esisba.adminservice.entity.Authority;
import dz.esisba.adminservice.entity.Role;
import dz.esisba.adminservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface RoleRepository extends JpaRepository<Role,Long>, JpaSpecificationExecutor<Role> {

}
