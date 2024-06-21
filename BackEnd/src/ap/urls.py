from django.urls import path
from .views import index, product_detail, create_user_view, get_user_profile, login_view, read_users_view, update_user_view, delete_user_view, create_product_view, read_product_view, update_product_view, delete_product_view,read_orders_view, create_order_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='index'),
    path('users/', create_user_view, name='create_user'),  
    path('login/', login_view, name='login'),
    path('users/read/', read_users_view, name='read_users'),
    path('user/profile/', get_user_profile, name='user_profile'),
    path('users/update/<int:id>/', update_user_view, name='update_user'),
    path('users/delete/<int:id>/', delete_user_view, name='delete_user'),
    path('products/', create_product_view, name='create_product'),
    path('products/read/', read_product_view, name='read_products'),
    path('products/<int:id>/', product_detail, name='product_detail'),
    path('products/update/<int:id>/', update_product_view.as_view(), name='update_product'),
    path('products/delete/<int:id>/', delete_product_view, name='delete_product'),
    path('order/', create_order_view, name='create_order'),
    path('order/read/', read_orders_view, name='read_orders'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)