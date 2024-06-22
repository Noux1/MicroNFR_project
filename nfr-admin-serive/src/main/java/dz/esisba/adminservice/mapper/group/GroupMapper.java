package dz.esisba.adminservice.mapper.group;

import dz.esisba.adminservice.dto.group.GroupRequest;
import dz.esisba.adminservice.dto.group.GroupResponse;
import dz.esisba.adminservice.entity.Group;
import org.springframework.stereotype.Component;

@Component
public class GroupMapper {
    public Group requestToEntity(GroupRequest request) {
        return Group.builder()
                .idGroup(request.getId())
                .libelle(request.getLibelle())
                .actif(request.getActif())
                .build();
    }

    public GroupResponse entityToResponse(Group group) {
        GroupResponse groupResponse = new GroupResponse();
        groupResponse.setId(group.getIdGroup());
        groupResponse.setLibelle(group.getLibelle());
        groupResponse.setActif(group.isActif());

        return groupResponse;
    }
}
