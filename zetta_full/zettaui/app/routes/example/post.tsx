import axios from "axios";
import type { Route } from "./+types/post";
import { redirect, useFetcher, useNavigation } from "react-router";

// export async function loader({ params }: Route.LoaderArgs) {
//   const id = params.id;
//   return { id };
// }

// pour fetcher dans une API externe on utilise le clientLoader
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  return await res.data;
}

export async function clientAction({ params }: Route.ClientActionArgs) {
  try {
    const id = params.id;
    const res = await axios.delete(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return { isDeleted: true };
  } catch (err) {
    return { isDeleted: false };
  }
  //   return redirect("/");
}

export default function post({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const isDeleted = fetcher.data?.isDeleted;

  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  const isDeleting = fetcher.state !== "idle";

  if (isNavigating) {
    return <p>Deleting...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {!isDeleted && (
        <>
          <p> {loaderData.title} </p>
          <p> {loaderData.body} </p>
        </>
      )}

      {isDeleted && <p>Post deleted</p>}
    </div>
  );
}
