package dz.esisba.adminservice.service;

import dz.esisba.adminservice.dto.authority.AuthorityRequest;
import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import dz.esisba.adminservice.dto.role.RoleResponse;
import dz.esisba.adminservice.entity.Authority;
import dz.esisba.adminservice.entity.AuthorityType;
import dz.esisba.adminservice.entity.Module;
import dz.esisba.adminservice.entity.Role;
import dz.esisba.adminservice.mapper.authority.AuthorityMapper;
import dz.esisba.adminservice.repository.AuthorityRepository;
import dz.esisba.adminservice.repository.AuthorityTypeRepository;
import dz.esisba.adminservice.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityRepository authorityRepository;

    private final ModuleRepository moduleRepository;

    private final AuthorityTypeRepository authorityTypeRepository;

    private final AuthorityMapper authorityMapper;

    public AuthorityResponse getOne(Long id) {
        Authority module = authorityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Authority not found with id: " + id));
        return authorityMapper.entityToResponse(module);
    }

    public List<AuthorityResponse> getAll(){
        List<Authority> authorities=authorityRepository.findAll();
        return authorities.stream()
                .map(authorityMapper::entityToResponse)
                .collect(Collectors.toList());
    }

    public AuthorityResponse create(AuthorityRequest request) {
        Authority created = authorityRepository.save(authorityMapper.requestToEntity(request));
        return authorityMapper.entityToResponse(created);
    }

    public AuthorityResponse update(AuthorityRequest request, Long id) {
        Authority entity = authorityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException( "Authority not found with id: "));
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new EntityNotFoundException("module not found with id: "));
        AuthorityType authorityType = authorityTypeRepository.findById(request.getAuthorityTypeId())
                .orElseThrow(() -> new EntityNotFoundException( "Authority Type not found with id: "));
        entity.setModule(module);
        entity.setAuthorityType(authorityType);
        entity.setLibelle(request.getLibelle());
        entity.setActif(request.isActif());

        return authorityMapper.entityToResponse(entity);
    }

    public void delete(Long id) {
        Authority entity = authorityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Authority not found with id: "));
        authorityRepository.delete(entity);
    }

    public Authority getAuthorityByLibelleAndModule(String libelle, String moduleCode) {
        return authorityRepository.findByLibelleAndModule_ModuleCode(libelle, moduleCode)
                .orElseThrow(() -> new EntityNotFoundException("Authority not found with name: " + libelle + " in module: " + moduleCode));
    }

    public void deactivateAuthoritiesByAuthorityType(Long authorityTypeId) {
        List<Authority> authorities = authorityRepository.findByAuthorityType_IdAuthorityType(authorityTypeId);
        authorities.forEach(authority -> authority.setActif(false));
        authorityRepository.saveAll(authorities);
    }

    public void activateAuthoritiesByAuthorityType(Long authorityTypeId){
        List<Authority> authorities = authorityRepository.findByAuthorityType_IdAuthorityType(authorityTypeId);
        authorities.forEach(authority -> authority.setActif(true));
        authorityRepository.saveAll(authorities);
    }

}
