import { useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

function Error() {
  const error = useRouteError(); // AS we are handling this via "errorElement" so we can access it here using hook.
  // console.log(error); // Error.data FOR notFound routes WHILE error.message for "loader-error".

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message}</p>
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
