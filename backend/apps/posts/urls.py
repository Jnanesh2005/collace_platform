from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListView.as_view(), name='post-list'),
    path('create/', views.CreatePostView.as_view(), name='create-post'),
    path('<int:post_id>/like/', views.like_post, name='like-post'),
    path('<int:post_id>/comment/', views.create_comment, name='create-comment'),
]