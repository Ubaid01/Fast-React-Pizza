/* eslint-disable no-unused-vars , react-refresh/only-export-components*/
// Test IDs: IIDSAT , CQE92U

import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import OrderItem from "./OrderItem";
import UpdateOrder from "./UpdateOrder";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { useEffect } from "react";

function Order() {
  const order = useLoaderData();

  // Can use useFetcher() hook to use the data from another route without actually going there, also It gives you more flexibility to load data-async without triggering a full page reload or navigation. AS we want to extend each item with its ingredients on mount OR can do [] with normal async fetch() also. This fetcher can also have different states like useNavigation().
  const fetcher = useFetcher();
  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") fetcher.load("/menu");
  }, [fetcher]);

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      {/* text-wrap WILL not wrap whole container BUT only the text within THAT same container. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-green-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-300 border-b border-t">
        {cart.map((item) => (
          <OrderItem
            key={item.pizzaId}
            item={item}
            ingredients={
              fetcher.data?.find((ing) => ing.id === item.pizzaId)
                .ingredients ?? [] // As at initial mount , fetcher will load data and will be idle.
            }
            isLoadingIngredients={fetcher.state === "loading"}
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>

      { !priority && <UpdateOrder order={order} />}
    </div>
  );
}

// Could have also define this in "App.jsx".
export async function loader({ params }) {
  // const id = useParams() ; // ? Since useParams() is a HOOK so it will only work in COMPONENTS ; NOT in LOADER-function.
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
