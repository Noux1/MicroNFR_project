package dz.esisba.adminservice.entity;




// Author : Nacera

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Module implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idModule;

    @Column( nullable = false)
    private String uri;

    @Column( nullable = false)
    private String icon;

    @Column(nullable = false)
    private boolean actif = Boolean.TRUE;

    @Column( nullable = false)
    private String color;

    @Column(nullable = false)
    private String  moduleName;

    @Column( nullable = false , unique = true)
    private String moduleCode;

}