package com.app.repository;

import com.app.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, String> {
    // This gives us save(), findAll(), and findById() automatically
}