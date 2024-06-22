package dz.esisba.adminservice.mapper.authorityType;

import dz.esisba.adminservice.dto.authorityType.AuthorityTypeRequest;
import dz.esisba.adminservice.dto.authorityType.AuthorityTypeResponse;
import dz.esisba.adminservice.entity.AuthorityType;
import org.springframework.stereotype.Component;

@Component
public class AuthorityTypeMapperImp implements AuthorityTypeMapper{

    @Override
    public AuthorityType requestToEntity(AuthorityTypeRequest request) {
        return AuthorityType.builder()
                .idAuthorityType(request.getId())
                .libelle(request.getLibelle())
                .actif(request.isActif())
                .build();
    }

    @Override
    public AuthorityTypeResponse entityToResponse(AuthorityType entity) {
        return AuthorityTypeResponse.builder()
                .id(entity.getIdAuthorityType())
                .Libelle(entity.getLibelle())
                .actif(entity.isActif())

                .build();
    }
}
