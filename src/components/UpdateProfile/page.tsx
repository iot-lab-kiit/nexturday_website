import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../zustand/UseAuthStore"; // Assuming this path is correct
import axios from "axios";
import { branches, years } from "../../data/data"; // Assuming this path is correct
import ErrorDisplay from "../global/ErrorDisplay"; // Assuming this path is correct
import LoadingSpinner from "../global/LoadingSpinner"; // Assuming this path is correct
import { ShieldCheck, User, Mail, Phone, MessageSquare, Hash, Briefcase, Calendar, AtSign } from 'lucide-react';

interface FormField {
  id: keyof FormDataState;
  type: string;
  placeholder: string;
  validation?: (value: string | number) => string | undefined;
  options?: { value: string | number; label: string }[];
  disabled?: boolean;
  icon?: React.ElementType;
}

interface FormDataState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  whatsappNumber: string;
  countryCodeWhatsapp: string;
  rollNumber: string;
  branch: string;
  studyYear: string | number;
  personalEmail: string;
}

interface OriginalProfileData {
    name: string;
    branch: string;
    phoneNumber: string;
    whatsappNumber: string;
    studyYear: number;
    personalEmail?: string;
    countryCode?: string;
    countryCodeWhatsapp?: string;
}

const ProfileUpdateForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const [formData, setFormData] = useState<FormDataState>({
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
    personalEmail: "",
  });

   const [originalProfileData, setOriginalProfileData] = useState<Partial<OriginalProfileData>>({});
   const [errors, setErrors] = useState<Record<string, string>>({});
   const authData = useAuthStore((state) => state.authData);

  const formFields: FormField[] = [
    {
      id: "firstName",
      type: "text",
      placeholder: "First Name",
      validation: (value) => !String(value).trim() ? "First name is required" : undefined,
      icon: User,
    },
    {
      id: "lastName",
      type: "text",
      placeholder: "Last Name",
      icon: User,
    },
    {
      id: "email",
      type: "email",
      placeholder: "KIIT Email Address",
      disabled: true,
      validation: (value) => {
        if (!String(value).trim()) return "Email is required";
        if (!String(value).endsWith("@kiit.ac.in")) return "Must use KIIT email address";
        return undefined;
      },
      icon: AtSign,
    },
    {
      id: "phone",
      type: "tel",
      placeholder: "Phone Number",
      validation: (value) => {
        if (!String(value).trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(String(value))) return "Enter valid 10-digit phone number";
        return undefined;
      },
      icon: Phone,
    },
    {
      id: "whatsappNumber",
      type: "tel",
      placeholder: "WhatsApp Number",
      validation: (value) => {
         if (String(value).trim() && !/^\d{10}$/.test(String(value))) {
             return "Enter valid 10-digit WhatsApp number or leave blank";
         }
         if (!String(value).trim()) return "WhatsApp number is required";
         if (!/^\d{10}$/.test(String(value))) return "Enter valid 10-digit WhatsApp number";
        return undefined;
      },
      icon: MessageSquare,
    },
     {
      id: "personalEmail",
      type: "email",
      placeholder: "Personal Email Address (Optional)",
      validation: (value) => {
         const emailValue = String(value).trim();
        if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
          return "Enter a valid email address or leave blank";
        }
        return undefined;
      },
      icon: Mail,
    },
    {
      id: "rollNumber",
      type: "text",
      placeholder: "Roll Number",
      disabled: true,
      validation: (value) => !String(value).trim() ? "Roll number is required" : undefined,
      icon: Hash,
    },
    {
      id: "branch",
      type: "select",
      placeholder: "Select Branch",
      validation: (value) => (!value ? "Branch is required" : undefined),
      options: branches,
      icon: Briefcase,
    },
    {
      id: "studyYear",
      type: "select",
      placeholder: "Select Year",
      validation: (value) => (!value ? "Year is required" : undefined),
      options: years.map(y => ({ value: y.value, label: y.label })),
      icon: Calendar,
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authData?.token) {
        setError("Authentication token not found. Please log in.");
        toast.error("Authentication token not found.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/participants`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );

        const userProfile = response.data?.data;

        if (userProfile && userProfile.detail) {
          const fullName = userProfile.detail.name || "";
          const [firstName, ...lastNameParts] = fullName.split(" ");
          const lastName = lastNameParts.join(" ");

          let phoneNum = userProfile.detail.phoneNumber || "";
          let countryCode = "+91";
          const potentialCodes = ["+91", "+1", "+44", "+61"];
          const foundCodePhone = potentialCodes.find(code => phoneNum.startsWith(code));
          if (foundCodePhone) {
              countryCode = foundCodePhone;
              phoneNum = phoneNum.substring(foundCodePhone.length);
          }

          let whatsappNum = userProfile.detail.whatsappNumber || "";
          let countryCodeWhatsapp = "+91";
          const foundCodeWhatsapp = potentialCodes.find(code => whatsappNum.startsWith(code));
          if (foundCodeWhatsapp) {
              countryCodeWhatsapp = foundCodeWhatsapp;
              whatsappNum = whatsappNum.substring(foundCodeWhatsapp.length);
          }

          const fetchedData = {
            firstName: firstName || "",
            lastName: lastName || "",
            email: userProfile.email || authData.email || "",
            rollNumber: userProfile.rollNo || authData.email?.replace("@kiit.ac.in", "") || "",
            phone: phoneNum,
            countryCode: countryCode,
            whatsappNumber: whatsappNum,
            countryCodeWhatsapp: countryCodeWhatsapp,
            branch: userProfile.detail.branch || "",
            studyYear: userProfile.detail.studyYear || "",
            personalEmail: userProfile.detail.personalEmail || "",
          };
          setFormData(fetchedData);

          setOriginalProfileData({
              name: userProfile.detail.name || "",
              branch: userProfile.detail.branch || "",
              phoneNumber: userProfile.detail.phoneNumber || "",
              whatsappNumber: userProfile.detail.whatsappNumber || "",
              studyYear: userProfile.detail.studyYear || 0,
              personalEmail: userProfile.detail.personalEmail || "",
          });

        } else {
             setFormData(prev => ({
                 ...prev,
                 email: authData.email || "",
                 rollNumber: authData.email?.replace("@kiit.ac.in", "") || "",
             }));
             toast.info("Profile data not fully available. Please complete your profile.");
        }

      } catch (err: any) {
        let errorMessage = "Failed to fetch profile data. Please try again later.";

        if (axios.isAxiosError(err) && err.response) {
            if (err.response.data?.success === false && typeof err.response.data.message === 'string') {
                 if (err.response.data.message.toLowerCase().includes("authorization token is required") ||
                     err.response.data.message.toLowerCase().includes("invalid token") ||
                     err.response.status === 401 || err.response.status === 403)
                 {
                    errorMessage = "Authentication failed. Your session might have expired. Please log out and log in again.";
                 } else {
                    errorMessage = err.response.data.message;
                 }
            } else if (typeof err.response.data?.message === 'string') {
                 errorMessage = err.response.data.message;
            } else if (err.response.statusText) {
                 errorMessage = `Error: ${err.response.status} ${err.response.statusText}`;
            }
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);

         setFormData(prev => ({
             ...prev,
             email: authData?.email || prev.email,
             rollNumber: authData?.email?.replace("@kiit.ac.in", "") || prev.rollNumber,
         }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData?.token]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    formFields.forEach((field) => {
      const value = formData[field.id];
      const error = field.validation?.(value);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        countryCode: formData.countryCode,
        countryCodeWhatsapp: formData.countryCodeWhatsapp,
        branch: formData.branch,
        phoneNumber: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        studyYear: Number(formData.studyYear),
        personalEmail: formData.personalEmail || null,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/participants`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      if (response.data.success === true) {
        toast.success("Profile updated successfully!");
        setOriginalProfileData({
             name: `${formData.firstName} ${formData.lastName}`,
             branch: formData.branch,
             phoneNumber: `${formData.countryCode}${formData.phone}`,
             whatsappNumber: `${formData.countryCodeWhatsapp}${formData.whatsappNumber}`,
             studyYear: Number(formData.studyYear),
             personalEmail: formData.personalEmail,
        });
      } else {
         const errorMessage = response.data.message || "Profile update failed. Please try again.";
         setError(errorMessage);
         toast.error(errorMessage);
      }

    } catch (err: any) {
        let errorMessage = "An error occurred during profile update.";

        if (axios.isAxiosError(err) && err.response) {
            if (err.response.data?.success === false && typeof err.response.data.message === 'string') {
                 if (err.response.data.message.toLowerCase().includes("authorization token is required") ||
                     err.response.data.message.toLowerCase().includes("invalid token") ||
                     err.response.status === 401 || err.response.status === 403)
                 {
                    errorMessage = "Authentication failed. Your session might have expired. Please log out and log in again.";
                 } else {
                    errorMessage = err.response.data.message;
                 }
            } else if (typeof err.response.data?.message === 'string') {
                 errorMessage = err.response.data.message;
            } else if (err.response.statusText) {
                 errorMessage = `Error: ${err.response.status} ${err.response.statusText}`;
            }
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

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

   const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>, fieldPrefix: 'phone' | 'whatsappNumber') => {
       const { value } = e.target;
       const id = fieldPrefix === 'phone' ? 'countryCode' : 'countryCodeWhatsapp';
       setFormData(prev => ({ ...prev, [id]: value }));
   };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.id];
    const baseInputClasses = `w-full pl-10 pr-4 py-3 bg-zinc-800/50 border rounded-lg transition-all duration-300 ease-in-out text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60`;
    const borderClasses = hasError ? "border-red-500" : "border-zinc-700 hover:border-zinc-600 focus:border-purple-600";
    const disabledClasses = field.disabled ? "cursor-not-allowed opacity-60 bg-zinc-800/70 border-zinc-800 text-zinc-400" : "";
    const Icon = field.icon;

    const renderInputStructure = (inputElement: React.ReactNode) => (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${hasError ? 'text-red-400' : 'text-zinc-400'}`} />
          </div>
        )}
        {inputElement}
        {hasError && (
          <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors[field.id]}</p>
        )}
      </div>
    );

    if (field.type === "select") {
      return (
        <div key={field.id}>
          {renderInputStructure(
            <select
              id={field.id}
              className={`${baseInputClasses} ${borderClasses} ${disabledClasses} appearance-none ${formData[field.id] ? "text-white" : "text-zinc-500"}`}
              value={formData[field.id]}
              onChange={handleChange}
              disabled={field.disabled || loading}
            >
              <option value="" className="text-zinc-500 bg-zinc-900">
                {field.placeholder}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value} className="text-white bg-zinc-900">
                  {option.label}
                </option>
              ))}
            </select>
          )}
           <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
             <svg className="w-4 h-4 fill-current text-zinc-400" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
           </div>
        </div>
      );
    }

    if (field.id === "phone" || field.id === "whatsappNumber") {
       const isPhone = field.id === "phone";
       const countryCodeId = isPhone ? 'countryCode' : 'countryCodeWhatsapp';
       const countryCodeValue = formData[countryCodeId];
       const numberValue = formData[field.id];

      return (
        <div key={field.id} className="relative">
           <label htmlFor={field.id} className="block text-sm font-medium text-zinc-300 mb-1.5">{field.placeholder}</label>
           <div className="flex items-center gap-0">
             <div className="relative flex-shrink-0">
                 {Icon && (
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                     <Icon className={`h-5 w-5 ${hasError ? 'text-red-400' : 'text-zinc-400'}`} />
                   </div>
                 )}
                <select
                  id={countryCodeId}
                  className={`${baseInputClasses.replace('pl-10','pl-10 pr-2')} ${borderClasses} ${disabledClasses} rounded-r-none border-r-0 appearance-none w-28`}
                  value={countryCodeValue}
                  onChange={(e) => handleCountryCodeChange(e, isPhone ? 'phone' : 'whatsappNumber')}
                  disabled={loading}
                >
                  <option value="+91">+91 IN</option>
                  <option value="+1">+1 US</option>
                  <option value="+44">+44 UK</option>
                  <option value="+61">+61 AU</option>
                </select>
             </div>
             <input
               type={field.type}
               id={field.id}
               className={`${baseInputClasses.replace('pl-10','pl-3')} ${borderClasses} ${disabledClasses} rounded-l-none flex-grow`}
               placeholder="XXXXXXXXXX"
               value={numberValue}
               onChange={handleChange}
               disabled={loading}
               maxLength={10}
             />
           </div>
           {hasError && (
             <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors[field.id]}</p>
           )}
         </div>
      );
    }

    return (
      <div key={field.id} className="relative">
        {field.id !== 'firstName' && field.id !== 'lastName' && (
          <label htmlFor={field.id} className="block text-sm font-medium text-zinc-300 mb-1.5">
            {field.placeholder} {field.disabled ? <span className="text-xs text-zinc-500">(Cannot be changed)</span> : ""}
          </label>
        )}
        {renderInputStructure(
          <input
            type={field.type}
            id={field.id}
            className={`${baseInputClasses} ${borderClasses} ${disabledClasses}`}
            placeholder={field.placeholder}
            value={formData[field.id as keyof FormDataState]}
            onChange={handleChange}
            disabled={field.disabled || loading}
            title={field.disabled ? "This field cannot be edited" : ""}
          />
        )}
      </div>
    );
  };

   const getField = (id: keyof FormDataState) => formFields.find(f => f.id === id);

  if (loading && !formData.email && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !formData.email) {
       return (
           <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white p-4">
               <ErrorDisplay message={`Error loading profile: ${error}`} />
           </div>
       );
  }

  return (
    <div className={`bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white relative overflow-hidden min-h-screen py-16 transition-opacity duration-1000 ease-in ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 opacity-10">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 50V100H50 M50 0V50H100" stroke="%231f2937" strokeWidth="1"></path></pattern></defs><rect width="100%" height="100%" fill="url(%23p)"></rect></svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-zinc-900/60 backdrop-blur-lg border border-zinc-700/50 rounded-xl shadow-2xl shadow-purple-900/10 overflow-hidden">
          <div className="px-8 py-10 md:px-12 md:py-14">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 py-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Update Your Profile
              </h1>
              <p className="text-zinc-400 max-w-2xl mx-auto text-base">
                Keep your information up-to-date. Email and Roll Number cannot be changed.
              </p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-900/40 border border-red-500/60 text-red-300 rounded-lg text-center text-sm flex items-center justify-center gap-2">
                   <ShieldCheck className="h-5 w-5 text-red-400" />
                   <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-purple-300 border-b border-zinc-700 pb-3 flex items-center gap-2">
                  <User className="h-5 w-5"/> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  {renderField(getField("firstName")!)}
                  {renderField(getField("lastName")!)}
                </div>
                 {renderField(getField("personalEmail")!)}
                {renderField(getField("email")!)}
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-purple-300 border-b border-zinc-700 pb-3 flex items-center gap-2">
                   <Phone className="h-5 w-5"/> Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                   {renderField(getField("phone")!)}
                   {renderField(getField("whatsappNumber")!)}
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-purple-300 border-b border-zinc-700 pb-3 flex items-center gap-2">
                   <Briefcase className="h-5 w-5"/> Academic Information
                </h2>
                 {renderField(getField("rollNumber")!)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  {renderField(getField("branch")!)}
                  {renderField(getField("studyYear")!)}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3.5 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                   {loading && (
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                   )}
                  {loading ? "Updating..." : "Save Changes"}
                </button>
                <p className="text-center text-zinc-500 text-xs mt-4">
                  Your profile information will be updated across the platform.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
       <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fadeIn 0.8s ease-out forwards;
            }
            select {
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"></path></svg>');
              background-position: right 0.75rem center;
              background-repeat: no-repeat;
              background-size: 1.25em 1.25em;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
            }
             #countryCode, #countryCodeWhatsapp {
                background-position: right 0.5rem center;
             }
          `}</style>
    </div>
  );
};

export default ProfileUpdateForm;


