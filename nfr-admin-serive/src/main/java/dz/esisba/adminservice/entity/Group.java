package dz.esisba.adminservice.entity;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

// Author : Nacera
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "t_group")
public class Group implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGroup;

    @Column( nullable = false)
    private String libelle;

    @Column(nullable = false)
    private boolean actif;


}