package com.nexis.course_service.model;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType; // PDF, VIDEO, LINK, DOCUMENT, PRESENTATION

    @Column(name = "file_size")
    private Long fileSize; // in bytes

    @Enumerated(EnumType.STRING)
    private MaterialType type;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "is_downloadable")
    private Boolean isDownloadable = true;

    @Column(name = "is_visible")
    private Boolean isVisible = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

enum MaterialType {
    LECTURE_NOTES,
    SLIDES,
    VIDEO,
    ASSIGNMENT,
    READING,
    LINK,
    OTHER
}
