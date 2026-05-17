import uuid
from sqlmodel import Session
from datetime import datetime, timezone
from core.database import engine
from domains.posts.models import Post, Comment

def seed_db():
    with Session(engine) as session:
        # Check if posts already exist
        existing = session.query(Post).first()
        if existing:
            print("Database already seeded.")
            return
            
        print("Seeding database...")
        
        post1 = Post(
            title="Advice for 2-year-old sleep regression?",
            content="My toddler was sleeping through the night but suddenly started waking up at 2 AM every night crying. We've tried extending wake windows but nothing is working. Any advice?",
            category="Sleep",
            author_name="TiredMom99"
        )
        
        post2 = Post(
            title="Best educational toys for 4 year olds?",
            content="Looking for some recommendations on toys that are both fun and educational. My son loves building things!",
            category="General",
            author_name="BuilderDad"
        )
        
        session.add(post1)
        session.add(post2)
        session.commit()
        session.refresh(post1)
        session.refresh(post2)
        
        comment1 = Comment(
            content="We went through this! Stick to the routine. It usually passes in a couple of weeks.",
            post_id=post1.id,
            author_name="ExperiencedParent"
        )
        
        comment2 = Comment(
            content="Have you checked if they are getting their 2-year molars?",
            post_id=post1.id,
            author_name="NurseJen"
        )
        
        comment3 = Comment(
            content="Magna-Tiles are amazing! They last forever and teach spatial skills.",
            post_id=post2.id,
            author_name="PlayLearn"
        )
        
        session.add(comment1)
        session.add(comment2)
        session.add(comment3)
        session.commit()
        print("Seeding complete.")

if __name__ == "__main__":
    seed_db()
