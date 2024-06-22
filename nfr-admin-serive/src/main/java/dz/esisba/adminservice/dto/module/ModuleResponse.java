package dz.esisba.adminservice.dto.module;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModuleResponse {
    private Long id;
    private String moduleName;
    private String moduleCode;
    private String color;
    private String icon;
    private String uri;
    private Boolean actif;
}
