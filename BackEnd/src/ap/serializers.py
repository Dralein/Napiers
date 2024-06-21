from rest_framework import serializers
from django.contrib.auth import get_user_model  
from .models import Users, Products,Order

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'firstname', 'lastname', 'email', 'password', 'isAdmin']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Users(**validated_data)
        user.set_password(password)
        user.save()
        return user
        

class ProductsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Products
        fields = '__all__'

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else None
        return None


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
    
class UsersDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'       
        
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['email', 'password']

