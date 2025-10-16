import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";

function CartOverview() {
  // Redux recommends to do the data-manipulation inside Selector-function NOT inside component along with that placed inside "slice" file.
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalPrice = useSelector(getTotalCartPrice);

  if (!totalCartQuantity) return null;
  return (
    <div className="flex items-center justify-between bg-stone-700 p-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      {/* Without using any flexbox tricks ; we can directly add space b/w elements BY doing "space" on parent. */}
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>${totalPrice.toFixed(2)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
