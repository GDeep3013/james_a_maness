import React, { useState, useEffect } from "react";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { profileService } from "../../services/profileService";
import { User } from "../../types/UserTypes";
export default function UserInfoCard({ user }: { user: User | null }) {
    const { isOpen, openModal, closeModal } = useModal();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    useEffect(() => {
        if (user) {
            const nameParts = user.name?.split(" ") || [];
            setFormData({
                first_name: nameParts[0] || "",
                last_name: nameParts.slice(1).join(" ") || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
                confirm_password: "",
            });
        }
    }, [user]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        if (successMessage) {
            setSuccessMessage("");
        }
    };
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.first_name?.trim()) {
            newErrors.first_name = "First name is required";
        }
        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (formData.password || formData.confirm_password) {
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }

            if (!formData.confirm_password) {
                newErrors.confirm_password = "Confirm password is required";
            } else if (formData.password !== formData.confirm_password) {
                newErrors.confirm_password = "Passwords do not match";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage("");
        try {
            const updateData: {
                first_name: string;
                last_name?: string;
                email: string;
                phone?: string;
                password?: string;
                confirm_password?: string;
            } = {
                first_name: formData.first_name,
                email: formData.email,
            };

            if (formData.last_name) {
                updateData.last_name = formData.last_name;
            }

            if (formData.phone) {
                updateData.phone = formData.phone;
            }
            if (formData.password && formData.confirm_password) {
                updateData.password = formData.password;
                updateData.confirm_password = formData.confirm_password;
            }
            const response = await profileService.update(updateData);
            if (response.data?.status === true) {
                setSuccessMessage("Profile updated successfully!");
                setTimeout(() => {
                    closeModal();
                    window.location.reload();
                }, 1000);
            } else {
                setErrors({ general: response.data?.message || "Failed to update profile. Please try again." });
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string; error?: string } } };
            if (err.response?.data?.errors) {
                const validationErrors: Record<string, string> = {};
                Object.keys(err.response.data.errors).forEach((key) => {
                    const errorMessages = err.response?.data?.errors?.[key];
                    if (errorMessages && errorMessages.length > 0) {
                        validationErrors[key] = errorMessages[0];
                    }
                });
                setErrors(validationErrors);
            } else {
                setErrors({
                    general: err.response?.data?.message ||
                        err.response?.data?.error ||
                        "An error occurred while upd ating the profile. Please try again."
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (<>

        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-lg font-semibold  lg:mb-6">
                        Personal Information
                    </h4>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                First Name
                            </p>
                            <p className="text-sm font-medium ">
                                {user?.name.split(" ")[0]}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Last Name
                            </p>
                            <p className="text-sm font-medium ">
                                {user?.name.split(" ")[1]}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Email address
                            </p>
                            <p className="text-sm font-medium ">
                                {user?.email}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Phone
                            </p>
                            <p className="text-sm font-medium ">
                                {user?.phone}
                            </p>
                        </div>

                    </div>
                </div>
                <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                >
                    <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill=""
                        />
                    </svg>
                    Edit
                </button>
            </div>
        </div>
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-6">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit Personal Information
                    </h4>
                    <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Update your details to keep your profile up-to-date.
                    </p>
                </div>
                <form className="flex flex-col" onSubmit={handleSave}>
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
                        {errors.general && (
                            <div className="mb-4 p-3 text-sm text-error-500 bg-error-50 border border-error-200 rounded">
                                {errors.general}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 p-3 text-sm text-success-500 bg-success-50 border border-success-200 rounded">
                                {successMessage}
                            </div>
                        )}

                        <div className="">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>First Name</Label>
                                    <Input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        error={!!errors.first_name}
                                        hint={errors.first_name}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Last Name</Label>
                                    <Input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        error={!!errors.last_name}
                                        hint={errors.last_name}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        hint={errors.email}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Phone</Label>
                                    <Input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        error={!!errors.phone}
                                        hint={errors.phone}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1 relative">
                                    <Label>Password</Label>

                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter new password"
                                        error={!!errors.password}
                                        hint={errors.password}
                                    />

                                    <img
                                        className="absolute right-3 top-[38px] w-5 cursor-pointer"
                                        src={
                                            showPassword
                                                ? "/assets/img/hide-password.svg"
                                                : "/assets/img/password-eys.svg"
                                        }
                                        alt="toggle password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1 relative">
                                    <Label>Confirm Password</Label>

                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleInputChange}
                                        error={!!errors.confirm_password}
                                        hint={errors.confirm_password}
                                    />

                                    <img
                                        className="absolute right-3 top-[38px] w-5 cursor-pointer"
                                        src={
                                            showConfirmPassword
                                                ? "/assets/img/hide-password.svg"
                                                : "/assets/img/password-eys.svg"
                                        }
                                        alt="toggle confirm password"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                    />
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={closeModal}
                            type="button"
                            disabled={isSubmitting}
                        >
                            Close
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    </>
    );
}
