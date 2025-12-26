import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(form.email, form.password);
        if (!error) toast({ title: "✅ Signed in successfully!" });
      } else {
        const { error } = await signUp(form.email, form.password, {
          data: {
            username: form.username,
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${form.username}`,
          },
        });
        if (!error) {
          toast({
            title: "📩 Check your email to confirm your account!",
          });
        }
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative">
      {/* 🌿 Animated Light Green Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "300% 300%" }}
      />

      {/* 🧊 Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative w-full max-w-md
          bg-white/30 backdrop-blur-2xl
          border border-white/40
          rounded-3xl
          shadow-[0_20px_60px_rgba(16,185,129,0.35)]
          p-6 sm:p-8 text-gray-900
        "
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Chat App 💬</h1>
          <p className="text-gray-700 text-sm mt-1">
            Chat with love, connect with hearts 💚
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="username"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1"
              >
                <Label>Username</Label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="
                    bg-white/50 border-white/60
                    placeholder:text-gray-500
                    focus:ring-2 focus:ring-emerald-400
                  "
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="
                bg-white/50 border-white/60
                placeholder:text-gray-500
                focus:ring-2 focus:ring-teal-400
              "
              required
            />
          </div>

          <div className="space-y-1 relative">
            <Label>Password</Label>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="
                bg-white/50 border-white/60
                placeholder:text-gray-500
                focus:ring-2 focus:ring-green-400
              "
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* 🌱 Animated Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
              shadow-lg hover:shadow-emerald-500/50 transition-all
            "
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6 text-sm text-gray-700">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-emerald-600 underline underline-offset-4"
          >
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600">
          Made with ❤️ by{" "}
          <span
            onClick={() =>
              window.open("https://www.thedevstechnologies.online", "_blank")
            }
            className="cursor-pointer font-semibold text-emerald-600 hover:underline"
          >
            TheDevsTechnologies
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
