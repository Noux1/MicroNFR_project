package dz.esisba.adminservice.service;

import dz.esisba.adminservice.dto.group.GroupRequest;
import dz.esisba.adminservice.dto.group.GroupResponse;
import dz.esisba.adminservice.entity.Group;
import dz.esisba.adminservice.mapper.group.GroupMapper;
import dz.esisba.adminservice.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;

    @Autowired
    public GroupService(GroupRepository groupRepository, GroupMapper groupMapper) {
        this.groupRepository = groupRepository;
        this.groupMapper = groupMapper;
    }
    public List<GroupResponse> getAll(){
        List<Group> allGroups = groupRepository.findAll();
        return allGroups.stream()
                .map(groupMapper::entityToResponse)
                .collect(Collectors.toList());
    }

    public GroupResponse createGroup(GroupRequest request) {
        Group newGroup = groupMapper.requestToEntity(request);
        Group savedGroup = groupRepository.save(newGroup);
        return groupMapper.entityToResponse(savedGroup);
    }

    public GroupResponse getGroupById(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Group not found with id: " + id));
        return groupMapper.entityToResponse(group);
    }
    public GroupResponse getGroupByLibelle(String libelle){
        Group groupWithLibelle = groupRepository.findByLibelle(libelle)
                .orElseThrow(() -> new NoSuchElementException("Group not found with libelle: " + libelle));
        return groupMapper.entityToResponse(groupWithLibelle);

    }

    public GroupResponse updateGroup(GroupRequest request, Long id) {
        Group existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Group not found with id: " + id));
        existingGroup.setLibelle(request.getLibelle());
        existingGroup.setActif(request.getActif());
        Group updatedGroup = groupRepository.save(existingGroup);
        return groupMapper.entityToResponse(updatedGroup);
    }

    public void deleteGroup(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Group not found with id: " + id));
        groupRepository.delete(group);
    }

}
