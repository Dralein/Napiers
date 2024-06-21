import { useState, useEffect, useRef } from "react";
import { IoIosAdd } from "react-icons/io";
import Button from "../components/Button";
import { PropTypes } from "prop-types";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";

const Products = ({ userToken, updateTrigger, setUpdateTrigger }) => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(userToken);
        setProducts(response);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [userToken, updateTrigger]);

  const handleImageChange = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId, userToken);
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!name || !description || !price) {
      setMessage("All fields except image are required.");
      if (!name) nameRef.current.focus();
      else if (!description) descriptionRef.current.focus();
      else if (!price) priceRef.current.focus();
      return;
    }

    const productData = {
      name,
      description,
      price,
      image,
    };

    try {
      const response = await updateProduct(
        editProductId,
        productData,
        userToken
      );
      if (response.message) {
        setMessage(response.message);
      } else if (response.errors) {
        setMessage(`Errors: ${JSON.stringify(response.errors)}`);
      } else {
        setMessage("An error occurred");
      }
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !image) {
      setMessage("All fields are required.");
      if (!name) nameRef.current.focus();
      else if (!description) descriptionRef.current.focus();
      else if (!price) priceRef.current.focus();
      else if (!image) imageRef.current.focus();
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await createProduct(formData, userToken);
      if (response.message) {
        setMessage(response.message);
      } else if (response.errors) {
        setMessage(`Errors: ${JSON.stringify(response.errors)}`);
      } else {
        setMessage("An error occurred");
      }
      setUpdateTrigger((prev) => prev + 1);
      resetForm();
    } catch (error) {
      console.error("Failed to create product", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setImage(null);
    setImagePreview(null);
    setMessage("");
    setEditProductId(null);
    setShowAddProductModal(false);
  };

  return (
    <div className="products">
      <Button
        text="Add"
        className={"button"}
        onClick={() => setShowAddProductModal(true)}
      />
      <div className="product-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {editProductId === product.id ? (
              <div className="edit-form">
                <form className="formproduct" onSubmit={handleUpdateProduct}>
                  <div className="image-upload">
                    <label htmlFor="file-input">
                      {imagePreview ? (
                        <img className="imgpreview" src={imagePreview} alt="Preview" />
                      ) : (
                        <div className="upload-placeholder">
                          <IoIosAdd size={48} color="#ccc" />
                        </div>
                      )}
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      ref={imageRef}
                    />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                    ref={nameRef}
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                    ref={descriptionRef}
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Price"
                    required
                    ref={priceRef}
                  />
                  <div className="buttoncenter">
                  <Button className={"button"} text="Upload" type="submit" />
                  <Button
                    className={"button"}
                    text="Cancel"
                    onClick={resetForm}
                  />
                  </div>
                  {message && <p>{message}</p>}
                </form>
              </div>
            ) : (
              <>
                <div className="product-card">
                  <div className="image-container">
                    <img
                      className="cardimage"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="card">
                    <h2 className="card-name">Name: {product.name}</h2>
                    <p className="card-description">
                      Description: {product.description}
                    </p>
                    <p className="card-price">Price: {product.price}€</p>

                    <div className="divbuttonplacement">
                      <Button
                        text="Update"
                        className={"button"}
                        onClick={() => handleEditProduct(product)}
                      />
                      <Button
                        text="Delete"
                        className={"button"}
                        onClick={() => handleDeleteProduct(product.id)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {showAddProductModal && (
        <div className="modal">
          <div className="modal-content">
            <form className="center-image" onSubmit={handleSubmitProduct}>
              <div className="image-upload">
                <label htmlFor="file-input">
                  {imagePreview ? (
                    <img className="imgpreview" src={imagePreview} alt="Preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <IoIosAdd size={48} color="#ccc" />
                    </div>
                  )}
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleImageChange}
                  required
                  style={{ display: "none" }}
                  ref={imageRef}
                />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                ref={nameRef}
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                ref={descriptionRef}
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Price"
                required
                ref={priceRef}
              />
              <div className="buttoncenter">
                <Button
                  type="Submit"
                  className={"button"}
                  text="Upload"></Button>
                <Button
                  text="Cancel"
                  className={"button"}
                  onClick={resetForm}
                />
              </div>
              {message && <p>{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Products.propTypes = {
  userToken: PropTypes.string.isRequired,
  updateTrigger: PropTypes.number.isRequired,
  setUpdateTrigger: PropTypes.func.isRequired,
};

export default Products;

