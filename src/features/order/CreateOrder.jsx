/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import EmptyCart from "../cart/EmptyCart";
import { getCart, clearCart, getTotalCartPrice } from "../cart/cartSlice";
import { fetchAddress } from "../user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import store from "../../store";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false); // As we need a reactive price so made "priority" a state.
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const formErrors = useActionData(); // It is for anyData returned from action. BUT mostly used to display errors in UI.
  const isSubmitting = navigation.state === "submitting";
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: addressError,
  } = useSelector((store) => store.user);
  const isLoadingAddress = addressStatus === "loading";
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (cart.length === 0) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      {/* To make this "form" work with React-Router use "Form" given by React-Router INSTEAD of our boilerPlate "Form-comp". WE can't use GET-method to submit data from forms. BY-default NO need to write action as React-Router will simply match the closest route. */}
      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center">
          {/* Flex-basis defines the initial size (Preferred size) of a flex item before any available space is distributed (by flex-grow) or removed (by flex-shrink) in a flex container. 
            MISTAKE ; whenever using elements AS flex-items SO never use width properties LIKE in "input --> width: 100%". NOW "grow" will work with THIS input also.
          */}
          <label className="sm:basis-40">First Name</label>
          {/* ONLY assign default value AS then using as value IT will not change. */}
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        <div className="mb-5 flex flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>

          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-600">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />

            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-600">
                {addressError}
              </p>
            )}
          </div>

          {!position.latitude && !position.longitude && (
            <span className="sm:right[5px] absolute right-[3px] top-[25px] z-50 sm:top-[5px]">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                type="small"
                disabled={isLoadingAddress}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-5">
          {/* Doing via type-hidden as we don't want to show the cart on the UI AND it also sends the cart to the request AS USING "Form" will accept all input fields with a "name"-attribute in the request.formData() on the server or in your action function. */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />

          {/* Since doing outline: "none" will create "Accessibility issues" so we will use a ring which tailwind provides. */}
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}!`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// When "Form" will be submitted ; then its request will automatically be intercepted by this "action" function.
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    // priority: data.priority === "on",
    priority: data.priority === "true",
  };

  const error = {};
  if (!isValidPhone(order.phone))
    error.phone =
      "Please provide correct phone number. We might need it to contact you.";

  if (Object.keys(error).length > 0) return error;

  const newOrder = await createOrder(order);

  // DON'T OVERUSE! BUT avoid it mostly as it deactivates most of the performance-optimization of Redux on this page.
  store.dispatch(clearCart()); // As we need to call useDispatch() hook not available in pure-functions so directly imported "store" here as hack for cart-clearing.

  return redirect(`/order/${newOrder.id}`); // Show newly placedOrder info. ALSO we can't do via useNavigate() as its a hook WHICH is not allowed in normal functions. So generate newResponse.
}

export default CreateOrder;
