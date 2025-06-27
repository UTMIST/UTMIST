"use client";

export default function AdminPage() {
  return (
    <div className="bg-white text-black py-6">
      <div className="max-w-screen-xl mx-auto px-12 lg:px-12">
        <h1 className="text-2xl font-bold mb-2">Project Dashboard</h1>
        <p className="mb-8 text-gray-600">Project management overview</p>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold">12</h2>
            <p className="text-sm text-gray-500">
              Total Tasks
              <br />3 added this week
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold">4</h2>
            <p className="text-sm text-gray-500">
              In Progress
              <br />2 updated today
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold">8</h2>
            <p className="text-sm text-gray-500">
              Completed
              <br />
              Up 24% from last month
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold">5</h2>
            <p className="text-sm text-gray-500">
              Team Members
              <br />
              Active on 3 projects
            </p>
          </div>
        </div>

        {/* Observability Panels */}
        <h2 className="text-xl font-semibold mb-4">Current Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-4 shadow">
            <h3 className="font-bold mb-1">Frontend Redesign</h3>
            <p className="text-sm text-gray-500 mb-2">
              Redesigning the UI components for better user experience
            </p>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-black h-full w-[45%]"></div>
            </div>
            <p className="text-sm mt-1 text-right">45%</p>
          </div>

          <div className="bg-white border rounded-xl p-4 shadow">
            <h3 className="font-bold mb-1">Backend API Development</h3>
            <p className="text-sm text-gray-500 mb-2">
              Building RESTful API endpoints for data management
            </p>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-black h-full w-[68%]"></div>
            </div>
            <p className="text-sm mt-1 text-right">68%</p>
          </div>

          <div className="bg-white border rounded-xl p-4 shadow">
            <h3 className="font-bold mb-1">Documentation Project</h3>
            <p className="text-sm text-gray-500 mb-2">
              Creating comprehensive documentation for developers
            </p>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-black h-full w-[23%]"></div>
            </div>
            <p className="text-sm mt-1 text-right">23%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
