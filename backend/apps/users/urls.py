from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
    path('search/', views.UserSearchView.as_view(), name='user-search'),
    path('friends/request/<int:user_id>/', views.send_friend_request, name='send-friend-request'),
    path('friends/respond/<int:friendship_id>/<str:action>/', views.respond_friend_request, name='respond-friend-request'),
]