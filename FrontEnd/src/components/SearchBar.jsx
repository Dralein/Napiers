import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, setResults, clearResults } from "../redux/slice/searchSlice";
import { getProducts } from "../api/products";
import { NavLink } from "react-router-dom";
import { slugify } from "../utils/utils";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { query, results } = useSelector((state) => state.search);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        dispatch(clearResults());
        return;
      }
      const products = await getProducts();
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      dispatch(setResults(filteredProducts));
    };

    fetchResults();
  }, [query, dispatch]);

  const handleChange = (e) => {
    dispatch(setQuery(e.target.value));
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for products..."
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((product) => (
            <li key={product.id}>
              <NavLink to={`/product/${slugify(product.name)}`}>
                {product.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
