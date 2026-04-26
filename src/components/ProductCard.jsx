function ProductCard({ product, onAddToCart }) {
  if (!product) return null; // prevents crash if product is undefined

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/60">
      
      <div className="relative h-60 overflow-hidden bg-black">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product?.name || "Menu Item"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <span className="text-zinc-500 text-sm">No Image</span>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-amber-400 text-sm font-bold px-4 py-1.5 rounded-2xl shadow-lg">
          ${Number(product?.price || 0).toFixed(2)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 leading-tight">
          {product?.name || "Unnamed Item"}
        </h3>

        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {product?.description || "No description available."}
        </p>

        <div className="flex justify-between text-sm mb-6 text-zinc-400">
          <div>
            <span className="text-amber-400 font-medium">Stock:</span>{" "}
            {product?.stock_qty ?? 0}
          </div>

          <div>
            <span className="text-amber-400 font-medium">Status:</span>{" "}
            <span
              className={
                product?.is_available ? "text-emerald-400" : "text-red-400"
              }
            >
              {product?.is_available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={!product?.is_available}
          className={`w-full py-3.5 rounded-2xl font-semibold cursor-pointer text-sm transition-all active:scale-95 ${
            product?.is_available
              ? "bg-amber-500 hover:bg-amber-400 text-black"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          {product?.is_available ? "Add to Cart" : "Currently Unavailable"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
