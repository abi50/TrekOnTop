import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../reduxs/store";
import EditProfileModal from "../components/EditProfileModal";
import PasswordVerificationModal from "../components/PasswordVerificationModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ExportUserDataModal from "../components/ExportUserDataModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import "../styles/UserProfilePage.css";

const UserProfilePage = () => {
    const user = useSelector((state: RootState) => state.user);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [verifyPasswordModal, setVerifyPasswordModal] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showExportData, setShowExportData] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchProfileImage = async () => {
            try {
                const res = await axios.get(
                    `https://localhost:7083/api/User/getimage/${user.user?.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                        responseType: "blob",
                    }
                );
                setProfileImageUrl(URL.createObjectURL(res.data));
            } catch (e) {
                console.error("שגיאה בטעינת תמונת הפרופיל", e);
            }
        };

        const fetchRecommendations = async () => {
            try {
                const res = await axios.get("https://localhost:7083/api/Recommendation");
                const userRecs = res.data.filter((r: any) => r.userId === user.user?.id);
                setRecommendations(userRecs);
            } catch (e) {
                console.error("שגיאה בטעינת המלצות", e);
            }
        };

        const fetchPlaces = async () => {
            try {
                const res = await axios.get("https://localhost:7083/api/Place");
                setPlaces(res.data);
            } catch (e) {
                console.error("שגיאה בטעינת מקומות", e);
            }
        };

        fetchProfileImage();
        fetchRecommendations();
        fetchPlaces();
    }, [user]);

    if (!user) {
        return <div className="wallet-style">משתמש לא מחובר</div>;
    }

    const sortedRecommendations = [...recommendations].sort((a, b) => a.placeId - b.placeId);

    const handleEditClick = () => {
        setVerifyPasswordModal(true);
    };

    const handleVerified = () => {
        setVerifyPasswordModal(false);
        setShowModal(true);
    };

    return (
        <div className="wallet-style">
            <h2 className="section-title">פרטי המשתמש</h2>
            <div className="user-card">
                <div className="user-info">
                    <div className="icon-placeholder">
                        <img src={profileImageUrl} alt="Profile" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: "1.8rem" }}>{user.user?.name}</h4>
                        <p>{user.user?.email}</p>
                    </div>
                </div>
                <div className="field-group">
                    <label>סיסמה</label>
                    <div className="password-wrapper">
                        <input type={showPassword ? "text" : "password"} value="*************" disabled />
                        <button
                            className="toggle-visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                        >
                            👁️
                        </button>
                    </div>
                </div>
                <div className="actions dropdown-actions">
                    <button className="main-action">אפשרויות ⚙</button>
                    <div className="dropdown-menu">
                        <button onClick={handleEditClick}>✏ ערוך פרופיל</button>
                        <button onClick={() => setShowChangePassword(true)}>🔑 שנה סיסמה</button>
                        <button onClick={() => setShowExportData(true)}>📁 ייצא נתונים</button>
                        <button onClick={() => setShowDeleteAccount(true)}>🗑 מחק חשבון</button>
                    </div>
                </div>
            </div>

            {verifyPasswordModal && (
                <PasswordVerificationModal
                    token={user.token!}
                    onSuccess={handleVerified}
                    onClose={() => setVerifyPasswordModal(false)}
                />
            )}

            {showModal && (
                <EditProfileModal
                    user={{
                        id: user.user!.id,
                        name: user.user!.name,
                        email: user.user!.email,
                        token: user.token!,
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}

            {showChangePassword && (
                <ChangePasswordModal
                    token={user.token!}
                    onClose={() => setShowChangePassword(false)}
                />
            )}

            {showExportData && (
                <ExportUserDataModal
                    token={user.token!}
                    onClose={() => setShowExportData(false)}
                />
            )}

            {showDeleteAccount && (
                <DeleteAccountModal
                    userId={user.user!.id}
                    token={user.token!}
                    onClose={() => setShowDeleteAccount(false)}
                />
            )}

            <h3 className="recommendations-title" style={{ fontSize: "1.6rem" }}>ההמלצות שלי</h3>
            <div className="recommendation-list">
                {sortedRecommendations.map((rec: any) => {
                    const place = places.find(p => p.placeId === rec.placeId);
                    return (
                        <div key={rec.recoId} className="recommendation-card">
                            <h4>{rec.title}</h4>
                            <p>{rec.description}</p>
                            <p style={{ fontStyle: "italic", color: "#666" }}>מקום: {place?.placeName || "לא ידוע"}</p>
                            <div className="likes">
                                <span className="like">👍 {rec.likes}</span>
                                <span className="dislike">👎 {rec.dislikes}</span>
                            </div>
                            <button onClick={() => window.location.href = `/edit-recommendation/${rec.recoId}`}>ערוך המלצה</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserProfilePage;
