package com.app.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "players")
@Data
public class Player {
    @Id
    private String sleeperId;
    private String gsisId;
    private String fullName;
    private String position;
    private String team;
    private Boolean active;
}