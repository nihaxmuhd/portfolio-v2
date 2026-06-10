from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import LoginSerializer, UserSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        # Rotate token: delete existing and issue a fresh one.
        Token.objects.filter(user=user).delete()
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {"token": token.key, "user": UserSerializer(user).data},
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Deleting the token effectively logs the client out.
        Token.objects.filter(user=request.user).delete()
        return Response({"detail": "Logged out."}, status=status.HTTP_200_OK)


class MeView(APIView)
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


@api_view(["GET"])
def create_admin(request):
    if User.objects.filter(username="admin").exists():
        return Response({"message": "Admin already exists"})

    User.objects.create_superuser(
        username="admin",
        email="your@email.com",
        password="admin123"
    )

    return Response({"message": "Admin created successfully"})