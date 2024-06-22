package dz.esisba.adminservice.entity;


import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

// Author: Nour
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class AuthorityType implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAuthorityType;

    @NotBlank
    @Column(nullable = false)
    private String libelle;

    @Column(nullable = false)
    private boolean actif = Boolean.TRUE;

}