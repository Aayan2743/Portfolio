// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { User, Camera } from "lucide-react";
// import { usePortfolio } from "@/contexts/PortfolioContext";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const maxImageSizeBytes = 5 * 1024 * 1024;

// const AdminProfile = () => {
//   const { adminProfile, fetchAdminProfile, updateAdminProfile } = usePortfolio();
//   const fileInputRef = useRef(null);
//   const previewObjectUrlRef = useRef(null);

//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [preview, setPreview] = useState(adminProfile?.avatar || "");
//   const [formData, setFormData] = useState({
//     name: adminProfile?.name || "",
//     email: adminProfile?.email || "",
//     currentPassword: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const clearObjectPreview = () => {
//     if (previewObjectUrlRef.current) {
//       URL.revokeObjectURL(previewObjectUrlRef.current);
//       previewObjectUrlRef.current = null;
//     }
//   };

//   useEffect(() => {
//     fetchAdminProfile?.().catch((error) => {
//       if (error?.message) {
//         toast.error(error.message);
//       }
//     });
//   }, [fetchAdminProfile]);

//   useEffect(() => {
//     if (isEditing) {
//       return;
//     }
//     setFormData((prev) => ({
//       ...prev,
//       name: adminProfile?.name || "",
//       email: adminProfile?.email || "",
//       currentPassword: "",
//       password: "",
//       confirmPassword: "",
//     }));
//     setPreview(adminProfile?.avatar || "");
//   }, [adminProfile, isEditing]);

//   useEffect(() => {
//     return () => {
//       clearObjectPreview();
//     };
//   }, []);

//   const handleImageChange = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) {
//       return;
//     }
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please upload a valid image file");
//       return;
//     }
//     if (file.size > maxImageSizeBytes) {
//       toast.error("Image must be under 5MB");
//       return;
//     }

//     clearObjectPreview();
//     const nextPreview = URL.createObjectURL(file);
//     previewObjectUrlRef.current = nextPreview;

//     setSelectedImage(file);
//     setPreview(nextPreview);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setSelectedImage(null);
//     clearObjectPreview();
//     setPreview(adminProfile?.avatar || "");
//     setFormData({
//       name: adminProfile?.name || "",
//       email: adminProfile?.email || "",
//       currentPassword: "",
//       password: "",
//       confirmPassword: "",
//     });
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const trimmedName = formData.name.trim();
//     const trimmedEmail = formData.email.trim();

//     if (!trimmedName) {
//       toast.error("Name is required");
//       return;
//     }
//     if (!trimmedEmail) {
//       toast.error("Email is required");
//       return;
//     }
//     if (!emailRegex.test(trimmedEmail)) {
//       toast.error("Please enter a valid email");
//       return;
//     }
//     if (formData.password && formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }
//     if (formData.password && !formData.currentPassword) {
//       toast.error("Current password is required to set a new password");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = new FormData();
//       payload.append("name", trimmedName);
//       payload.append("email", trimmedEmail);
//       if (formData.currentPassword) {
//         payload.append("current_password", formData.currentPassword);
//       }
//       if (formData.password) {
//         payload.append("password", formData.password);
//       }
//       if (selectedImage) {
//         payload.append("avatar", selectedImage);
//       }

//       const updatedProfile = await updateAdminProfile(payload);
//       if (updatedProfile?.avatar) {
//         clearObjectPreview();
//         setPreview(updatedProfile.avatar);
//       }

//       setIsEditing(false);
//       setSelectedImage(null);
//       setFormData((prev) => ({
//         ...prev,
//         currentPassword: "",
//         password: "",
//         confirmPassword: "",
//       }));
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error(error?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold text-primary mb-2">Profile Settings</h1>
//         <p className="text-muted-foreground">
//           Manage your admin profile information 
//         </p>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-card rounded-2xl shadow-card p-8"
//       >
//         <div className="flex flex-col items-center mb-8">
//           <div
//             className="relative group cursor-pointer"
//             onClick={() => isEditing && fileInputRef.current?.click()}
//           >
//             <div className="w-24 h-24 rounded-full bg-accent/10 overflow-hidden flex items-center justify-center">
//               {preview ? (
//                 <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
//               ) : (
//                 <User className="w-10 h-10 text-accent" />
//               )}
//             </div>
//             {isEditing && (
//               <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                 <Camera className="w-6 h-6 text-white" />
//               </div>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               className="hidden"
//             />
//           </div>

//           <h2 className="text-xl font-bold mt-4">{adminProfile?.name}</h2>
//           <p className="text-muted-foreground">{adminProfile?.email}</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">Name</label>
//             <Input
//               disabled={!isEditing}
//               value={formData.name}
//               onChange={(event) =>
//                 setFormData((prev) => ({ ...prev, name: event.target.value }))
//               }
//               className="h-12"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Email</label>
//             <Input
//               type="email"
//               disabled={!isEditing}
//               value={formData.email}
//               onChange={(event) =>
//                 setFormData((prev) => ({ ...prev, email: event.target.value }))
//               }
//               className="h-12"
//             />
//           </div>

//           {isEditing && (
//             <div>
//               <label className="block text-sm font-medium mb-2">Profile Image</label>
//               <div className="flex items-center gap-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="shrink-0"
//                 >
//                   Upload Image
//                 </Button>
//                 <span className="text-sm text-muted-foreground truncate">
//                   {selectedImage?.name ||
//                     (preview ? "Current image selected" : "No image selected")}
//                 </span>
//               </div>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Accepted: image files up to 5MB
//               </p>
//             </div>
//           )}

//           {isEditing && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Current Password
//                 </label>
//                 <Input
//                   type="password"
//                   placeholder="Enter current password"
//                   value={formData.currentPassword}
//                   onChange={(event) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       currentPassword: event.target.value,
//                     }))
//                   }
//                   className="h-12"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Password</label>
//                 <Input
//                   type="password"
//                   placeholder="Leave blank if not changing"
//                   value={formData.password}
//                   onChange={(event) =>
//                     setFormData((prev) => ({ ...prev, password: event.target.value }))
//                   }
//                   className="h-12"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Confirm Password ggg
//                 </label>
//                 <Input
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={(event) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       confirmPassword: event.target.value,
//                     }))
//                   }
//                   className="h-12"
//                 />
//               </div>
//             </>
//           )}
//           <div className="flex gap-4">
//             {isEditing ? (
//               <>
//                 <Button type="submit" disabled={loading} className="flex-1">
//                   {loading ? "Updating..." : "Save Changes"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleCancel}
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//               </>
//             ) : (
//               <Button type="button" onClick={() => setIsEditing(true)} className="w-full">
//                 Edit Profile
//               </Button>
//             )}
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default AdminProfile;



import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import apiClient from "../../lib/axiosInstance";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AdminProfile = () => {
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get("admin-dashboard/profile");

      const data = res.data.data;

      const profileData = {
        name: data.name || "",
        email: data.email || "",
        phone: String(data.phone ?? ""),
      };

      setFormData({
        ...profileData,
        password: "",
      });

      setOriginalData(profileData);
      setPreview(data.avatar_url || "");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load profile"
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= HANDLE IMAGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be under 5MB");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    setSelectedImage(file);
    setPreview(objectUrl);
  };

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = String(formData.phone ?? "").trim();

    if (!name) return toast.error("Name is required");
    if (!email) return toast.error("Email is required");
    if (!phone) return toast.error("Phone is required");
    if (!emailRegex.test(email))
      return toast.error("Invalid email format");

    if (formData.password && formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    // Check if any changes were made
    const hasChanges = 
      name !== originalData.name ||
      email !== originalData.email ||
      phone !== originalData.phone ||
      formData.password.trim() !== "" ||
      selectedImage !== null;

    if (!hasChanges) {
      return toast.error("No changes to save");
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", name);
      payload.append("email", email);
      payload.append("phone", phone);

      if (formData.password) {
        payload.append("password", formData.password);
      }

      if (selectedImage) {
        payload.append("avatar", selectedImage);
      }

      const res = await apiClient.post("admin-dashboard/profile/update", payload);

      if (res.data.status) {
        toast.success(res.data.message || "Profile updated successfully");

        setIsEditing(false);
        setSelectedImage(null);
        setFormData((prev) => ({
          ...prev,
          password: "",
        }));

        fetchProfile();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(
          err?.response?.data?.message || "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin profile information
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl shadow-card p-8"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-500" />
              )}
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            disabled={!isEditing}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Name"
          />

          <Input
            disabled={!isEditing}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
          />

          <Input
            disabled={!isEditing}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Phone"
          />

          {isEditing && (
            <Input
              type="password"
              placeholder="New Password (optional)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          )}

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
