package dz.esisba.adminservice.mapper.authority;

import dz.esisba.adminservice.dto.authority.AuthorityRequest;
import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import dz.esisba.adminservice.entity.Authority;
import org.springframework.stereotype.Component;

@Component
public interface AuthorityMapper {
     Authority requestToEntity(AuthorityRequest request);
     AuthorityResponse entityToResponse(Authority entity);
}
