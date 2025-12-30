import { getUser } from "@/lib/users";

export default async function UserPage({
  params,
}: {
  params: { uid: string };
}) {
  const user = await getUser(params.uid);

  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{user.name ?? user.email}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
