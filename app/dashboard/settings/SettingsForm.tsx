'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useSessionUser } from '@/hooks/useSessionUser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';
import { updateGlobalSettings } from '@/actions/settings';
import { setGlobalCommissionRate } from '@/actions/commission';
import { updateUserProfile, updateUserRole } from '@/actions/profile';
import { Role } from '@/interfaces/userInterface';
import { checkAuthenticationCode } from '@/lib/helperFunctions';
import {
  User,
  Lock,
  Camera,
  ShieldCheck,
  Save,
  Loader2,
  AlertTriangle,
  Mail,
} from 'lucide-react';

const SettingsForm = ({
  initialGlobalSettings,
  globalCommission,
}: {
  initialGlobalSettings: any;
  globalCommission: number;
}) => {
  const { resetPassword, currentUser: authUser } = useAuth();
  const { user: currentUser } = useSessionUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [name, setName] = useState(
    `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`
  );
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentUser?.photoURL || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(
    (currentUser?.role as Role) || Role.AFFILIATE
  );
  const [authCode, setAuthCode] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [showRoleAuthModal, setShowRoleAuthModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser || authUser) {
      const firstName = currentUser?.firstName ?? '';
      const lastName = currentUser?.lastName ?? '';
      const fullName = `${firstName} ${lastName}`.trim();
      setName(fullName);
      setEmail(currentUser?.email || authUser?.email || '');
      setAvatarPreview(currentUser?.photoURL || authUser?.photoURL || null);
      if (currentUser?.role) {
        setSelectedRole(currentUser.role as Role);
      }
    }
  }, [currentUser, authUser]);

  const [adminSettings, setAdminSettings] = useState({
    maintenanceMode: initialGlobalSettings?.maintenanceMode || false,
    allowRegistration: initialGlobalSettings?.allowRegistration || true,
    globalCommission: globalCommission || 5,
    contactEmail: initialGlobalSettings?.contactEmail || 'support@wephco.com',
  });

  const handleProfileUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const userId = currentUser?.id || authUser?.id;
    if (!userId) {
      toast.error('Unable to identify current user session. Please log in again.');
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      formData.append(
        'existingPhotoURL',
        currentUser?.photoURL || authUser?.photoURL || ''
      );

      const res = await updateUserProfile(userId, formData);

      if (res.success) {
        // Sync updated profile (including new photoURL) into sessionStorage so useSessionUser reflects it on reload
        const updatedSessionUser = {
          ...(currentUser || {}),
          id: userId,
          firstName: res.firstName ?? currentUser?.firstName ?? '',
          lastName: res.lastName ?? currentUser?.lastName ?? '',
          email: res.email ?? email,
          photoURL: res.photoURL ?? avatarPreview,
        };
        sessionStorage.setItem('user', JSON.stringify(updatedSessionUser));

        if (res.photoURL) {
          setAvatarPreview(res.photoURL);
        }
        setAvatarFile(null);

        toast.success('Profile updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleUpdateWithCode = async () => {
    console.log(currentUser?.role);
    if (!authUser?.id) {
      console.log('User ID not found');
      return;
    }
    if (!authCode.trim()) {
      toast.error('Please enter the authentication code.');
      setShowRoleAuthModal(false);
      return;
    }
    console.log(currentUser?.role + 'Position 2');
    const valid = checkAuthenticationCode(authCode);

    if (!valid) {
      toast.error('Invalid authentication code');
      return;
    }
    console.log(currentUser?.role + 'Position 3');
    setIsUpdatingRole(true);
    const res = await updateUserRole(authUser.id, selectedRole);

    if (res.success) {
      toast.success('Role updated successfully');
      setAuthCode('');
      setShowRoleAuthModal(false);
      console.log(currentUser?.role + 'Position 4');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.error(res.message || 'Failed to update role');
      console.log(currentUser?.role + 'Position 5');
    }
    setIsUpdatingRole(false);
    console.log(currentUser?.role + 'Position 6');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const settingsRes = await updateGlobalSettings({
      maintenanceMode: adminSettings.maintenanceMode,
      allowRegistration: adminSettings.allowRegistration,
      contactEmail: adminSettings.contactEmail,
    });

    const commRes = await setGlobalCommissionRate(
      adminSettings.globalCommission
    );

    setIsSaving(false);

    if (settingsRes.success && commRes.success) {
      toast.success('Admin settings updated successfully');
    } else {
      toast.error('Failed to update some settings');
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    try {
      await resetPassword(currentUser.email);
      toast.info('Password reset email sent to ' + currentUser.email);
    } catch (error) {
      toast.error('Failed to send reset email');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    ...(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN'
      ? [{ id: 'admin', label: 'Admin Settings', icon: ShieldCheck }]
      : []),
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#fef9e8] text-[#cfb53b] shadow-sm border border-[#cfb53b]/20'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}>
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your profile details and how others see you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Avatar Preview"
                            width={96}
                            height={96}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <User className="h-10 w-10 text-slate-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-[#cfb53b] text-white rounded-full hover:bg-[#b59d32] transition-colors shadow-sm"
                        title="Change picture">
                        <Camera className="h-4 w-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="font-medium text-slate-800">
                        Profile Picture
                      </h3>
                      <p className="text-sm text-slate-500">
                        JPG, GIF or PNG. Max size of 5MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-slate-700 font-semibold">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="text-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-slate-700 font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="text-black"
                      />
                      <p className="text-[10px] text-gray-400">
                        Updating your email might require re-verification.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#cfb53b] hover:bg-[#b59d32] text-white">
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Role Changer Section */}
            <Card className="bg-white border-gray-100 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  Account Role Upgrade
                </CardTitle>
                <CardDescription>
                  Select a new dashboard access role. An authentication code is
                  required to authorize this change.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-end gap-6">
                  <div className="space-y-2 flex-1 w-full">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">
                      Current Role
                    </span>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 font-bold text-slate-800">
                      {currentUser?.role || 'None'}
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <Label
                      htmlFor="roleSelect"
                      className="text-slate-700 font-semibold">
                      Select New Role
                    </Label>
                    <select
                      id="roleSelect"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as Role)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#cfb53b]"
                      disabled={isUpdatingRole}>
                      {Object.values(Role).map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleOption}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <Button
                      type="button"
                      onClick={() => {
                        if (selectedRole === currentUser?.role) {
                          toast.info(
                            'Please select a different role to update.'
                          );
                          return;
                        }
                        setShowRoleAuthModal(true);
                      }}
                      className="bg-[#cfb53b] hover:bg-[#b59d32] text-white w-full h-[46px]">
                      Update Role
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Manage your account security and password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Change Password</h4>
                    <p className="text-xs text-gray-500">
                      Receive an email to reset your password securely.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handlePasswordReset}>
                    <Mail className="mr-2 h-4 w-4" />
                    Reset via Email
                  </Button>
                </div>

                <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/30 flex gap-3">
                  <ShieldCheck className="text-blue-500 h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-blue-900">
                      Account Verified
                    </h4>
                    <p className="text-xs text-blue-700">
                      Your account is secured with Firebase authentication.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'admin' &&
          (currentUser?.role === 'ADMIN' ||
            currentUser?.role === 'SUPERADMIN') && (
            <Card className="bg-white border-red-100 shadow-sm">
              <CardHeader className="bg-red-50/30">
                <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                  <AlertTriangle className="text-red-500 h-5 w-5" />
                  Administrative Controls
                </CardTitle>
                <CardDescription>
                  Global system settings. Changes here affect all users.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAdminUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-semibold text-slate-700">
                          Maintenance Mode
                        </Label>
                        <p className="text-xs text-gray-500">
                          Put the site in maintenance mode. Only admins can
                          access.
                        </p>
                      </div>
                      <Switch
                        checked={adminSettings.maintenanceMode}
                        onCheckedChange={(val) =>
                          setAdminSettings({
                            ...adminSettings,
                            maintenanceMode: val,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-semibold text-slate-700">
                          Allow New Registrations
                        </Label>
                        <p className="text-xs text-gray-500">
                          Enable or disable new user signups on the platform.
                        </p>
                      </div>
                      <Switch
                        checked={adminSettings.allowRegistration}
                        onCheckedChange={(val) =>
                          setAdminSettings({
                            ...adminSettings,
                            allowRegistration: val,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2 p-4 border border-gray-100 rounded-xl">
                      <Label className="text-sm font-semibold text-slate-700">
                        Global Commission Rate (%)
                      </Label>
                      <div className="flex gap-4">
                        <Input
                          type="number"
                          value={adminSettings.globalCommission}
                          onChange={(e) =>
                            setAdminSettings({
                              ...adminSettings,
                              globalCommission: parseFloat(e.target.value),
                            })
                          }
                          className="max-w-[200px] text-black"
                        />
                        <p className="text-xs text-gray-500 flex items-center italic">
                          Default rate for new agents.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 p-4 border border-gray-100 rounded-xl">
                      <Label className="text-sm font-semibold text-slate-700">
                        Support Contact Email
                      </Label>
                      <Input
                        type="email"
                        value={adminSettings.contactEmail}
                        onChange={(e) =>
                          setAdminSettings({
                            ...adminSettings,
                            contactEmail: e.target.value,
                          })
                        }
                        className="text-black"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    variant="destructive">
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Update Global Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Dialog for Role Authentication Code */}
      <Dialog open={showRoleAuthModal} onOpenChange={setShowRoleAuthModal}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-100 text-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-lg font-bold">
              Role Upgrade Authentication
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Please enter the authentication code to verify the role upgrade to{' '}
              <span className="font-bold text-slate-800">{selectedRole}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="modalAuthCode"
                className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Auth Code
              </label>
              <Input
                id="modalAuthCode"
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Enter auth code"
                className="text-black"
                disabled={isUpdatingRole}
                required
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowRoleAuthModal(false);
                setAuthCode('');
              }}
              disabled={isUpdatingRole}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRoleUpdateWithCode}
              disabled={!authCode.trim() || isUpdatingRole}
              className="bg-[#cfb53b] hover:bg-[#b59d32] text-white">
              {isUpdatingRole ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Verify & Update'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsForm;
