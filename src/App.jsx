import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import { action as updateOrderAction } from "./features/order/UpdateOrder";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";

// WHILE "loaders" ARE used to read/fetch data from server ; "actions" are used to write/mutate data on server.

// Imperative Way so to enable data fetching with React Router. WITH OLD-Method ; we can't use that to load/submit data from forms.
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />, // As the child-routes errors will bubble upto parent. SO complete app will be replaced by Error-component.
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader, // React Router will  will pre-load this data via the loader before rendering the component.
        errorElement: <Error />, // Define inside child IF want to render "layout with error" also.
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction, // Connect URL to action.
      },
      {
        path: "/order/:orderId", // Although this action is on the child-component of this URL-page, React-Router will automatically handle that.
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
