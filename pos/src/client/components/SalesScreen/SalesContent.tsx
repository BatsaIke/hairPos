import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./SalesScreen.module.css";
import ProductCard from "./ProductCard/ProductCard";
import Spinner from "../UI/Spinner";
import Pagination from "../UI/pagination/Pagination";
import { Product } from "../context/ProductContext";

interface SalesContentProps {
  loading: boolean;
  products: Product[];
  addItem: (item: { id: string; name: string; price: number; quantity: number; imageUrl?: string }) => void;
  searchTerm: string;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
}

const SalesContent: React.FC<SalesContentProps> = ({
  loading,
  products,
  addItem,
  searchTerm,
  selectedCategory,
  setSelectedCategory,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) => {
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category || "Uncategorized")));
  const categories = ["All", ...uniqueCategories];
  const [barcode, setBarcode] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);

  // Handle barcode input changes
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const filteredBySearch = products.filter((prod) => {
    const nameMatch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const skuMatch = prod.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return nameMatch || skuMatch;
  });

  const displayedProducts =
    selectedCategory === "All"
      ? filteredBySearch
      : filteredBySearch.filter((p) => (p.category || "Uncategorized") === selectedCategory);

  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageProducts = displayedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, setCurrentPage]);

  useEffect(() => {
    // Ensure the input gets focused when the component mounts or refocuses
    if (barcodeRef.current) {
      barcodeRef.current.addEventListener("focus", () => {
        barcodeRef.current?.focus();
      });
    }

    return () => {
      barcodeRef.current?.removeEventListener("focus", () => {
        barcodeRef.current?.focus();
      });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement === barcodeRef.current) {
        const scannedProduct = products.find((p) => p.sku === barcode);

        if (scannedProduct) {
          addItem({
            id: scannedProduct._id,
            name: scannedProduct.name,
            price: scannedProduct.regularPrice,
            quantity: 1,
            imageUrl: scannedProduct.imageUrl,
          });
          alert(`Product "${scannedProduct.name}" added to cart!`);
        } else {
          alert("Product not found!");
        }

        setBarcode(""); // Reset barcode input
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [barcode, products, addItem]);

  if (loading) {
    return (
      <div className={styles.leftSide}>
        <Spinner message="Loading products..." />
      </div>
    );
  }

  return (
    <div className={styles.leftSide}>
      <div className={styles.categoryBar}>
        {categories.map((cat) => (
          <div
            key={cat}
            className={styles.categoryItem}
            onClick={() => setSelectedCategory(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? "#555" : "#444",
            }}
          >
            {cat}
          </div>
        ))}
      </div>
      {/* BARCODE INPUT */}
      <div className={styles.barcodeScanner}>
        <label
          htmlFor="barcode"
          style={{ fontSize: "1.1rem", color: "#6c757d", cursor: "pointer" }}
          onClick={() => barcodeRef.current?.focus()}
        >
          Scan Barcode
        </label>
        <input
          type="text"
          id="barcode"
          ref={barcodeRef}
          value={barcode}
          onChange={handleBarcodeChange}
          placeholder="Scan or enter product barcode..."
          className={styles.barcodeInput}
          autoFocus
        />
        <i className={`fas fa-barcode ${styles.scanIcon}`} />
      </div>

      <div className={styles.products}>
        {pageProducts.map((prod) => (
          <ProductCard
            key={prod._id}
            name={prod.name}
            price={prod.regularPrice}
            imageUrl={prod.imageUrl}
            onAddToCart={() =>
              addItem({
                id: prod._id,
                name: prod.name,
                price: prod.regularPrice,
                quantity: 1,
                imageUrl: prod.imageUrl,
              })
            }
          />
        ))}
      </div>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
};

export default SalesContent;
