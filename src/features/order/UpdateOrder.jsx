/* eslint-disable react/prop-types , no-unused-vars */
import { useFetcher } from "react-router-dom";
import { updateOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";

function UpdateOrder({ order }) {
  // To write data, don't use fetcher.load() BUT use the Form-component which the Fetcher-provides, it will just revalidate the page and not navigate-the page.
  // Revalidation means that React-Router knows that data has changed due to this action so it will re-render the page with re-fetched data.
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="PATCH"
      className="text-right"
      action={`/order/${order.id}`}
    >
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ request, params }) {
  // const data = { priority: true } ;
  await updateOrder(params.orderId, {
    priority: true,
  });
  return null; // WE must need to return something for update-action AND also need to wire it with the page using Application-Router.
}
