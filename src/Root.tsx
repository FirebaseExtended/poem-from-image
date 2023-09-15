import { AvatarImage } from "@radix-ui/react-avatar";
import { User } from "firebase/auth";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "reactfire";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import ImageGrid from "./ImageGrid";

function ProfilePic() {
  const { data: user } = useUser();

  return (
    <Avatar>
      {user ? (
        <AvatarImage src={(user as User).photoURL || ""} />
      ) : (
        <AvatarFallback>CG</AvatarFallback>
      )}
    </Avatar>
  );
}

function Root() {
  return (
    <div className="bg-slate-200 h-screen grid grid-cols-6 grid-rows-6 gap-4 p-4 text-slate-700">
      <div className="rounded-sm row-span-1 col-span-6 bg-slate-50 p-6  flex justify-between items-center">
        <Link to="/">
          <h1 className="font-extrabold text-4xl text-slate-900">Poems from pictures</h1>
        </Link>
        <ProfilePic />
      </div>
      <div className="rounded-sm drop-shadow bg-slate-50 col-span-4 row-span-5  grow flex flex-col items-center justify-center p-5">
        <Outlet />
      </div>
      <div className="rounded-sm bg-slate-50 col-span-2 row-span-5  overflow-x-hidden overflow-y-auto">
        <ImageGrid />
      </div>
    </div>
  );
}

export default Root;
