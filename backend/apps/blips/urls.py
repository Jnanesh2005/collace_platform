from django.urls import path
from . import views

urlpatterns = [
    path('', views.BlipListView.as_view(), name='blip-list'),
    path('create/', views.CreateBlipView.as_view(), name='create-blip'),
    path('<int:blip_id>/like/', views.like_blip, name='like-blip'),
    path('<int:blip_id>/comment/', views.create_blip_comment, name='create-blip-comment'),
    path('user/<int:user_id>/', views.UserBlipsView.as_view(), name='user-blips'),
]