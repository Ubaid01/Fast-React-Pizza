import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-yellow-500 px-4 py-3 uppercase sm:px-6">
      <div className="flex items-center gap-2">
        {/* Can do letter-spacing like "tracking-[.1em]" arbitrary also. */}
        <Link to="/" className="tracking-widest">
          Fast React Pizza Co.
        </Link>
        <p>🍕</p>
      </div>
      <SearchOrder />
      <Username />
    </header>
  );
}

export default Header;
