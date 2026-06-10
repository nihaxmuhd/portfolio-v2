from datetime import date

from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ContactMessage,
    Experience,
    PortfolioProfile,
    Project,
    Resume,
    Skill,
)
from .permissions import AdminOnly, ReadOnlyOrAdmin
from .serializers import (
    ContactMessageSerializer,
    ExperienceSerializer,
    PortfolioProfileSerializer,
    ProjectSerializer,
    ResumeSerializer,
    SkillSerializer,
    StatsSerializer,
)


# ---------- Profile ----------
class ProfileView(generics.RetrieveUpdateAPIView):
    """GET → public. PUT/PATCH → admin only."""

    serializer_class = PortfolioProfileSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_object(self):
        return PortfolioProfile.objects.first()


# ---------- Stats ----------
class StatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = PortfolioProfile.objects.first()
        years = (
            date.today().year - profile.career_start_year
            if profile and profile.career_start_year
            else 0
        )
        data = {
            "projects_built": Project.objects.count(),
            "tech_skills": Skill.objects.count(),
            "years_experience": max(years, 0),
        }
        return Response(StatsSerializer(data).data)


# ---------- CRUD viewsets ----------
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [ReadOnlyOrAdmin]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.prefetch_related("images").all()
    serializer_class = ProjectSerializer
    permission_classes = [ReadOnlyOrAdmin]


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [ReadOnlyOrAdmin]


# ---------- Resume ----------
class ResumeView(APIView):
    """
    GET     — public, returns the current resume or 404.
    POST    — admin, upload a new file (multipart, field `file`).
    DELETE  — admin, remove the current resume.
    """

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [AdminOnly()]

    def get(self, request):
        resume = Resume.objects.order_by("-updated_at").first()
        if not resume:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(ResumeSerializer(resume, context={"request": request}).data)

    def post(self, request):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response(
                {"detail": "No file uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # save() on the model deletes any prior resume automatically.
        resume = Resume.objects.create(file=file_obj)
        return Response(
            ResumeSerializer(resume, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request):
        Resume.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------- Contact ----------
class ContactView(APIView):
    """POST — submit a new message (public)."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ---------- Messages (admin) ----------
class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin-only inbox: list + retrieve. Supports /read/ and delete."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AdminOnly]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="read")
    def mark_read(self, request, pk=None):
        msg = get_object_or_404(ContactMessage, pk=pk)
        msg.is_read = True
        msg.save(update_fields=["is_read"])
        return Response({"detail": "Marked as read."})
