'use client';

interface ProductGridProps {
  products: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
  }>;
  onAddToCart: (product: any) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
          <div className="relative h-64 bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">{product.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
