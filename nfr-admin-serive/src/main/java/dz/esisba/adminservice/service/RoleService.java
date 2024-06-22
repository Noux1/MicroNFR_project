package dz.esisba.adminservice.service;

import dz.esisba.adminservice.config.Exception.NotMatchException;
import dz.esisba.adminservice.dto.role.RoleRequest;
import dz.esisba.adminservice.dto.role.RoleResponse;
import dz.esisba.adminservice.entity.Authority;
import dz.esisba.adminservice.entity.Module;
import dz.esisba.adminservice.entity.Role;
import dz.esisba.adminservice.mapper.role.RoleMapper;
import dz.esisba.adminservice.repository.AuthorityRepository;
import dz.esisba.adminservice.repository.ModuleRepository;
import dz.esisba.adminservice.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Transactional
@Service
@RequiredArgsConstructor

public class RoleService {

    private final RoleRepository roleRepository;

    private final ModuleRepository moduleRepository;

    private final AuthorityRepository authorityRepository;

    private final RoleMapper roleMapper;


//    public PageImpl<RoleResponse> findAllFilterByModule(PageRequest pageRequest, List<Clause> filter) {
//
//        Specification<Role> specification = new GenericSpecification<>(filter);
//        List<RoleResponse> roleResponseList;
//        Page<Role> page;
//        page = roleRepository.findAll(specification, pageRequest);
//
//        roleResponseList = page.getContent().stream()
//                .map(roleMapper::entityToResponse)
//                .collect(Collectors.toList());
//        return new PageImpl<>(roleResponseList, pageRequest, page.getTotalElements());
//    }


    public List<RoleResponse> getAll(){
        List<Role> roles=roleRepository.findAll();
                 return roles.stream()
                .map(roleMapper::entityToResponse)
                .collect(Collectors.toList());
    }
    public RoleResponse getOne(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: "));
        return roleMapper.entityToResponse(role);
    }

    public RoleResponse create(RoleRequest request) {
        Role created = roleRepository.save(roleMapper.requestToEntity(request));
        return roleMapper.entityToResponse(created);
    }

    public RoleResponse update(RoleRequest request, Long id) {
        Role entity = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException( "Role not found with id: "));
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new EntityNotFoundException( "Module not found with id: "));
        entity.setModule(module);
        entity.setLibelle(request.getLibelle());
        entity.setActif(request.getActif());


        return roleMapper.entityToResponse(entity);
    }

    public void delete(Long id) {
        Role entity = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException( "Role not found with id: "));
        roleRepository.delete(entity);
    }

    public RoleResponse addAuthorityToRole(Long roleId, Long authorityId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException( "Role not found with id: "));
        Authority authority = authorityRepository.findById(authorityId)
                .orElseThrow(() -> new EntityNotFoundException("Authority not found with id: "));
        if (role.getModule() != authority.getModule()) {
            throw new NotMatchException(role.getModule().getModuleName(),
                    role.getModule().getIdModule(),
                    authority.getModule().getModuleName(),
                    authority.getModule().getIdModule());
        }
        role.addAuthority(authority);
        return roleMapper.entityToResponse(role);
    }

    public RoleResponse removeAuthorityFromRole(Long roleId, Long authorityId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: "));
        Authority authority = authorityRepository.findById(authorityId)
                .orElseThrow(() -> new EntityNotFoundException( "Authority not found with id: "));
        if (!role.getAuthoritySet().contains(authority)) {
            throw new EntityNotFoundException("Authority not found with id: " + authorityId + "in role with id: " + roleId);
        }
        role.removeAuthority(authority);
        return roleMapper.entityToResponse(role);
    }

}
