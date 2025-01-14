import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../zustand/useAuthStore";
import axios from "axios";

interface FormField {
  id: string;
  type: string;
  placeholder: string;
  validation?: (value: string) => string | undefined;
  options?: { value: string; label: string }[];
}

const EventRegisterForm = () => {
  const { eventID } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rollNumber: "",
    branch: "",
    year: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const authData = useAuthStore((state) => state.authData);
  const branches = [
    { value: "CSE", label: "CSE" },
    { value: "IT", label: "IT" },
    { value: "CSSE", label: "CSSE" },
    { value: "CSCE", label: "CSCE" },
    { value: "ECE", label: "ECE" },
    { value: "ECS", label: "ECS" },
    { value: "EEE", label: "EEE" },
    { value: "ME", label: "ME" },
    { value: "CIVIL", label: "Civil" },
  ];

  const years = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
  ];

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
      id: "year",
      type: "select",
      placeholder: "Select Year",
      validation: (value) => (!value ? "Year is required" : undefined),
      options: years,
    },
  ];

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

    const formElement = e.target as HTMLFormElement;
    const newFormData = {
      firstName: formElement.firstName.value,
      lastName: formElement.lastName.value,
      email: formElement.email.value,
      phone: formElement.phone.value,
      rollNumber: formElement.rollNumber.value,
      branch: formElement.branch.value,
      year: formElement.year.value,
    };

    setFormData(newFormData);

    if (validateForm()) {
      toast.success("Registration successful!");
      console.log(newFormData);
    }
    try {
      await axios.post(
        `https://nexterday.iotkiit.in/api/participants`,
        {
          name: `${newFormData.firstName} ${newFormData.lastName}`,
          branch: newFormData.branch,
          phoneNumber: newFormData.phone,
          whatsappNumber: newFormData.phone,
          studyYear: newFormData.year,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    console.log(eventID, "TEST");
    const response = await axios.post(
      `https://nexterday.iotkiit.in/api/events/participants/${eventID}`,
      {
        // ...existing data...
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
      }
    );

    console.log(response.data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      console.log(eventID);
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const renderField = (field: FormField) => {
    const baseClassName = `w-full px-4 py-4 bg-black/40 rounded-xl border ${
      errors[field.id] ? "border-red-500" : "border-zinc-700"
    } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`;

    if (field.type === "select") {
      return (
        <div key={field.id}>
          <select
            id={field.id}
            className={`${baseClassName} ${
              formData[field.id as keyof typeof formData]
                ? "bg-purple-500"
                : "bg-black"
            } [&>option:checked]:bg-purple-500`}
            value={formData[field.id as keyof typeof formData]}
            onChange={handleChange}
          >
            <option value="" className="text-white bg-black">
              {field.placeholder}
            </option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-purple-500 text-white"
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

  return (
    <div className="bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(40,3,53,0.7),transparent_50%)]" />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 py-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Event Registration
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Fill in your details below to secure your spot at the event. All
              fields are required.
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
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Academic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField(formFields[5])}
                {renderField(formFields[6])}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] hover:shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Registration
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
