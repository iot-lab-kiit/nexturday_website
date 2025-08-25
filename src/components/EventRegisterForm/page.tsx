import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../zustand/UseAuthStore.tsx";
import { useEventStore } from "../../zustand/useEventStore.tsx";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedProfile = useRef(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    whatsappNumber: "",
    countryCodeWhatsapp: "+91",
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
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const currentEvent = useEventStore((state) => state.currentEvent);

  // Autofill academic info from auth store (removed duplicate useEffect)
  useEffect(() => {
    if (authData?.branch) {
      setFormData((prev) => ({
        ...prev,
        branch: authData.branch || prev.branch,
        studyYear: authData.studyYear || prev.studyYear,
      }));
    }
  }, [authData?.branch, authData?.studyYear]);

  // Autofill email and extract roll number from email
  useEffect(() => {
    if (authData?.email && authData.email.endsWith('@kiit.ac.in')) {
      // Extract roll number from email (e.g., 2306124@kiit.ac.in -> 2306124)
      const rollNumber = authData.email.split('@')[0];
      
      setFormData((prev) => ({
        ...prev,
        email: authData.email || prev.email,
        rollNumber: rollNumber || prev.rollNumber,
      }));
    }
  }, [authData?.email]);

  const formFields: FormField[] = [
    {
      id: "firstName",
      type: "text",
      placeholder: "First Name",
      validation: (value) =>
        !value.trim() ? "First name is required" : undefined,
    },
    {
      id: "lastName",
      type: "text",
      placeholder: "Last Name",
      validation: (value) =>
        !value.trim() ? "Last name is required" : undefined,
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

        const {
          data: { data: userProfile },
        } = response;

        if (
          response.data?.data?.detail ||
          response.data?.data?.rollNo ||
          response.data?.data?.email
        ) {
          const fullName = userProfile?.detail?.name || "";
          const [firstName, lastName] = fullName.split(" ");
          const apiEmail = userProfile?.email || authData?.email || "";
          let apiRollNumber = userProfile?.rollNo || "";
          
          // If roll number is not provided but email contains KIIT email, extract roll number from email
          if (!apiRollNumber && apiEmail && apiEmail.endsWith('@kiit.ac.in')) {
            apiRollNumber = apiEmail.split('@')[0];
          }

          const fetchedBranch = userProfile?.detail?.branch || "";
          const fetchedYear = userProfile?.detail?.studyYear?.toString() || "";
          setFormData((prev) => ({
            ...prev,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            email: apiEmail || prev.email,
            rollNumber: apiRollNumber || prev.rollNumber,
            phone: userProfile?.detail?.phoneNumber || prev.phone,
            countryCode: "+91",
            whatsappNumber:
              userProfile?.detail?.whatsappNumber || prev.whatsappNumber,
            countryCodeWhatsapp: "+91",
            branch: fetchedBranch,
            studyYear: fetchedYear,
          }));

          setOriginalProfileData({
            name: userProfile?.detail?.name || "",
            branch: fetchedBranch,
            phoneNumber: userProfile?.detail?.phoneNumber || "",
            whatsappNumber: userProfile?.detail?.whatsappNumber || "",
            studyYear: Number(fetchedYear) || 2,
          });
          // store academic info in auth store
          setAuthData({
            ...authData,
            branch: fetchedBranch,
            studyYear: fetchedYear,
          });
          toast.success("Profile data loaded successfully");
          hasFetchedProfile.current = true;
        }
      } catch (error) {
        let message = "Failed to fetch profile";
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          message = error.response.data.message;
        }
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (authData?.token && !hasFetchedProfile.current) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData?.token]); // Only depend on token to prevent infinite loop

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
        originalProfileData.name !==
          `${formData.firstName} ${formData.lastName}` ||
        originalProfileData.branch !== formData.branch ||
        originalProfileData.phoneNumber !== formData.phone ||
        originalProfileData.whatsappNumber !== formData.whatsappNumber ||
        originalProfileData.studyYear !== Number(formData.studyYear);

      if (hasProfileChanges) {
        const updateProfileApiResponse = await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/participants`,
          {
            firstname: formData.firstName,
            lastname: formData.lastName,
            branch: formData.branch,
            countryCode: formData.countryCode,
            phoneNumber: formData.phone,
            whatsappNumber: formData.whatsappNumber,
            countryCodeWhatsapp: formData.countryCodeWhatsapp,
            studyYear: Number(formData.studyYear),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData?.token}`,
            },
          }
        );

        if (updateProfileApiResponse.data.success === true) {
          toast.success("Profile Data updated successfully");
        }
      }

      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/events/participants/team/create/${eventID}`,
        { ...formData, fullName: `${formData.firstName} ${formData.lastName}` },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      if (response.data.success === true) {
        // For paid events, redirect to payment page instead of storing teamId immediately
        if (currentEvent?.paid) {
          toast.success(
            "Team created! Please complete payment to activate your team."
          );
          navigate(`/event-details/${eventID}/payments`);
        } else {
          // For free events, store teamId and go to team dashboard
          if (response.data.data?.teamId) {
            setAuthData({
              ...authData,
              teamId: response.data.data.teamId,
            });
          }
          toast.success("Registration successful!");
          navigate(`/event-details/${eventID}/teamsDashboard`);
        }
      }
    } catch (error) {
      let message = "Registration failed";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      setError(message);
      toast.error(message);
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
    // Safety check to prevent accessing undefined field
    if (!field) {
      console.error("renderField called with undefined field");
      return null;
    }

    const baseClassName = `w-full px-4 py-4 bg-black/40 rounded-xl border ${
      errors[field.id] ? "border-red-500" : "border-zinc-700"
    } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white`;

    if (field.type === "select") {
      return (
        <div key={field.id}>
          <select
            id={field.id}
            className={`${baseClassName} ${
              formData[field.id as keyof typeof formData]
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

    if (field.id === "phone") {
      return (
        <div key={field.id} className="grid grid-cols-3 gap-2">
          <select
            id="countryCode"
            className={`${baseClassName} col-span-1`}
            value={formData.countryCode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, countryCode: e.target.value }))
            }
          >
            <option value="+91">+91 (IN)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
          </select>
          <input
            type={field.type}
            id={field.id}
            className={`${baseClassName} col-span-2`}
            placeholder={field.placeholder}
            value={formData[field.id as keyof typeof formData]}
            onChange={handleChange}
          />
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1 col-span-3">
              {errors[field.id]}
            </p>
          )}
        </div>
      );
    }

    if (field.id === "whatsappNumber") {
      return (
        <div key={field.id} className="grid grid-cols-3 gap-2">
          <select
            id="countryCodeWhatsapp"
            className={`${baseClassName} col-span-1`}
            value={formData.countryCodeWhatsapp}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                countryCodeWhatsapp: e.target.value,
              }))
            }
          >
            <option value="+91">+91 (IN)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
          </select>
          <input
            type={field.type}
            id={field.id}
            className={`${baseClassName} col-span-2`}
            placeholder={field.placeholder}
            value={formData[field.id as keyof typeof formData]}
            onChange={handleChange}
          />
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1 col-span-3">
              {errors[field.id]}
            </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField(formFields[0])}
                {renderField(formFields[1])}
              </div>
              {renderField(formFields[2])}
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField(formFields[3])}
                {renderField(formFields[4])}
              </div>
              <div className="px-1 flex items-center py-2">
                <input
                  type="checkbox"
                  id="sameAsPhone"
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      whatsappNumber: formData.phone,
                      countryCodeWhatsapp: formData.countryCode,
                    }))
                  }
                  className="accent-purple-400 cursor-pointer h-4 w-4"
                />
                <label
                  htmlFor="sameAsPhone"
                  className="text-sm ml-2 text-gray-400"
                >
                  Same as Phone Number
                </label>
              </div>
              {/* Removed extra country code field; only phone and WhatsApp in contact */}
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Academic Information
              </h2>
              <div className="space-y-6">
                {renderField(formFields[5])}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField(formFields[6])}
                  {renderField(formFields[7])}
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
