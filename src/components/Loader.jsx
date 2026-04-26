function Loader({ text = "Loading..." }) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

export default Loader;