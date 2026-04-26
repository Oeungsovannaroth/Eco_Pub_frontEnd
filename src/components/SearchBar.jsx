function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search menu items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
      />
    </div>
  );
}

export default SearchBar;