'use client';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">EShop</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground hover:text-primary transition">
            Produtos
          </a>
          <a href="#" className="text-foreground hover:text-primary transition">
            Categorias
          </a>
          <a href="#" className="text-foreground hover:text-primary transition">
            Sobre
          </a>
        </nav>

        <button
          onClick={onCartClick}
          className="relative bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition"
        >
          Carrinho
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
