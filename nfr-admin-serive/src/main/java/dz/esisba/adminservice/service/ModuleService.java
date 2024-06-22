package dz.esisba.adminservice.service;

import dz.esisba.adminservice.dto.module.ModuleRequest;
import dz.esisba.adminservice.dto.module.ModuleResponse;
import dz.esisba.adminservice.entity.Module;
import dz.esisba.adminservice.mapper.module.ModuleMapper;
import dz.esisba.adminservice.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import javax.ws.rs.NotFoundException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final ModuleMapper moduleMapper;

    @Autowired
    public ModuleService(ModuleRepository moduleRepository, ModuleMapper moduleMapper) {
        this.moduleRepository = moduleRepository;
        this.moduleMapper = moduleMapper;
    }

    public List<ModuleResponse> getAll(){
        List<Module> allModules = moduleRepository.findAll();
        return allModules.stream()
                .map(moduleMapper::entityToResponse)
                .collect(Collectors.toList());
    }
    public ModuleResponse createModule(ModuleRequest request) {
        Module newModule = moduleMapper.requestToEntity(request);
        Module savedModule = moduleRepository.save(newModule);
        return moduleMapper.entityToResponse(savedModule);
    }

    public ModuleResponse getModuleById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Module not found with id: " + id));
        return moduleMapper.entityToResponse(module);

    }
    public Module getModuleByCode(String code) {
        return moduleRepository.findByModuleCode(code)
                .orElseThrow(() -> new NotFoundException("Module not found with code: " + code));
    }

    public ModuleResponse updateModule (ModuleRequest request, Long id) {
        Module existingModule = moduleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Module not found with id: "+ id));
        existingModule.setModuleName(request.getModuleName());
        existingModule.setActif(request.getActif());
        existingModule.setColor(request.getColor());
        existingModule.setIcon(request.getIcon());
        existingModule.setUri(request.getUri());
        Module updateModule = moduleRepository.save(existingModule);
        return moduleMapper.entityToResponse(updateModule);
    }

    public void deleteModule(Long id) {
        Module entity = moduleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Module not found with id: " +id));
        moduleRepository.delete(entity);
    }

}
