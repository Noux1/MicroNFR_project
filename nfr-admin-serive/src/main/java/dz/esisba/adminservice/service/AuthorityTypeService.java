package dz.esisba.adminservice.service;

import dz.esisba.adminservice.dto.authorityType.AuthorityTypeResponse;
import dz.esisba.adminservice.dto.authorityType.AuthorityTypeRequest;

import dz.esisba.adminservice.entity.AuthorityType;
import dz.esisba.adminservice.mapper.authorityType.AuthorityTypeMapper;
import dz.esisba.adminservice.repository.AuthorityTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthorityTypeService {
    private final AuthorityTypeRepository authorityTypeRepository ;
    private final AuthorityTypeMapper authorityTypeMapper;
    private final AuthorityService authorityService;

    public AuthorityTypeResponse getOne(Long idAuthorityType  ){
        AuthorityType authorityType=authorityTypeRepository.findById(idAuthorityType)
                .orElseThrow(() -> new EntityNotFoundException("Authority not found with id: " + idAuthorityType));
    return authorityTypeMapper.entityToResponse(authorityType);
    }
    public List<AuthorityTypeResponse> getAll(){
        List<AuthorityType> authorityTypes=authorityTypeRepository.findAll();
        return authorityTypes.stream()
                .map(authorityTypeMapper::entityToResponse)
                .collect(Collectors.toList());
    }

    public AuthorityTypeResponse create(AuthorityTypeRequest authorityTypeRequest){
        AuthorityType created=authorityTypeRepository.save(authorityTypeMapper.requestToEntity(authorityTypeRequest));
        return authorityTypeMapper.entityToResponse(created);

    }
    public AuthorityTypeResponse update(AuthorityTypeRequest authorityTypeRequest, Long idAuthorityType){
        AuthorityType entity=authorityTypeRepository.findById(idAuthorityType)
                .orElseThrow(()-> new EntityNotFoundException("Authority not found with id: "+idAuthorityType));
        entity.setLibelle(authorityTypeRequest.getLibelle());
        entity.setActif(authorityTypeRequest.isActif());

        if(!authorityTypeRequest.isActif()){
            authorityService.deactivateAuthoritiesByAuthorityType(idAuthorityType);
        }
        if(authorityTypeRequest.isActif()){
            authorityService.activateAuthoritiesByAuthorityType(idAuthorityType);
        }
        AuthorityType updated=authorityTypeRepository.save(entity);
        return authorityTypeMapper.entityToResponse(updated);
    }

    public  void delete(Long idAuthorityType){
        AuthorityType entity=authorityTypeRepository.findById(idAuthorityType)
                .orElseThrow(()-> new EntityNotFoundException("Authority not found with id: "+idAuthorityType));
        authorityTypeRepository.delete(entity);
    }
}
