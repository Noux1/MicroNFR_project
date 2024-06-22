package dz.esisba.adminservice.entity;


import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "t_user")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    @NotBlank
    @Column(name = "uuid", nullable = false)
    private String uuid;

    @Column(name = "User_Name", nullable = false)
    private String userName;

    @Column(name = "First_Name", nullable = false)
    private String firstName;

    @Column(name = "Last_Name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "Phone_Number", unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private Boolean actif;

    @ManyToOne
    @JoinColumn(name = "id_Group", referencedColumnName = "idGroup")
//    @Column(nullable = true)
    private Group group;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> Roles = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Module> Modules = new HashSet<>();


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private Set<UserAuthority> userAuthorities = new HashSet<>();

    public void addModule(Module module) {
        this.getModules().add(module);
    }

    public void removeModule(Module module) {
        this.getModules().remove(module);
    }

    public void addRole(Role role) {
        this.getRoles().add(role);
    }

    public void removeRole(Role role) {
        this.getRoles().remove(role);
    }

    public void addAuthority(UserAuthority userAuthority) {
        this.getUserAuthorities().add(userAuthority);
    }

    public void removeAuthority(UserAuthority userAuthority) {
        this.getUserAuthorities().remove(userAuthority);
    }
}