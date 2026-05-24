import { useEffect, useState } from "react";
import ApiRoutes from "../api/ApiRoutes";
import toast from "react-hot-toast";
import Layout from "@/components/common/Layout";
import Link from "next/link";
import CardLoader from "@/components/loaders/CardLoader";
import ListLoader from "@/components/loaders/ListLoader";

export default function Dashboard() {

    const [summary, setSummary] = useState(null);

    const [financialHealth, setFinancialHealth] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {

        try {

            const lists = new ApiRoutes();

            // fetch summary
            const summaryRes = await lists.getSummary();

            console.log("SUMMARY:", summaryRes.data);

            setSummary(summaryRes.data.data);

            // fetch financial health
            const healthRes =
                await lists.getFinancialHealth();

            console.log(
                "FINANCIAL HEALTH:",
                healthRes.data
            );

            setFinancialHealth(
                healthRes.data.data
            );

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch dashboard"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchDashboardData();

    }, []);

    if (loading) {

        return (
            <Layout>

                <div className="min-h-screen bg-gray-50 p-6">

                    <div className="space-y-8">

                        {/* Top cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                            <CardLoader />
                            <CardLoader />
                            <CardLoader />
                            <CardLoader />

                        </div>

                        {/* Bottom loaders */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <ListLoader />
                            <ListLoader />

                        </div>

                    </div>

                </div>

            </Layout>
        );
    }

    return (
        <Layout>

            <div className="min-h-screen bg-gray-50 p-6">

                <div className="max-w-7xl mx-auto">

                    {/* Top Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Dashboard
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Track your finances easily
                            </p>

                        </div>

                        <Link href={'/transaction/add'} className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:opacity-90 transition">
                            + Add Transaction
                        </Link>

                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Income */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">

                            <p className="text-gray-500 text-sm">
                                Total Income
                            </p>

                            <h2 className="text-3xl font-bold mt-3 text-green-600">
                                ₹{summary?.income || 0}
                            </h2>

                        </div>

                        {/* Expense */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">

                            <p className="text-gray-500 text-sm">
                                Total Expenses
                            </p>

                            <h2 className="text-3xl font-bold mt-3 text-red-500">
                                ₹{summary?.expense || 0}
                            </h2>

                        </div>

                        {/* Savings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">

                            <p className="text-gray-500 text-sm">
                                Savings
                            </p>

                            <h2 className="text-3xl font-bold mt-3">
                                ₹{summary?.savings || 0}
                            </h2>

                            <p className="text-sm text-gray-400 mt-2">
                                Savings Rate:{" "}
                                {summary?.savingsRate || 0}%
                            </p>

                        </div>

                        {/* Financial Score */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">

                            <p className="text-gray-500 text-sm">
                                Financial Health
                            </p>

                            <h2 className="text-3xl font-bold mt-3 text-orange">
                                {financialHealth?.score || 0}
                            </h2>

                            <p className="text-sm text-gray-400 mt-2">
                                {financialHealth?.category}
                            </p>

                        </div>

                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                        {/* Categories */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">

                            <h2 className="text-xl font-semibold mb-5">
                                Categories
                            </h2>

                            <div className="space-y-4">

                                {
                                    summary?.categories &&
                                    Object.entries(
                                        summary.categories
                                    ).map(([key, value]) => (

                                        <div
                                            key={key}
                                            className="flex items-center justify-between border-b pb-3"
                                        >

                                            <p className="font-medium">
                                                {key}
                                            </p>

                                            <p className="text-gray-600">
                                                ₹{value}
                                            </p>

                                        </div>
                                    ))
                                }

                            </div>

                        </div>

                        {/* Suggestions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">

                            <h2 className="text-xl font-semibold mb-5">
                                Suggestions
                            </h2>

                            <div className="space-y-4">

                                {
                                    financialHealth?.suggestions?.length > 0
                                        ? financialHealth.suggestions.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-100 rounded-xl p-4"
                                                >
                                                    <p className="text-gray-700">
                                                        {item}
                                                    </p>
                                                </div>
                                            )
                                        )
                                        : (
                                            <p className="text-gray-500">
                                                No suggestions available
                                            </p>
                                        )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </Layout>
    );
}