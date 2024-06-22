package dz.esisba.adminservice.config.Security;

import dz.esisba.adminservice.entity.User;
import dz.esisba.adminservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.support.CustomSQLErrorCodesTranslation;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationConverterCode extends JwtAuthenticationConverter {

    private final UserService userService;

    @Override

    protected Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        Collection<GrantedAuthority> authoritiesFromJwt = jwtGrantedAuthoritiesConverter.convert(jwt);

        // Log authorities from JWT
//        System.out.println("Authorities from JWT:");
//        authoritiesFromJwt.forEach(authority -> System.out.println(authority.getAuthority()));

        // Load authorities from the user
        String username = jwt.getClaimAsString("preferred_username");
        User user = userService.getOneByUsername(username);
        Set<GrantedAuthority> authoritiesFromDB = new HashSet<>();
        if (user != null && user.getUserAuthorities() != null ) {
            authoritiesFromDB = user.getUserAuthorities().stream()
                    .filter(userAuthority -> userAuthority.getAuthority() != null
                            && userAuthority.getAuthority().getModule() != null
                            && "admin-module".equals(userAuthority.getAuthority().getModule().getModuleCode())
                            && userAuthority.isGranted()
                            && userAuthority.getAuthority().getModule().isActif())
                    .map(userAuthority -> new SimpleGrantedAuthority(userAuthority.getAuthority().getLibelle()))
                    .collect(Collectors.toSet());
        }

        // Log authorities from database
//        System.out.println("Authorities from database:");
//        authoritiesFromDB.forEach(authority -> System.out.println(authority.getAuthority()));

        // Load authorities from the user roles
        Set<GrantedAuthority> roleAuthorities = new HashSet<>();

        if (user != null && user.getRoles() != null && user.getModules() != null ) {
            user.getRoles().forEach(role -> {
                if (role.getModule() != null && "admin-module".equals(role.getModule().getModuleCode())
                        && role.isActif() && role.getModule().isActif()) {
                    role.getAuthoritySet().forEach(authority -> {
                        roleAuthorities.add(new SimpleGrantedAuthority(authority.getLibelle()));
                    });
                }
            });
        }

        // Log authorities from roles
//        System.out.println("Authorities from roles:");
        roleAuthorities.forEach(authority -> System.out.println(authority.getAuthority()));

        // Combine authorities
        Set<GrantedAuthority> combinedAuthorities = new HashSet<>();
        combinedAuthorities.addAll(authoritiesFromJwt);
        combinedAuthorities.addAll(authoritiesFromDB);
        combinedAuthorities.addAll(roleAuthorities);

//        System.out.println("Combined authorities:");
        combinedAuthorities.forEach(authority -> System.out.println(authority.getAuthority()));

        return combinedAuthorities;
    }

}