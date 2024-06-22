package dz.esisba.adminservice.mapper.module;

import dz.esisba.adminservice.dto.module.ModuleRequest;
import dz.esisba.adminservice.dto.module.ModuleResponse;

import dz.esisba.adminservice.entity.Module;
import org.springframework.stereotype.Component;

@Component

public class ModuleMapper {
    public Module requestToEntity(ModuleRequest request) {
        return Module.builder()
                .idModule(request.getId())
                .moduleName(request.getModuleName())
                .moduleCode(request.getModuleCode())
                .color(request.getColor())
                .icon(request.getIcon())
                .uri(request.getUri())
                .actif(request.getActif())
                .build();
    }

    public ModuleResponse entityToResponse(Module entity) {
        return ModuleResponse.builder()
                .id(entity.getIdModule())
                .moduleCode(entity.getModuleCode())
                .moduleName(entity.getModuleName())
                .icon(entity.getIcon())
                .color(entity.getColor())
                .uri(entity.getUri())
                .actif(entity.isActif())
                .build();
    }
}
