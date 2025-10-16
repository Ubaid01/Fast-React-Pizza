import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "../menu/MenuItem";

function Menu() {
  const menu = useLoaderData(); // React router will automatically know that we want the data associated with this Page.

  // To add some lines b/w child elements SO we use built-in "divide" Tailwind class TO add lines b/w elements.
  return (
    <ul className="divide-y divide-stone-300">
      {menu.map((pizza) => (
        <MenuItem key={pizza.id} pizza={pizza} />
      ))}
    </ul>
  );
}

// Mostly its a convention to place "Loader" inside component where needed.
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
