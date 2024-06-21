import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getProducts } from "../api/products";
import additionalDetailsData from "../data/products.json";
import { slugify } from "../utils/utils";
import { PiGreaterThanLight } from "react-icons/pi";
import AccordionItem from "../components/Accordion";
import Loading from "../components/Loading";
import Button from "../components/Button";
import { addItem } from "../redux/slice/cartSlice";
import { useDispatch } from "react-redux";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const fetchedProduct = products.find(
          (product) => slugify(product.name) === slug
        );

        if (fetchedProduct) {
          if (
            fetchedProduct.image &&
            !fetchedProduct.image.startsWith("http")
          ) {
            fetchedProduct.image = `http://127.0.0.1:8000${fetchedProduct.image}`;
          }

          setProduct(fetchedProduct);
          setAdditionalDetails(additionalDetailsData[fetchedProduct.id]);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product || !additionalDetails) {
    return <Loading />;
  }

  const handleAddToCart = (product) => {
    dispatch(addItem({ ...product, quantity: 1 }));
  };

  return (
    <main className="mainproducts">
      <section>
        <div>
          <nav>
            <ol>
              <li>
                <NavLink className={"home"} to={"/"}>
                  Home <PiGreaterThanLight />
                </NavLink>
                <NavLink to={`/product/${slugify(product.name)}`}>
                  {product.name}
                </NavLink>
              </li>
            </ol>
          </nav>
          <img src={product.image} alt={product.name} />
        </div>
        <h1>{product.name}</h1>
        <p className="price">{product.price}€</p>
        <div className="maincontent">
          <p className="h2">{product.description}</p>
          <p className="h3">{additionalDetails.main}</p>
          {Array.isArray(additionalDetails.details) ? (
            <ul>
              {additionalDetails.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          ) : (
            <p>{additionalDetails.details}</p>
          )}
          <p className="note">{additionalDetails.note}</p>
          <p className="update">{additionalDetails.update}</p>
        </div>
        <Button className={"button"} onClick={() => handleAddToCart(product)} text="Add to Basket" />
        <AccordionItem
          title="Ingredients"
          content={additionalDetails.ingredients}
        />
        <AccordionItem title="How to use" content={additionalDetails.usage} />
        <AccordionItem title="Cautions" content={additionalDetails.cautions} />
        <AccordionItem
          titleClassName={"bottomborder"}
          title="Shipping & Returns"
          content={
            <ul className="contentacc">
              {additionalDetails.shipping_return.map(
                (shipping_return, index) => (
                  <li key={index}>{shipping_return}</li>
                )
              )}
            </ul>
          }
        />
      </section>
    </main>
  );
};

export default ProductDetail;
