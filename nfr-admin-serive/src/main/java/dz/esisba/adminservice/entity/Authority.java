package dz.esisba.adminservice.entity;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

// Author: Nour

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Authority implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAuthority;

    @NotBlank
    @Column(nullable = false)
    private String libelle;

    @Column(nullable = false)
    private boolean actif= Boolean.TRUE;

    @NotNull
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_AuthorityType" , referencedColumnName = "idAuthorityType")
    private AuthorityType authorityType;

    @NotNull
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_Module", referencedColumnName = "idModule")
    private Module module;


}