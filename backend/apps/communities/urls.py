from django.urls import path
from . import views

urlpatterns = [
    path('', views.CommunityListView.as_view(), name='community-list'),
    path('search/', views.CommunitySearchView.as_view(), name='community-search'),
    path('create/', views.CreateCommunityView.as_view(), name='create-community'),
    path('<int:community_id>/', views.CommunityDetailView.as_view(), name='community-detail'),
    path('<int:community_id>/join/', views.join_community, name='join-community'),
    path('<int:community_id>/leave/', views.leave_community, name='leave-community'),
    path('<int:community_id>/members/', views.CommunityMembersView.as_view(), name='community-members'),
]