import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  // Use product image or a placeholder
  const imageSrc = product.primary_image_url || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80';
  
  const discount = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);

  return (
    <Link href={`/products/${product.slug || product.id}`} className="product-card">
      <div className="product-image-container">
        {discount > 0 && (
          <div className="product-badge">
            {discount}% OFF
          </div>
        )}
        <img 
          src={imageSrc} 
          alt={product.name}
          className="product-image"
        />
      </div>
      
      <div className="product-details">
        {product.brand && (
          <div className="product-brand">{product.brand}</div>
        )}
        
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-price-row">
          <span className="product-price">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.compare_at_price > product.price && (
            <span className="product-price-old">
              ₹{product.compare_at_price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        
        {product.stock_quantity > 0 ? (
          <div className="product-stock" style={{ color: 'var(--success)' }}>
            In Stock
          </div>
        ) : (
          <div className="product-stock" style={{ color: 'var(--error)' }}>
            Out of Stock
          </div>
        )}
      </div>
    </Link>
  );
}
