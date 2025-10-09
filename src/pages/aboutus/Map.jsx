import React from "react";

const BarangayOfficials = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Barangay Officials Section */}
      <section className="py-10 px-6 md:px-16">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
          Barangay Officials
        </h1>

        {/* Officials Grid */}
        <div className="grid md:grid-cols-3 gap-6 justify-items-center">
          {/* Example official */}
          <div className="bg-white shadow-md border border-gray-200 rounded-lg w-64 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="font-semibold text-gray-800">Rodrigo Santos</h2>
            <p className="text-sm text-gray-500">Barangay Captain</p>
          </div>

          {/* Add the rest of your officials here */}
        </div>
      </section>

      {/* Barangay Map Section */}
      <section className="mt-16 px-6 md:px-16 pb-16">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Barangay Talipapa Location
        </h2>
        <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-lg border border-gray-300">
          <iframe
            title="Barangay Talipapa Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.271108021972!2d121.02661787437261!3d14.736494774644235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b1b9d3eb5c37%3A0x9b5a22bcb2df4b77!2sBarangay%20Talipapa%2C%20Quezon%20City!5e0!3m2!1sen!2sph!4v1696831263451!5m2!1sen!2sph"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default BarangayOfficials;
