import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    roll: '',
    branch: '',
    year: ''
  });
  const [emailError, setEmailError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    setFormData({ ...formData, [id]: value });
    if (id === "email") {
      if (!value.endsWith("@kiit.ac.in")) {
        setEmailError("Email must be a KIIT email ID");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSelectChanges = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.currentTarget;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8"
    style={{
      background: `
        radial-gradient(78.04% 121.39% at 91.04% 12.83%, rgba(40, 3, 53, 0.87) 0%, rgba(41, 41, 41, 0.26) 100%),
        radial-gradient(68.46% 198.58% at -18.46% 107.11%, #05537D 0%, rgba(0, 0, 0, 0) 100%)
      `,
      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
    }}
    >
      <div className="p-6 sm:p-10 rounded-lg shadow-lg max-w-4xl w-full  text-white">
        <h1 className="text-center mb-6 sm:mb-10 font-medium font-bitter md:text-5xl text-2xl sm:text-5xl lg:text-6xl">
          Registration Form
        </h1>

    
              {/* Personal Info */}
              <div className="flex my-3 gap-4">
                <input
                  className="w-full px-4 py-4 bg-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  id="first_name"
                  required
                  placeholder="First Name"
                  onChange={handleChange}
                />
                <input
                  className="w-full px-4 py-4 bg-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  id="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div className="my-3">
                <input
                  className="w-full px-4  py-4 bg-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  id="email"
                  required
                  placeholder="KIIT Email ID"
                  value={formData.email}
                  onChange={handleChange}
                />
                {emailError && (
                  <p className="text-red-500 text-sm my-2 mt-4 md:mx-4">
                    {emailError}
                  </p>
                )}
              </div>
              <div className="flex my-3 gap-4">
                <input
                  className="w-full px-4 py-4 bg-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  maxLength={10}
                  id="phone"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

              

              {/* Roll Number */}
              <div className="flex my-3 gap-4">
                <input
                  className="w-full px-4 py-4 bg-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  id="roll"
                  required
                  placeholder="Roll Number"
                  value={formData.roll}
                  onChange={handleChange}
                />

                {/* Branch */}
                <div className="w-full px-4 bg-[#171717] rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-outline:none">
                  <select
                    className={`w-full h-full bg-[#171717] focus:outline-none ${
                      !formData.branch && "text-gray-400"
                    }`}
                    id="branch"
                    required
                    value={formData.branch}
                    onChange={handleSelectChanges}
                  >
                    <option value="" disabled>
                      Select Branch
                    </option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="CSSE">CSSE</option>
                    <option value="CSCE">CSCE</option>
                    <option value="CE">CE</option>
                    <option value="MME">MME</option>
                    <option value="MCA">MCA</option>
                    <option value="MTech">MTech</option>
                    <option value="ECSE">ECSE</option>
                    <option value="ETC">ETC</option>
                    <option value="EEE">EEE</option>
                    <option value="ECE">ECE</option>
                    <option value="MBA">MBA</option>
                    <option value="ME">ME</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
              </div>

              {/* Year */}
              <div className="w-full px-4 mb-3 lg:mb-0 bg-[#171717] rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-outline:none">
                <select
                  className={`w-full py-4 h-full bg-[#171717] focus:outline-none ${
                    !formData.year && "text-gray-400"
                  }`}
                  id="year"
                  value={formData.year}
                  required
                  onChange={handleSelectChanges}
                >
                  <option value="" disabled>
                    Select your year
                  </option>
                  {formData.branch === "MCA" && (
                    <option value="1">1st Year</option>
                  )}
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div
                className="block relative w-[11rem] mx-auto my-8"
                onMouseEnter={() => {
                  setIsHovered(!isHovered);
                }}
                onMouseLeave={() => {
                  setIsHovered(!isHovered);
                }}
              >
               
         
      </div>
    </div>
    </div>
  );
};


export default Page