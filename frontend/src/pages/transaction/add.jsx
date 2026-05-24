import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ApiRoutes from "../api/ApiRoutes";

export default function AddTransaction() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        date: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {

        if (!formData.category.trim()) {
            toast.error("Category is required");
            return false;
        }

        if (!formData.amount) {
            toast.error("Amount is required");
            return false;
        }

        if (Number(formData.amount) <= 0) {
            toast.error("Amount must be greater than 0");
            return false;
        }

        if (!formData.date) {
            toast.error("Date is required");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const lists = new ApiRoutes();

        const response = lists.addTransaction({
            type: formData.type,
            category: formData.category,
            amount: Number(formData.amount),
            description: formData.description,
            date: formData.date,
        });

        response
            .then((res) => {

                console.log(res.data);

                toast.success("Transaction added");

                router.push("/dashboard");
            })

            .catch((error) => {

                console.log(error);

                toast.error(
                    error?.response?.data?.message ||
                    "Something went wrong"
                );
            })

            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Add Transaction
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Track your income and expenses
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Type */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Type
                        </label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        >
                            <option value="expense">
                                Expense
                            </option>

                            <option value="income">
                                Income
                            </option>

                        </select>

                    </div>

                    {/* Category */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            placeholder="Food, Salary, Travel..."
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        />

                    </div>

                    {/* Amount */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Amount
                        </label>

                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        />

                    </div>

                    {/* Date */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Date
                        </label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        />

                    </div>

                    {/* Description */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Optional description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        {loading
                            ? "Adding..."
                            : "Add Transaction"}
                    </button>

                </form>

            </div>

        </div>
    );
}