from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view


User = get_user_model()

@api_view(["GET"])
def setup_admin(request):
    user = User.objects.create_superuser(
        username="nihad",
        email="nihad@gmail.com",
        password="@a#h$s12NS"
    )

    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()

    return Response({
        "message": "admin created",
        "username": user.username
    })