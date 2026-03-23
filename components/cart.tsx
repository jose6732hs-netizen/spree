'use client';

interface CartProps {
  items: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  onRemove: (index: number) => void;
}

export default function Cart({ items, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-foreground mb-4">Seu Carrinho</h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Carrinho vazio</p>
      ) : (
        <>
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{item.name}</p>
                  <p className="text-primary font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-500 hover:text-red-700 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-semibold">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-foreground">Total:</span>
              <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition">
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
}
