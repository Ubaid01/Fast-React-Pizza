import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import { useSelector, useDispatch } from "react-redux";
import { getCart, clearCart } from "./cartSlice";

function Cart() {
  const username = useSelector((store) => store.user.username);
  const cart = useSelector(getCart);
  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

      <ul className="mt-3 divide-y divide-stone-300 border-b">
        {cart.map((item) => (
          <CartItem key={item.pizzaId} item={item} />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        <Button to="/order/new" type="primary">
          Order pizzas
        </Button>

        {/* Here My Mistake was that I was running dispatch-function directly without handler () => SO it resulted in infinite loop. */}
        <Button type="secondary" onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      </div>
    </div>
  );
}

export default Cart;
