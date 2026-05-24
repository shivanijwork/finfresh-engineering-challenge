import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ApiRoutes from "../api/ApiRoutes";

export default function Register() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // validation
    const validate = () => {

        if (!formData.name.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }

        // email validation
        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            toast.error("Invalid email");
            return false;
        }

        if (!formData.password) {
            toast.error("Password is required");
            return false;
        }

        if (formData.password.length < 6) {
            toast.error(
                "Password must be at least 6 characters"
            );
            return false;
        }

        return true;
    };

    // submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const lists = new ApiRoutes();

        const response = lists.register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });

        response
            .then((res) => {

                console.log("REGISTER:", res.data);

                // save token
                localStorage.setItem(
                    "token",
                    res.data.token
                );

                toast.success(
                    "Registered successfully"
                );

                router.push("/login");
            })

            .catch((error) => {

                console.log(error);

                toast.error(
                    error?.response?.data?.message ||
                    "Registration failed"
                );
            })

            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Heading */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-orange">
                        FinFresh
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create your account
                    </p>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>

                {/* Login redirect */}
                <p className="text-center text-sm text-gray-500 mt-6">

                    Already have an account?{" "}

                    <span
                        onClick={() =>
                            router.push("/login")
                        }
                        className="text-orange cursor-pointer font-semibold"
                    >
                        Login
                    </span>

                </p>

            </div>
        </div>
    );
}