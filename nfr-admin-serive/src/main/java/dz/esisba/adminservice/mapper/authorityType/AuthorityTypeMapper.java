package dz.esisba.adminservice.mapper.authorityType;
import dz.esisba.adminservice.dto.authorityType.AuthorityTypeRequest;
import dz.esisba.adminservice.dto.authorityType.AuthorityTypeResponse;
import dz.esisba.adminservice.entity.AuthorityType;

public interface AuthorityTypeMapper {
    AuthorityType requestToEntity(AuthorityTypeRequest request);
    AuthorityTypeResponse entityToResponse(AuthorityType entity);
}
