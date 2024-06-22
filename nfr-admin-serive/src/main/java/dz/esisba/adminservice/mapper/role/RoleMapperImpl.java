package dz.esisba.adminservice.mapper.role;

import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import dz.esisba.adminservice.dto.role.RoleRequest;
import dz.esisba.adminservice.dto.role.RoleResponse;
import dz.esisba.adminservice.entity.Module;
import dz.esisba.adminservice.entity.Role;
import dz.esisba.adminservice.mapper.authority.AuthorityMapper;
import dz.esisba.adminservice.mapper.module.ModuleMapper;
import dz.esisba.adminservice.repository.AuthorityRepository;
import dz.esisba.adminservice.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Component;

import javax.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
@Component
public class RoleMapperImpl implements RoleMapper{

    private final ModuleRepository moduleRepository;

    private final ModuleMapper moduleMapper;

    private final AuthorityMapper authorityMapper;



    @Override
    public Role requestToEntity(RoleRequest request) {
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new EntityNotFoundException( "Module not found with id: "));
        return Role.builder()
                .idRole(request.getId())
                .module(module)
                .libelle(request.getLibelle())
                .actif(request.getActif())
                .build();
    }

    @Override
    public RoleResponse entityToResponse(Role entity) {
        Set<AuthorityResponse> authorityResponses = new HashSet<>();
        if (entity.getAuthoritySet() != null) {
            entity.getAuthoritySet().forEach(authority -> {
                AuthorityResponse authorityResponse = authorityMapper.entityToResponse(authority);
                authorityResponses.add(authorityResponse);
            });
        }
        return RoleResponse.builder()
                .id(entity.getIdRole())
                .libelle(entity.getLibelle())
                .moduleResponse(moduleMapper.entityToResponse(entity.getModule()))
                .authorityResponses(authorityResponses)
                .actif(entity.isActif())
                .build();
    }
}