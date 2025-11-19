"use client";

import { useState } from "react";
import { getUserByIdentifier } from "@/lib/firebaseUtils"; // adjust path to where your function is
import { v4 as uuidv4 } from "uuid"; // for generating sessionId
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await getUserByIdentifier("userId", userId);

      if (!user) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      if (user.passNumber !== password) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      // Create session object
      const session = {
        sessionId: uuidv4(),
        signInTime: new Date().toISOString(),
        userId: user.userId,
        email: user.email || "",
        role: user.role,
      };

      // Save session in localStorage (you can use sessionStorage instead if preferred)
      localStorage.setItem("session", JSON.stringify(session));

      setLoading(false);
      alert("Sign-in successful!"); // you can redirect here instead
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="fixed top-0 left-0 px-3 py-4.5 flex w-full bg-white z-10">
        <h2 className="text-xl font-bold text-primary">BANK OF AMERICA</h2>
        <img
          src="/images/svg/bank-of-america-logo-png-symbol-0.png"
          alt="bank of america"
          className="w-10 h-5"
        />
      </div>
      <form
        onSubmit={handleSignIn}
        className="relative overflow-hidden pt-16 bg-white p-8 rounded-md shadow-md w-full max-w-sm"
      >
        <div className="absolute top-0 left-0 w-full flex h-3 bg-primary">
          {/* Red bar with slanted end */}
          <div
            className="bg-red-700 w-[70%]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)",
            }}
          ></div>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <label className="block mb-2 font-medium">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border border-black bg-white rounded mb-6"
          required
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-black bg-white rounded mb-16"
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white p-3 rounded-full hover:bg-primary/60 transition text-xl"
          disabled={loading}
        >
          {loading ? "Loading..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
