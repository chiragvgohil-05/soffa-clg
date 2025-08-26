import React, { useEffect, useState } from "react";
import apiStore from "../../apiClient";
import "../styles/AdminProfilePage.css";
import { FaPencilAlt, FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 add icons
import toast from "react-hot-toast";

const AdminProfilePage = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        password: "",
        image: null,
        preview: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

    const fetchProfile = async () => {
        try {
            const res = await apiStore.get("/auth/profile");
            setProfile((prev) => ({
                ...prev,
                name: res.data.data.name,
                email: res.data.data.email,
                image: res.data.data.image || null,
                preview: res.data.data.image || "",
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile", { id: "profile-toast" });
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({
                ...profile,
                image: file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", profile.name);
            formData.append("email", profile.email);
            if (profile.password) formData.append("password", profile.password);
            if (profile.image instanceof File) {
                formData.append("image", profile.image);
            }

            const res = await apiStore.put("/auth/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(res.data.message, { id: "profile-toast" });
            setProfile((prev) => ({
                ...prev,
                preview: res.data.data.image || prev.preview,
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile", { id: "profile-toast" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-profile-container">
            <h2 className="admin-profile-title">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="admin-profile-form">
                <div className="admin-profile-header">
                    <div className="admin-profile-img-wrapper">
                        <img
                            src={
                                profile.preview ||
                                "https://via.placeholder.com/150?text=Profile"
                            }
                            alt="Profile"
                            className="admin-profile-img"
                        />
                        <label htmlFor="file-upload" className="admin-edit-icon">
                            <FaPencilAlt />
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="admin-profile-fields">
                        <div className="admin-form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/*<div className="form-group password-field">*/}
                        {/*    <label>Password (change optional):</label>*/}
                        {/*    <div className="password-input">*/}
                        {/*        <input*/}
                        {/*            type={showPassword ? "text" : "password"} // 👈 toggle*/}
                        {/*            name="password"*/}
                        {/*            value={profile.password}*/}
                        {/*            onChange={handleChange}*/}
                        {/*        />*/}
                        {/*        <span*/}
                        {/*            className="toggle-password"*/}
                        {/*            onClick={() => setShowPassword(!showPassword)}*/}
                        {/*            >*/}
                        {/*          {showPassword ? <FaEyeSlash /> : <FaEye />}*/}
                        {/*        </span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default AdminProfilePage;
