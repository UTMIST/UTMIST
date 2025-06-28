import Link from "next/link";

const StartupsSection = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-16">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        MISTic R&D
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                        Building an AI startup? Join MISTic R&D, the incubator where ambitious founders find funding, users, cofounders, and an unstoppable community of builders. Let&apos;s turn your idea into impact.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Funding</h3>
                        <p className="text-gray-600">Access to capital and investment opportunities to scale your AI startup</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Users</h3>
                        <p className="text-gray-600">Connect with early adopters and build your user base through our network</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cofounders</h3>
                        <p className="text-gray-600">Find the perfect cofounder to complement your skills and vision</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                        <p className="text-gray-600">Join an unstoppable community of builders and innovators</p>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="text-center shadow-lg">
                    <div className="bg-white shadow-lg border border-blue-100 rounded-2xl p-6 md:p-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Ready to Build the Future?
                        </h3>
                        <p className="text-lg md:text-xl mb-8 opacity-90">
                            Join MISTic R&D and turn your AI idea into a world-changing startup
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/careers" 
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300"
                            >
                                Apply Now
                            </Link>
                            <Link 
                                href="/startups" 
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StartupsSection;