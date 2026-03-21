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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          {product.brand && (
            <div className="product-brand" style={{ marginBottom: '0' }}>{product.brand}</div>
          )}
          {product.age_category && (
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', backgroundColor: '#FEF2F2', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
              {product.age_category}
            </div>
          )}
        </div>
        
        <h3 className="product-name" style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
        
        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem' }}>
            {product.colors.map((color, index) => (
              <div 
                key={index} 
                style={{ 
                  width: '1rem', 
                  height: '1rem', 
                  borderRadius: '50%', 
                  backgroundColor: color, 
                  border: '1px solid #E2E8F0',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                }}
                title={color}
              />
            ))}
          </div>
        )}
        
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
