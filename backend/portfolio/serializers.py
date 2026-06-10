from rest_framework import serializers

from .models import (
    ContactMessage,
    Experience,
    PortfolioProfile,
    Project,
    ProjectImage,
    Resume,
    Skill,
)


class PortfolioProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioProfile
        fields = (
            "id", "full_name", "title", "bio", "email", "phone", "location",
            "github_url", "linkedin_url", "profile_image", "career_start_year",
        )


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ("id", "name", "category", "proficiency", "order")


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ("id", "image", "caption", "order")


class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "id", "title", "description", "tech_stack", "github_url",
            "live_url", "featured", "order", "thumbnail", "images",
        )


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = (
            "id", "company", "role", "start_date", "end_date",
            "is_current", "description", "order",
        )


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ("id", "file", "updated_at")
        read_only_fields = ("updated_at",)


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ("id", "name", "email", "subject", "message", "created_at", "is_read")
        read_only_fields = ("id", "created_at", "is_read")


class StatsSerializer(serializers.Serializer):
    projects_built = serializers.IntegerField()
    tech_skills = serializers.IntegerField()
    years_experience = serializers.IntegerField()
