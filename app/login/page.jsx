'use client';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import Link from "next/link";export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClientComponentClient();

    useEffect(() => {
        async function getUser(){
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        getUser();
    });

    const handleSignUp = async () => {
        const res = await supabase.auth.signUp({
            email, 
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        });
        setUser(res.data.user);
        router.refresh();
        setEmail('');
        setPassword('');
    };

    const handleSignIn = async () => {
        const res = await supabase.auth.signInWithPassword({
            email,
            password
        });
        setUser(res.data.user);
        router.refresh();
        setEmail('');
        setPassword('');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setUser(null);
    };

    if(loading) {
        return <h1 className="text-center text-xl font-semibold">Loading...</h1>;
    }

    if (user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">You are already logged in</h1>
                <button onClick={handleLogout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
                    Logout
                </button>
                <Link href="/images-list">
                    <a className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors">
                        CONTINUE
                    </a>
                </Link>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <div className="space-y-4">
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="input text-black" />
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input text-black" />
            </div>
            <div className="mt-4 space-x-2">
                <button onClick={handleSignUp} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">Sign up</button>
                <button onClick={handleSignIn} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors">Sign In</button>
            </div>
        </main>
    );
}
