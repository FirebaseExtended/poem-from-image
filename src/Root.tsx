import { Outlet } from "react-router-dom";

function Root() {
  return (
    <div className="h-screen">
        <div className="h-20  p-5 border-solid border-2 border-indigo-600">
      <h1 className="text-4xl">Poems & Pictures</h1>
      </div>
      <div className="h-80 border-solid border-2 border-red-600 h-full p-5">
      <Outlet />
      </div>
    </div>
  );
}

export default Root;
