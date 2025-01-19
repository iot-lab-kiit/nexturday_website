import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../zustand/UseAuthStore";
import axios from "axios";
import { branches, years } from "../../data/data";
import ErrorDisplay from "../global/ErrorDisplay";
import LoadingSpinner from "../global/LoadingSpinner";

interface FormField {
  id: string;
  type: string;
  placeholder: string;
  validation?: (value: string) => string | undefined;
  options?: { value: string; label: string }[];
}

const EventRegisterForm = () => {
  const { eventID } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    rollNumber: "",
    branch: "",
    studyYear: "",
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    name: "",
    branch: "",
    phoneNumber: "",
    whatsappNumber: "",
    studyYear: 2,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const authData = useAuthStore((state) => state.authData);

  const formFields: FormField[] = [
    {
      id: "fullName",
      type: "text",
      placeholder: "Full Name",
      validation: (value) =>
        !value.trim() ? "Full name is required" : undefined,
    },
    {
      id: "email",
      type: "email",
      placeholder: "KIIT Email Address",
      validation: (value) => {
        if (!value.trim()) return "Email is required";
        if (!value.endsWith("@kiit.ac.in"))
          return "Must use KIIT email address";
        return undefined;
      },
    },
    {
      id: "phone",
      type: "tel",
      placeholder: "Phone Number",
      validation: (value) => {
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Enter valid 10-digit phone number";
        return undefined;
      },
    },
    {
      id: "whatsappNumber",
      type: "tel",
      placeholder: "WhatsApp Number",
      validation: (value) => {
        if (!value.trim()) return "WhatsApp number is required";
        if (!/^\d{10}$/.test(value))
          return "Enter valid 10-digit WhatsApp number";
        return undefined;
      },
    },
    {
      id: "rollNumber",
      type: "text",
      placeholder: "Roll Number",
      validation: (value) =>
        !value.trim() ? "Roll number is required" : undefined,
    },
    {
      id: "branch",
      type: "select",
      placeholder: "Select Branch",
      validation: (value) => (!value ? "Branch is required" : undefined),
      options: branches,
    },
    {
      id: "studyYear",
      type: "select",
      placeholder: "Select Year",
      validation: (value) => (!value ? "Year is required" : undefined),
      options: years,
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/participants`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData?.token}`,
            },
          }
        );

        console.log(response);
        const {
          data: { data: userProfile },
        } = response;
        console.log("userProfile", userProfile);

        if (
          response.data?.data?.detail ||
          response.data?.data?.rollNo ||
          response.data?.data?.email
        ) {
          setFormData({
            fullName: userProfile?.detail?.name || "",
            email: userProfile?.email || authData?.email || "",
            phone: userProfile?.detail?.phoneNumber || "",
            whatsappNumber: userProfile?.detail?.whatsappNumber || "",
            rollNumber:
              userProfile?.rollNo ||
              authData?.email?.replace("@kiit.ac.in", "") ||
              "",
            branch: userProfile?.detail?.branch || "",
            studyYear: userProfile?.detail?.studyYear || 2,
          });

          setOriginalProfileData({
            name: userProfile?.detail?.name || "",
            branch: userProfile?.detail?.branch || "",
            phoneNumber: userProfile?.detail?.phoneNumber || "",
            whatsappNumber: userProfile?.detail?.whatsappNumber || "",
            studyYear: userProfile?.detail?.studyYear || 2,
          });
          toast.success("Profile data loaded successfully");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch profile";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (authData?.token) {
      fetchUserProfile();
    }
  }, [authData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    formFields.forEach((field) => {
      const error = field.validation?.(
        formData[field.id as keyof typeof formData]
      );
      if (error) newErrors[field.id] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const hasProfileChanges =
        originalProfileData.name !== formData.fullName ||
        originalProfileData.branch !== formData.branch ||
        originalProfileData.phoneNumber !== formData.phone ||
        originalProfileData.whatsappNumber !== formData.whatsappNumber ||
        originalProfileData.studyYear !== Number(formData.studyYear);

      if (hasProfileChanges) {
        const updateProfileApiResponse = await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/participants`,
          {
            name: formData.fullName,
            branch: formData.branch,
            phoneNumber: formData.phone,
            whatsappNumber: formData.whatsappNumber,
            studyYear: Number(formData.studyYear),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData?.token}`,
            },
          }
        );

        console.log(updateProfileApiResponse);
        if (updateProfileApiResponse.data.success === true) {
          toast.success("Profile Data updated successfully");
        }
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/events/participants/${eventID}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      console.log("Response: ", response);

      if (response.data.success === true) {
        toast.success("Registration successful!");
        window.location.href = `/event-details/${eventID}`;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const renderField = (field: FormField) => {
    const baseClassName = `w-full px-4 py-4 bg-black/40 rounded-xl border ${errors[field.id] ? "border-red-500" : "border-zinc-700"
      } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`;

    if (field.type === "select") {
      return (
        <div key={field.id}>
          <select
            id={field.id}
            className={`${baseClassName} ${formData[field.id as keyof typeof formData]
                ? "text-white"
                : "text-zinc-500"
              }`}
            value={formData[field.id as keyof typeof formData]}
            onChange={handleChange}
          >
            <option value="" className="text-zinc-500 bg-zinc-900">
              {field.placeholder}
            </option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-white bg-zinc-900"
              >
                {option.label}
              </option>
            ))}
          </select>
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
          )}
        </div>
      );
    }

    if (field.id === "email" || field.id === "rollNumber") {
      return (
        <div key={field.id}>
          <input
            type={field.type}
            id={field.id}
            className={`${baseClassName} cursor-not-allowed opacity-50 bg-zinc-800/50 border-zinc-800 text-zinc-400`}
            placeholder={field.placeholder}
            value={formData[field.id as keyof typeof formData]}
            onChange={handleChange}
            disabled
            title="This field cannot be edited"
          />
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
          )}
        </div>
      );
    }

    return (
      <div key={field.id}>
        <input
          type={field.type}
          id={field.id}
          className={baseClassName}
          placeholder={field.placeholder}
          value={formData[field.id as keyof typeof formData]}
          onChange={handleChange}
        />
        {errors[field.id] && (
          <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="bg-black text-white relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(40,3,53,0.7),transparent_50%)]" />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 py-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Event Registration
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Fill in your details below to secure your spot at the event.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Personal Information
              </h2>
              <div className="space-y-6">
                {renderField(formFields[0])}
                {renderField(formFields[1])}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField(formFields[2])}
                {renderField(formFields[3])}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Academic Information
              </h2>
              <div className="space-y-6">
                {renderField(formFields[4])}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField(formFields[5])}
                  {renderField(formFields[6])}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] hover:shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Complete Registration"}
              </button>
              <p className="text-center text-zinc-500 text-sm mt-4">
                By registering, you agree to our terms and conditions
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegisterForm;
