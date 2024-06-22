package dz.esisba.adminservice.entity;


import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

//Author: nacera
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Role implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRole;

    @Column( nullable = false)
    private String libelle;

    @Column(nullable = false)
    private boolean actif = Boolean.TRUE;

    @ManyToOne
    @JoinColumn(name = "id_module", referencedColumnName = "idModule", nullable = false)
    private Module module;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Set<Authority> authoritySet ;

    public void addAuthority(Authority authority) {
        this.getAuthoritySet().add(authority);
    }

    public void removeAuthority(Authority authority) {
        if (this.getAuthoritySet() != null && !this.getAuthoritySet() .isEmpty()) {
            this.getAuthoritySet() .remove(authority);
        }
    }

 }