package com.travelplanner.repository;

import com.travelplanner.entity.Activity;
import com.travelplanner.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByActivityOrderByCreatedAtAsc(Activity activity);
}
