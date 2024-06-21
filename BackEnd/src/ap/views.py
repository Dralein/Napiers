from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from .utils import generate_access_token,get_user_from_token
from .models import Users, Products,Order
from .serializers import UsersSerializer, ProductsSerializer,OrderSerializer
import jwt
from django.conf import settings
from django.db import connection
from django.views import View
from django.http.multipartparser import MultiPartParser
from django.http import QueryDict
import logging
import json
from decimal import Decimal
from django.shortcuts import get_object_or_404

def index(request):
    return HttpResponse("Bonjour")

@csrf_exempt
def create_user_view(request):
    if request.method == 'GET':
        User = get_user_model()
        users = User.objects.all()
        serializer = UsersSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body)
        serializer = UsersSerializer(data=data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return JsonResponse({"message": "User successfully created"}, status=201)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=400)
        else:
            return JsonResponse({"errors": serializer.errors}, status=400)
        
logger = logging.getLogger(__name__)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            logger.debug(f"Login attempt with email: {email}")

            if not email or not password:
                logger.warning("Email or password not provided")
                return JsonResponse({'error': 'Email and password are required'}, status=400)

            with connection.cursor() as cursor:
                cursor.execute("SELECT id, password FROM users WHERE email=%s", [email])
                user_data = cursor.fetchone()

                if user_data:
                    user_id, hashed_password = user_data
                    if check_password(password, hashed_password):
                        access_token = generate_access_token(user_id)
                        logger.debug(f"Access token generated for user_id: {user_id}")
                        response = JsonResponse({'token': access_token})
                        response.set_cookie('access', access_token, httponly=True, secure=True)
                        return response
                    else:
                        logger.warning(f"Invalid credentials for email: {email}")
                        return JsonResponse({'error': 'Invalid credentials'}, status=400)
                else:
                    logger.warning(f"User not found for email: {email}")
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)

        except json.JSONDecodeError:
            logger.error("Invalid JSON provided")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return JsonResponse({'error': 'An error occurred'}, status=500)
    else:
        logger.warning("Invalid request method")
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def read_users_view(request):
    user = get_user_from_token(request)
    if not user:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    if not user.isAdmin:
        return JsonResponse({'error': 'Forbidden'}, status=403)

    users = Users.objects.all()
    serializer = UsersSerializer(users, many=True)
    return JsonResponse(serializer.data, safe=False)

def get_user_profile(request):
    user = get_user_from_token(request)
    
    if user:
        user_data = {
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'admin' : user.isAdmin,
        }
        return JsonResponse(user_data)
    else:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

@csrf_exempt
def update_user_view(request, id):
    user = get_user_from_token(request)
    if not user or not user.isAdmin:
        return JsonResponse({'error': 'Unauthorized or Forbidden'}, status=401)

    if request.method == 'PUT':
        data = json.loads(request.body)
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        password = make_password(data.get('password'))
        try:
            user_to_update = Users.objects.get(id=id)
            user_to_update.lastname = lastname
            user_to_update.firstname = firstname
            user_to_update.email = email
            user_to_update.password = password
            user_to_update.save()
            return JsonResponse({'message': 'User updated successfully'})
        except Users.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def delete_user_view(request, id):
    user = get_user_from_token(request)
    if not user or not user.isAdmin:
        return JsonResponse({'error': 'Unauthorized or Forbidden'}, status=401)

    if request.method == 'DELETE':
        try:
            user_to_delete = Users.objects.get(id=id)
            user_to_delete.delete()
            return JsonResponse({'message': 'User deleted successfully'})
        except Users.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@csrf_exempt
def create_product_view(request):
    user = get_user_from_token(request)
    if not user or not user.isAdmin:
        return JsonResponse({'error': 'Unauthorized or Forbidden'}, status=401)

    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        price = request.POST.get('price')
        image = request.FILES.get('image') if 'image' in request.FILES else None
        print(f"name: {name}, description: {description}, price: {price}, image: {image}")

        if image:
            print(f"Image file name: {image.name}")
            print(f"Image file size: {image.size}")

        try:
            product = Products.objects.create(name=name, description=description, price=price, image=image)
            product.save()
            image_url = request.build_absolute_uri(product.image.url) if product.image else None
            print(f"Saved product image path: {product.image.url if product.image else 'No Image'}")
            return JsonResponse({
                'message': 'Product created successfully',
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'image': image_url
                }
            }, status=201)
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def read_product_view(request):
    user = get_user_from_token(request)

    products = Products.objects.all()
    serializer = ProductsSerializer(products, many=True, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

def decimal_to_float(value):
    if isinstance(value, Decimal):
        return float(value)
    return value

def product_detail(request, id):
    product = get_object_or_404(Products, id=id)

    data = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": decimal_to_float(product.price),
        "image": product.image.url if product.image else None,
    }

    return JsonResponse(data)

@method_decorator(csrf_exempt, name='dispatch')
class update_product_view(View):

   def put(self, request, id):
        try:
            print("Inside update_product_view")
            user = get_user_from_token(request)
            print("User obtained: ", user)
            if not user or not user.isAdmin:
                print("Unauthorized access attempt")
                return JsonResponse({'error': 'Unauthorized or Forbidden'}, status=401)

            if request.content_type.startswith('multipart/form-data'):
                parser = MultiPartParser(request.META, request, request.upload_handlers)
                data, files = parser.parse()
                print("Parsed multipart data:", data)
                print("Parsed files:", files)
            else:
                data = QueryDict(request.body)
                files = request.FILES
                print("Non-multipart data:", data)
                print("Files:", files)

            name = data.get('name')
            description = data.get('description')
            price = data.get('price')
            image = files.get('image') if 'image' in files else None
            print("Parsed data - Name: {}, Description: {}, Price: {}, Image: {}".format(name, description, price, image))

            try:
                print("Trying to get product with id: ", id)
                product_to_update = Products.objects.get(id=id)
                if name:
                    product_to_update.name = name
                if description:
                    product_to_update.description = description
                if price:
                    product_to_update.price = price
                if image:
                    product_to_update.image = image
                product_to_update.save()
                print("Product updated successfully")
                return JsonResponse({'message': 'Product updated successfully'})
            except Products.DoesNotExist:
                print("Product not found")
                return JsonResponse({'error': 'Product not found'}, status=404)
            except Exception as e:
                print("Error updating product: ", str(e))
                return JsonResponse({'error': str(e)}, status=500)
        except Exception as e:
            print("General error: ", str(e))
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def delete_product_view(request, id):
    user = get_user_from_token(request)
    if not user or not user.isAdmin:
        return JsonResponse({'error': 'Unauthorized or Forbidden'}, status=401)

    if request.method == 'DELETE':
        try:
            product = Products.objects.get(id=id)
            product.delete()
            return JsonResponse({'message': 'Product deleted successfully'})
        except Products.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
    
@csrf_exempt
def create_order_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = Users.objects.get(id=data['user_id'])
        product = Products.objects.get(id=data['product_id'])
        order = Order(
            user=user,
            product=product,
            quantity=data['quantity'],
            total_price=data['total_price'],
            status=data['status']
        )
        order.save()
        serializer = OrderSerializer(order)
        return JsonResponse(serializer.data, status=201)

@csrf_exempt
def read_orders_view(request):
    if request.method == 'GET':
        order = Order.objects.all()
        serializer = OrderSerializer(order, many=True)
        return JsonResponse(serializer.data, safe=False)