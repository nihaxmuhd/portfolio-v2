from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class PortfolioProfile(models.Model):
    """Singleton-style profile: only the first row is used by the API."""

    full_name = models.CharField(max_length=150)
    title = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    location = models.CharField(max_length=150, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    profile_image = models.ImageField(upload_to="profile/", blank=True, null=True)
    career_start_year = models.PositiveIntegerField(
        validators=[MinValueValidator(1970), MaxValueValidator(2100)]
    )

    class Meta:
        verbose_name = "Portfolio Profile"
        verbose_name_plural = "Portfolio Profile"

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        # Enforce singleton behaviour.
        if not self.pk and PortfolioProfile.objects.exists():
            raise ValueError("Only one PortfolioProfile is allowed.")
        super().save(*args, **kwargs)


class Skill(models.Model):
    class Category(models.TextChoices):
        FRONTEND = "Frontend", "Frontend"
        BACKEND = "Backend", "Backend"
        DATABASE = "Database", "Database"
        DEVOPS = "DevOps", "DevOps"
        TOOLS = "Tools", "Tools"
        MOBILE = "Mobile", "Mobile"

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices)
    proficiency = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=80,
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "name")

    def __str__(self):
        return f"{self.name} ({self.category})"


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tech_stack = models.JSONField(default=list, blank=True)  # list of strings
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    thumbnail = models.ImageField(upload_to="projects/thumbs/", blank=True, null=True)

    class Meta:
        ordering = ("order", "title")

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/images/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "id")

    def __str__(self):
        return f"{self.project.title} — image {self.pk}"


class Experience(models.Model):
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "-start_date")

    def __str__(self):
        return f"{self.role} @ {self.company}"


class Resume(models.Model):
    file = models.FileField(upload_to="resume/")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        return f"Resume (updated {self.updated_at.date()})"

    def save(self, *args, **kwargs):
        # Only keep the most recent resume.
        if not self.pk:
            Resume.objects.all().delete()
        super().save(*args, **kwargs)


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.name} — {self.subject or '(no subject)'}"
