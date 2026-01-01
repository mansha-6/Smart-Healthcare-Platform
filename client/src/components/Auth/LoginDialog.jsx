import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/Button';
import { loginUser } from '../../api/authApi'; // Assuming authApi exists
import { useAuth } from '../../context/AuthContext';

export default function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Assuming useAuth exists

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      // store token, update auth context
      login(res.data.user, res.data.token);
      localStorage.setItem("token", res.data.token);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-sky-600">Login</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg z-50 focus:outline-none"
          aria-label="Login"
        >
          <Dialog.Title className="text-xl font-semibold mb-2">Sign in</Dialog.Title>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-600">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </label>

            <div className="flex items-center justify-end space-x-2">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded-md border hover:bg-gray-50">Cancel</button>
              </Dialog.Close>
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
