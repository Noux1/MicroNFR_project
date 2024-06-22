package dz.esisba.adminservice.mapper.role;

import dz.esisba.adminservice.dto.role.RoleRequest;
import dz.esisba.adminservice.dto.role.RoleResponse;
import dz.esisba.adminservice.entity.Role;

public interface RoleMapper {
    Role requestToEntity(RoleRequest request);
    RoleResponse entityToResponse(Role entity);
}
