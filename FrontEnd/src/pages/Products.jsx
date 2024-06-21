import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import { slugify } from "../utils/utils";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { addItem } from "../redux/slice/cartSlice";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handleGetProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleAddToCart = (product) => {
    dispatch(addItem({ ...product, quantity: 1 }));
  };

  return (
    <main>
      <header className="headerproducts">
        <div className="headerdivproducts">
          <h1>All Products</h1>
          <p>
            All of the items our customers love the most, from beautifully
            fragranced creams to immune-boosting tinctures.
          </p>
        </div>
      </header>
      <section>
        <h2 className="h2products">{products.length} products</h2>
        <div className="product-container">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="image-container">
                {product.image && (
                  <>
                    <img
                      className="cardimage"
                      src={product.image}
                      alt={product.name}
                    />
                    <Button
                      className="button"
                      text="Add to Basket"
                      onClick={() => handleAddToCart(product)}
                    />
                  </>
                )}
              </div>
              <div className="card">
                <Link to={`/product/${slugify(product.name)}`}>
                  <h2 className="card-name">{product.name}</h2>
                </Link>
                <p className="card-description">{product.description}</p>
                <p className="card-price">{product.price}€</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Products;
