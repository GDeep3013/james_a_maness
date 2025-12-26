import React, { useState, useEffect } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Input from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import Button from '../../components/ui/button/Button';
import FileInput from '../../components/form/input/FileInput';
import TextArea from '../../components/form/input/TextArea';
import { settingsService } from '../../services/settingsService';

interface SettingsData {
  logo_image: File | string | null;
  company_name: string;
  phone_number: string;
  address: string;
  state: string;
  city: string;
  country: string;
  post_code: string;
  primary_email: string;
  cc_emails: string;
}

export default function Settings() {
  const [formData, setFormData] = useState<SettingsData>({
    logo_image: null,
    company_name: '',
    phone_number: '',
    address: '',
    state: '',
    city: '',
    country: '',
    post_code: '',
    primary_email: '',
    cc_emails: '',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsService.get();
      if (response.data?.status && response.data?.data) {
        const settings = response.data.data;
        setFormData({
          logo_image: null,
          company_name: settings.company_name || '',
          phone_number: settings.phone_number || '',
          address: settings.address || '',
          state: settings.state || '',
          city: settings.city || '',
          country: settings.country || '',
          post_code: settings.post_code || '',
          primary_email: settings.primary_email || '',
          cc_emails: Array.isArray(settings.cc_emails) 
            ? settings.cc_emails.join(', ') 
            : settings.cc_emails || '',
        });
        if (settings.logo_image) {
          setLogoPreview(settings.logo_image);
        } else {
          setLogoPreview(null);
        }
      }
    } catch {
      setGeneralError('Failed to load settings');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setSuccessMessage('');
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (errors.logo_image) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.logo_image;
        return newErrors;
      });

    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.primary_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primary_email)) {
      newErrors.primary_email = 'Please enter a valid email address';
    }

    if (formData.cc_emails) {
      const emails = formData.cc_emails.split(',').map(email => email.trim()).filter(email => email);
      const invalidEmails = emails.filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      if (invalidEmails.length > 0) {
        newErrors.cc_emails = 'Please enter valid email addresses separated by commas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const ccEmailsArray = formData.cc_emails
        ? formData.cc_emails.split(',').map(email => email.trim()).filter(email => email)
        : [];

      const settingsData = {
        company_name: formData.company_name,
        phone_number: formData.phone_number,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        country: formData.country,
        post_code: formData.post_code,
        primary_email: formData.primary_email,
        cc_emails: ccEmailsArray.length > 0 ? ccEmailsArray : undefined,
        logo_image: formData.logo_image instanceof File ? formData.logo_image : undefined,
      };

      if (formData.logo_image instanceof File) {
        settingsData.logo_image = formData.logo_image;
      }


      const response = await settingsService.update(settingsData);

      if (response.data?.status === true || response.status === 200 || response.status === 201) {
        setSuccessMessage('Settings saved successfully!');
        
        if (response.data?.data?.logo_image) {
          setLogoPreview(response.data.data.logo_image);
        }
        
        setFormData(prev => ({
          ...prev,
          logo_image: null
        }));
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setGeneralError(response.data?.message || 'Failed to save settings. Please try again.');
      }
    } catch (error: unknown) {
      const err = error as { 
        response?: { 
          data?: { 
            errors?: Record<string, string[]>; 
            error?: Record<string, string[]> | string;
            message?: string; 
          } 
        } 
      };
      
      const validationErrors: Record<string, string> = {};
      let hasFieldErrors = false;

      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach((key) => {
          const errorMessages = err.response?.data?.errors?.[key];
          if (errorMessages && Array.isArray(errorMessages) && errorMessages.length > 0) {
            validationErrors[key] = errorMessages[0];
            hasFieldErrors = true;
          } else if (typeof errorMessages === 'string') {
            validationErrors[key] = errorMessages;
            hasFieldErrors = true;
          }
        });
      }

      if (err.response?.data?.error) {
        const errorData = err.response.data.error;
        if (typeof errorData === 'object' && !Array.isArray(errorData)) {
          Object.keys(errorData).forEach((key) => {
            const errorMessages = errorData[key];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              validationErrors[key] = errorMessages[0];
              hasFieldErrors = true;
            } else if (typeof errorMessages === 'string') {
              validationErrors[key] = errorMessages;
              hasFieldErrors = true;
            }
          });
        }
      }

      if (hasFieldErrors) {
        setErrors(validationErrors);
        setGeneralError('');
      } else {
        setErrors({});
        setGeneralError(
          err.response?.data?.message ||
          (typeof err.response?.data?.error === 'string' ? err.response.data.error : '') ||
          'An error occurred while saving settings. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Settings" />
      <div className='w-full max-w-5xl mx-auto'>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Settings
            </h3>

            {generalError && (
            <div className="mb-4 p-3 text-sm text-error-500 bg-error-50 border border-error-200 rounded">
                {generalError}
            </div>
            )}

            {successMessage && (
            <div className="mb-4 p-3 text-sm text-success-500 bg-success-50 border border-success-200 rounded">
                {successMessage}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                      <div className="flex items-start">
                      <Label htmlFor="logo_image" className="pt-2">
                          Logo Image
                      </Label>
                      </div>
                      <div>
                      {logoPreview && (
                          <div className="mb-4">
                          <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-20 w-auto object-contain rounded border border-gray-200 dark:border-gray-700"
                          />
                          </div>
                      )}
                      <FileInput
                          accept="image/*"
                          onChange={handleFileChange}
                          className={errors.logo_image ? 'border-error-500' : ''}
                      />
                      {errors.logo_image && (
                          <p className="mt-1 text-xs text-error-500">{errors.logo_image}</p>
                      )}
                      </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="mb-4 text-sm md:text-base font-semibold text-gray-800 dark:text-white/90">
                    Company Information
                </h4>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="company_name" className="pt-2">
                        Company Name
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="text"
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        error={!!errors.company_name}
                        hint={errors.company_name}
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="phone_number" className="pt-2">
                        Phone Number
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        error={!!errors.phone_number}
                        hint={errors.phone_number}
                        />
                    </div>
                    </div>
                </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="mb-4 text-sm md:text-base font-semibold text-gray-800 dark:text-white/90">
                    Address Information
                </h4>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="address" className="pt-2">
                        Address
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter address"
                        error={!!errors.address}
                        hint={errors.address}
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="state" className="pt-2">
                        State
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        error={!!errors.state}
                        hint={errors.state}
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="city" className="pt-2">
                        City
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        error={!!errors.city}
                        hint={errors.city}
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="country" className="pt-2">
                        Country
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                        error={!!errors.country}
                        hint={errors.country}
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="post_code" className="pt-2">
                        Post Code
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="text"
                        id="post_code"
                        name="post_code"
                        value={formData.post_code}
                        onChange={handleInputChange}
                        placeholder="Enter post code"
                        error={!!errors.post_code}
                        hint={errors.post_code}
                        />
                    </div>
                    </div>
                </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="mb-4 text-sm md:text-base font-semibold text-gray-800 dark:text-white/90">
                    Email Notifications
                </h4>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="primary_email" className="pt-2">
                        Primary Email
                        </Label>
                    </div>
                    <div>
                        <Input
                        type="email"
                        id="primary_email"
                        name="primary_email"
                        value={formData.primary_email}
                        onChange={handleInputChange}
                        placeholder="Enter primary email for notifications"
                        error={!!errors.primary_email}
                        hint={errors.primary_email}
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="flex items-start">
                        <Label htmlFor="cc_emails" className="pt-2">
                        CC Emails
                        </Label>
                    </div>
                    <div>
                        <TextArea
                        placeholder="Enter CC emails separated by commas (e.g., email1@example.com, email2@example.com)"
                        value={formData.cc_emails}
                        onChange={(value) => {
                            setFormData({ ...formData, cc_emails: value });
                            if (errors.cc_emails) {
                            setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.cc_emails;
                                return newErrors;
                            });
                            }
                        }}
                        rows={4}
                        error={!!errors.cc_emails}
                        hint={errors.cc_emails}
                        />
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                size='sm'
                type="submit"
                disabled={isSubmitting}
                >
                {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
            </div>
            </form>
        </div>
      </div>
    </>
  );
}
