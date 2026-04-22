package com.codewithpcodes.smart.user;

import com.codewithpcodes.smart.token.Token;
import com.codewithpcodes.smart.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;
import org.jspecify.annotations.Nullable;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String firstName;

    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nationalId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Language language = Language.ENGLISH;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Token> tokens;

    private String profilePicturePath;

    private String resetPasswordCode;
    private LocalDateTime resetPasswordCodeExpiry;

    @CreatedDate
    private LocalDateTime createdAt;

    @Override
    public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public @NonNull String getUsername() {
        return email;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String getFull() {
        return null;
    }
}
