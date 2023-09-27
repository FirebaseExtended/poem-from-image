import { useAuth, useUser } from "reactfire";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LogIn() {
    const auth = useAuth();
    const {data} = useUser();
    const navigate = useNavigate();
    if (data) {
        navigate("/", {relative: 'path'});
    }
    return (
        <>
            <div className="login-group flex items-center justify-center">
                <Button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Sign in</Button>
            </div>
        </>
    );
}