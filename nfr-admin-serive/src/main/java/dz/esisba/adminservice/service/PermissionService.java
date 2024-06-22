package dz.esisba.adminservice.service;

import dz.esisba.adminservice.dto.user.UserResponse;
import dz.esisba.adminservice.entity.Authority;
import dz.esisba.adminservice.entity.Module;
import dz.esisba.adminservice.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class PermissionService {
    private final UserService userService;
    private final ModuleService moduleService;
    private final AuthorityService authorityService;
    public Boolean getPermissionForUser(String authorityLibelle, String moduleCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        JwtAuthenticationToken jwtAuthentication = (JwtAuthenticationToken) authentication;
        Jwt jwt = jwtAuthentication.getToken();

        String username = (String) jwt.getClaims().get("preferred_username");
        // get authority by libelle and module name
        Authority authority = authorityService.getAuthorityByLibelleAndModule(authorityLibelle, moduleCode);
        Module module = moduleService.getModuleByCode(moduleCode);
        // get user
        User user=userService.getOneByUsername(username);
        if (user==null){
            return false;// user n existe pas renvoyer false
        }
        //Vérifier si l'utilisateur a l'autorité demandée
        boolean hasAuth=user.getUserAuthorities().stream().anyMatch(auth -> auth.equals(authority));
        //,verifier si user a acces au module specife
        boolean hasModule=user.getRoles().stream()
                .flatMap(role -> role.getAuthoritySet().stream())
                .anyMatch(mod-> mod.equals(module));
        return hasAuth && hasModule;

    }
}
