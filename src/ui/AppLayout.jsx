import Header from "./Header";
import CartOverview from "../features/cart/CartOverview";
import Loader from "../ui/Loader";
import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
  const navigation = useNavigation(); // Using this hook, we can see whether ENTIRE-App is idle/loading/submitting etc.
  const isLoading = navigation.state === "loading";

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      {isLoading && <Loader />}
      <Header />

      {/* Wrapped in div SO "width" applies even with margin-x-auto. */}
      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl">
          {/* MISTAKE was that NOT using "Outlet-comp" didn't render the current nested routes content.*/}
          <Outlet />
        </main>
      </div>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
