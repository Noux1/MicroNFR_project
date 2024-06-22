package dz.esisba.adminservice.mapper.authority;

import dz.esisba.adminservice.dto.authority.AuthorityRequest;
import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import dz.esisba.adminservice.entity.Authority;
import dz.esisba.adminservice.entity.AuthorityType;
import dz.esisba.adminservice.entity.Module;
import dz.esisba.adminservice.mapper.authorityType.AuthorityTypeMapper;
import dz.esisba.adminservice.mapper.module.ModuleMapper;
import dz.esisba.adminservice.repository.AuthorityTypeRepository;
import dz.esisba.adminservice.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

@Component
@RequiredArgsConstructor
public class AuthorityMapperImp implements AuthorityMapper {

    private final AuthorityTypeRepository authorityTypeRepository;
    private final ModuleMapper moduleMapper;
    private final ModuleRepository moduleRepository;
    private final AuthorityTypeMapper authorityTypeMapper;

    @Override
    @Transactional(readOnly = true)
    public Authority requestToEntity(AuthorityRequest request) {
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new EntityNotFoundException( "Module not found with id :"));
        AuthorityType authorityType=authorityTypeRepository.findById(request.getAuthorityTypeId())
                .orElseThrow(()-> new EntityNotFoundException("Authority Type not found with id: "));
        return Authority.builder()
                .idAuthority(request.getId())
                .actif(request.isActif())
                .libelle(request.getLibelle())
                .authorityType(authorityType)
                .module(module)
                .build();
    }

    @Override
    public AuthorityResponse entityToResponse(Authority entity) {
        return AuthorityResponse.builder()
                .id(entity.getIdAuthority())
                .libelle(entity.getLibelle())
                .actif(entity.isActif())
                .authorityTypeResponse(authorityTypeMapper.entityToResponse(entity.getAuthorityType()))
                .moduleResponse(moduleMapper.entityToResponse(entity.getModule()))
                .build();
    }

}

