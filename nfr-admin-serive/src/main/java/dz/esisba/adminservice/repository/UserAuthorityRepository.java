package dz.esisba.adminservice.repository;

import dz.esisba.adminservice.entity.UserAuthority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAuthorityRepository extends JpaRepository<UserAuthority, Long>, JpaSpecificationExecutor<UserAuthority> {
    Optional<UserAuthority> findUserAuthorityByUser_IdUserAndAuthority_IdAuthority(Long UserId , Long authorityId);

    Optional<UserAuthority> findByUserAndAuthority(Long userId, Long authorityId);


}
