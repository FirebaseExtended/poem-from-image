/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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