export default function ListLoader() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">

            {/* Heading */}
            <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>

            {/* Items */}
            <div className="space-y-4">

                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="flex items-center justify-between border-b pb-3"
                    >
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>

                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                ))}

            </div>

        </div>
    );
}