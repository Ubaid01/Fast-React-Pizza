import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }

  return (
    // Wrap inside "form" to automatically submit on "Enter".
    <form className="relative -left-10 lg:-left-32" onSubmit={handleSubmit}>
      <input
        placeholder="Search order number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="trasition-all w-28 rounded-full bg-yellow-100 px-4 py-2 text-sm duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:w-64 sm:focus:w-72"
      />
    </form>
  );
}

export default SearchOrder;
