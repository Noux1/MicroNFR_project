package dz.esisba.adminservice.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

// Author: Nour
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class UserAuthority implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUserAuthority;


    @ManyToOne
    @JoinColumn(name = "authority_id" , referencedColumnName = "idAuthority", nullable = false)
    private Authority authority;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id" , referencedColumnName = "idUser" , nullable = false)
    private User user;

    private boolean granted;



}