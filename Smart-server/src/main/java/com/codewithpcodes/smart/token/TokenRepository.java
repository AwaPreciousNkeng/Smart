package com.codewithpcodes.smart.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    @Query(value = "select t from Token t inner join User u " +
            "on t.user.id = u.id " +
            "where u.id = :userID and (t.expired = false or t.revoked = false )")
    List<Token> findAllValidTokenByUser(
            @Param("userID") Integer userID);

    Optional<Token> findByToken(String token);
}
